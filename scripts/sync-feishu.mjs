import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, rename, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const API = 'https://open.feishu.cn/open-apis/'
const MAX_IMAGE_BYTES = 25 * 1024 * 1024
const CONFIG_KEYS = ['FEISHU_APP_ID', 'FEISHU_APP_SECRET', 'FEISHU_BASE_TOKEN', 'FEISHU_PHOTOS_TABLE_ID', 'FEISHU_MEMBERS_TABLE_ID']
const PHOTO_FIELDS = { 名称: 1, 照片: 17, 是否展示: 7 }
const MEMBER_FIELDS = { 姓名: 1, 组别标识: [1, 3, 4], 职务: [1, 3], 是否展示: 7 }
const PHOTO_OPTIONAL_FIELDS = { 排序: 2, 说明: 1, 布局高度: 2 }
const MEMBER_OPTIONAL_FIELDS = { 组别名称: 1, 组别排序: 2, 是否组长: 7, 排序: 2, 头像: 17, 简介: 1, 个人链接: 15 }
const GROUPS = {
  指导老师: 'advisors', 管理层: 'management', 底盘组: 'chassis', 电气组: 'electrical',
  空套组: 'aero', 单体壳组: 'monocoque', 运营组: 'operations', 无人组: 'autonomous', 赛车手: 'drivers',
}

const wait = (ms) => new Promise((done) => setTimeout(done, ms))
const hash = (value) => createHash('sha256').update(value).digest('hex').slice(0, 24)

export function readConfig(env = process.env) {
  const missing = CONFIG_KEYS.filter((key) => !env[key]?.trim())
  if (missing.length) throw new Error(`缺少 GitHub Secrets：${missing.join(', ')}`)
  return Object.fromEntries(CONFIG_KEYS.map((key) => [key, env[key].trim()]))
}

export class FeishuClient {
  constructor({ fetchImpl = fetch, pause = wait } = {}) {
    this.fetch = fetchImpl
    this.pause = pause
    this.token = undefined
  }

  async request(path, options = {}) {
    for (let attempt = 0; attempt < 3; attempt++) {
      await this.pause(attempt ? 1000 * 2 ** attempt : 200)
      let response
      try {
        response = await this.fetch(new URL(path, API), {
          ...options,
          headers: { ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}), ...options.headers },
          signal: AbortSignal.timeout(60_000),
          redirect: 'error',
        })
      } catch {
        if (attempt < 2) continue
        throw new Error('飞书连接失败或超时；本次发布已停止。')
      }
      if ((response.status === 429 || response.status >= 500) && attempt < 2) {
        await response.body?.cancel()
        continue
      }
      if (!response.ok) {
        const failure = await response.json().catch(() => null)
        const code = typeof failure?.code === 'number' ? `，code ${failure.code}` : ''
        throw new Error(`飞书请求失败（HTTP ${response.status}${code}）；请检查应用凭证、权限和表格授权。`)
      }
      return response
    }
  }

  async json(path, options) {
    const response = await this.request(path, options)
    let data
    try {
      data = await response.json()
    } catch {
      throw new Error('飞书返回的 JSON 无法解析；本次发布已停止。')
    }
    // Do not log API bodies: they can contain tokens and unpublished records.
    if (data.code !== 0) throw new Error(`飞书接口错误（code ${data.code ?? 'unknown'}）；请检查应用权限、表格 ID 和字段设置。`)
    return data
  }

  async authenticate(config) {
    const result = await this.json('auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: config.FEISHU_APP_ID, app_secret: config.FEISHU_APP_SECRET }),
    })
    if (typeof result.tenant_access_token !== 'string' || !result.tenant_access_token) throw new Error('飞书未返回应用访问凭证。')
    this.token = result.tenant_access_token
  }

  async list(base, table, resource) {
    const items = []
    const seenPages = new Set()
    let pageToken = ''
    do {
      const params = new URLSearchParams({ page_size: '100' })
      if (pageToken) params.set('page_token', pageToken)
      const result = await this.json(`bitable/v1/apps/${encodeURIComponent(base)}/tables/${encodeURIComponent(table)}/${resource}?${params}`)
      if (!result.data || !Array.isArray(result.data.items)) throw new Error('飞书列表返回格式异常。')
      items.push(...result.data.items)
      if (!result.data.has_more) break
      pageToken = result.data.page_token
      if (!pageToken || seenPages.has(pageToken)) throw new Error('飞书分页游标异常；本次发布已停止。')
      seenPages.add(pageToken)
    } while (true)
    return items
  }

  async download(tableId, fieldId, recordId, fileToken) {
    const extra = { bitablePerm: { tableId, attachments: { [fieldId]: { [recordId]: [fileToken] } } } }
    const params = new URLSearchParams({ extra: JSON.stringify(extra) })
    const response = await this.request(`drive/v1/medias/${encodeURIComponent(fileToken)}/download?${params}`)
    if (Number(response.headers.get('content-length')) > MAX_IMAGE_BYTES) {
      await response.body?.cancel()
      throw new Error('图片超过 25 MiB，请压缩后重新上传。')
    }
    const chunks = []
    let size = 0
    for await (const chunk of response.body) {
      size += chunk.length
      if (size > MAX_IMAGE_BYTES) throw new Error('图片超过 25 MiB，请压缩后重新上传。')
      chunks.push(Buffer.from(chunk))
    }
    const bytes = Buffer.concat(chunks)
    return { bytes, extension: imageExtension(bytes) }
  }
}

export function imageExtension(bytes) {
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return 'png'
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'jpg'
  if (['GIF87a', 'GIF89a'].includes(bytes.subarray(0, 6).toString())) return 'gif'
  if (bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP') return 'webp'
  throw new Error('附件不是支持的图片格式，请使用 JPG、PNG、WebP 或 GIF。')
}

export function validateFields(fields, required, optional = {}) {
  const map = new Map(fields.map((field) => [field.field_name, field]))
  for (const [name, type] of Object.entries(required)) {
    if (!(Array.isArray(type) ? type : [type]).includes(map.get(name)?.type)) throw new Error(`字段“${name}”缺失或类型错误，请按配置说明设置字段类型。`)
  }
  for (const [name, type] of Object.entries(optional)) {
    if (map.has(name) && map.get(name).type !== type) throw new Error(`可选字段“${name}”类型错误，请按配置说明设置字段类型。`)
  }
  return map
}

function text(value, label, required = false) {
  // Text fields can be returned as either strings or arrays of text segments.
  if (Array.isArray(value)) {
    if (value.some((part) => typeof part !== 'object' || typeof part?.text !== 'string')) throw new Error(`字段“${label}”必须是文本。`)
    value = value.map((part) => part.text).join('')
  }
  if (value == null) value = ''
  if (typeof value !== 'string') throw new Error(`字段“${label}”必须是文本。`)
  value = value.trim()
  if (required && !value) throw new Error(`展示记录的“${label}”不能为空。`)
  return value
}

function number(value, label, fallback = 0) {
  if (value == null || value === '') return fallback
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`字段“${label}”必须是数字。`)
  return value
}

function checkbox(value, label) {
  if (value == null) return false
  if (typeof value !== 'boolean') throw new Error(`字段“${label}”必须是复选框。`)
  return value
}

function attachment(value, required) {
  if (value == null || (Array.isArray(value) && !value.length)) {
    if (required) throw new Error('展示的照片记录必须上传一张照片。')
    return undefined
  }
  if (!Array.isArray(value) || value.length !== 1 || typeof value[0]?.file_token !== 'string' || !value[0].file_token) {
    throw new Error('照片或头像字段每条记录只能上传一张图片。')
  }
  return value[0]
}

function link(value) {
  if (value == null || value === '') return ''
  const candidate = typeof value === 'object' && value !== null ? value.link : value
  try {
    const url = new URL(candidate)
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error()
    return url.href
  } catch {
    throw new Error('个人链接必须是有效的 http 或 https 地址。')
  }
}

function publishedRows(records) {
  const seen = new Set()
  return records.filter((record) => {
    if (!record.fields || typeof record.record_id !== 'string' || seen.has(record.record_id)) throw new Error('飞书记录格式异常或出现重复记录。')
    seen.add(record.record_id)
    return checkbox(record.fields['是否展示'], '是否展示')
  }).sort((a, b) => number(a.fields['排序'], '排序') - number(b.fields['排序'], '排序'))
}

function memberGroups(fields, memberFields, role) {
  if (role === '指导老师') return [{ key: 'advisors', title: '指导老师', order: 0 }]
  const field = memberFields.get('组别标识')
  let selections
  if (field.type === 4) {
    selections = fields['组别标识'] ?? []
    if (!Array.isArray(selections) || selections.some((value) => typeof value !== 'string')) throw new Error('组别标识必须是有效的多选值。')
  } else selections = [text(fields['组别标识'], '组别标识', true)]
  if (!selections.length) throw new Error('展示的成员至少选择一个组别；指导老师可仅设置职务。')
  const options = field.property?.options?.map((option) => option.name) ?? []
  return [...new Set(selections)].map((selection) => {
    const name = selection.trim()
    if (!name) throw new Error('组别选项不能为空。')
    const legacyTitle = text(fields['组别名称'], '组别名称')
    let key, title
    if (legacyTitle) {
      if (!/^[a-z][a-z0-9_-]{0,39}$/.test(name)) throw new Error('旧格式的组别标识须为小写英文。')
      key = name
      title = legacyTitle
    } else {
      key = GROUPS[name] ?? (/^[a-z][a-z0-9_-]{0,39}$/.test(name) ? name : `group-${hash(name)}`)
      title = name
    }
    const index = options.indexOf(selection)
    return { key, title, order: number(fields['组别排序'], '组别排序', index < 0 ? 100 : index + 1) }
  })
}

export async function buildContent({ photoRecords, memberRecords, photoFields, memberFields, saveImage, now = new Date() }) {
  const photos = []
  const groups = new Map()
  for (const row of publishedRows(photoRecords)) {
    const f = row.fields
    const name = text(f['名称'], '名称', true)
    const caption = text(f['说明'], '说明') || name
    const file = attachment(f['照片'], true)
    const img = await saveImage('photos', photoFields.get('照片').field_id, row.record_id, file)
    const height = number(f['布局高度'], '布局高度', 400)
    if (height < 240 || height > 800) throw new Error('布局高度须在 240 至 800 之间。')
    photos.push({ id: hash(row.record_id), img, url: img, height, caption })
  }
  for (const row of publishedRows(memberRecords)) {
    const f = row.fields
    const role = text(f['职务'], '职务')
    const member = {
      name: text(f['姓名'], '姓名', true),
      role,
      desc: text(f['简介'], '简介'),
      link: link(f['个人链接']),
    }
    const file = attachment(f['头像'], false)
    if (file) member.avatar = await saveImage('members', memberFields.get('头像').field_id, row.record_id, file)
    const definitions = memberGroups(f, memberFields, role)
    if (role === '组长' && !memberFields.has('是否组长') && definitions.length !== 1) throw new Error('职务为组长的成员只能选择一个组别；其他职务可以多选。')
    for (const definition of definitions) {
      const { key, title, order } = definition
      let group = groups.get(key)
      if (!group) {
        group = { key, title, order, members: [] }
        groups.set(key, group)
      }
      if (group.title !== title || group.order !== order) throw new Error('同一组别的名称和组别排序必须一致。')
      const leader = memberFields.has('是否组长')
        ? checkbox(f['是否组长'], '是否组长')
        : role === '组长' || (role === '队长' && key === 'management')
      if (leader) {
        if (key === 'advisors') throw new Error('指导老师组不设置组长。')
        if (group.leader) throw new Error('每组只能设置一名组长；请检查组长成员选择的组别。')
        group.leader = member
      } else group.members.push(member)
    }
  }
  const teamGroups = [...groups.values()].sort((a, b) => a.order - b.order || a.key.localeCompare(b.key)).map(({ order, ...group }) => group)
  return { version: 1, syncedAt: now.toISOString(), photos, groups: teamGroups }
}

export async function syncFeishu({ root = ROOT, config = readConfig(), client = new FeishuClient() } = {}) {
  await client.authenticate(config)
  const base = config.FEISHU_BASE_TOKEN
  const photoTable = config.FEISHU_PHOTOS_TABLE_ID
  const memberTable = config.FEISHU_MEMBERS_TABLE_ID
  // Finish every API call and validation in staging before replacing live build inputs.
  const photoFields = validateFields(await client.list(base, photoTable, 'fields'), PHOTO_FIELDS, PHOTO_OPTIONAL_FIELDS)
  const memberFields = validateFields(await client.list(base, memberTable, 'fields'), MEMBER_FIELDS, MEMBER_OPTIONAL_FIELDS)
  const photoRecords = await client.list(base, photoTable, 'records')
  const memberRecords = await client.list(base, memberTable, 'records')
  const parent = join(root, 'public', 'content')
  await mkdir(parent, { recursive: true })
  const stage = await mkdtemp(join(parent, '.feishu-stage-'))
  const destination = join(parent, 'feishu')
  const backup = `${stage}-backup`
  let backedUp = false
  try {
    const downloaded = new Map()
    const saveImage = async (kind, fieldId, recordId, file) => {
      const cacheKey = `${kind}:${file.file_token}`
      if (downloaded.has(cacheKey)) return downloaded.get(cacheKey)
      const { bytes, extension } = await client.download(kind === 'photos' ? photoTable : memberTable, fieldId, recordId, file.file_token)
      const filename = `${hash(bytes)}.${extension}`
      await mkdir(join(stage, 'images'), { recursive: true })
      await writeFile(join(stage, 'images', filename), bytes)
      const path = `content/feishu/images/${filename}`
      downloaded.set(cacheKey, path)
      return path
    }
    const content = await buildContent({ photoRecords, memberRecords, photoFields, memberFields, saveImage })
    await writeFile(join(stage, 'snapshot.json'), `${JSON.stringify(content, null, 2)}\n`)
    try {
      await rename(destination, backup)
      backedUp = true
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
    try {
      await rename(stage, destination)
    } catch (error) {
      if (backedUp) await rename(backup, destination)
      throw error
    }
    await rm(backup, { recursive: true, force: true })
    console.log(`飞书同步完成：${content.photos.length} 张照片，${content.groups.length} 个成员组。`)
    return content
  } finally {
    await rm(stage, { recursive: true, force: true })
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  syncFeishu().catch((error) => {
    // Never print stack traces or raw responses that could include credentials.
    console.error(error.message)
    process.exitCode = 1
  })
}
