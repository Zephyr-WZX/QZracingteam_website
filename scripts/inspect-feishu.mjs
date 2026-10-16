import { FeishuClient, readConfig } from './sync-feishu.mjs'
import { createCipheriv, publicEncrypt, randomBytes, constants } from 'node:crypto'
import { readFile } from 'node:fs/promises'

try {
  const config = readConfig()
  const client = new FeishuClient()
  console.log('检查应用凭证')
  await client.authenticate(config)
  const schema = []
  const tables = []
  let cursor = ''
  const seen = new Set()
  do {
    const params = new URLSearchParams({ page_size: '100' })
    if (cursor) params.set('page_token', cursor)
    const result = await client.json(`bitable/v1/apps/${encodeURIComponent(config.FEISHU_BASE_TOKEN)}/tables?${params}`)
    if (!Array.isArray(result.data?.items)) throw new Error('无法读取数据表列表。')
    tables.push(...result.data.items)
    if (!result.data.has_more) break
    cursor = result.data.page_token
    if (!cursor || seen.has(cursor)) throw new Error('数据表列表分页异常。')
    seen.add(cursor)
  } while (true)
  console.log('已取得数据表列表，读取字段结构')
  for (const table of tables) {
    const fields = await client.list(config.FEISHU_BASE_TOKEN, table.table_id, 'fields')
    schema.push({
      table: table.name,
      tableId: table.table_id,
      configuredPhotos: table.table_id === config.FEISHU_PHOTOS_TABLE_ID,
      configuredMembers: table.table_id === config.FEISHU_MEMBERS_TABLE_ID,
      fields: fields.map((field) => ({
        name: field.field_name,
        type: field.type,
        uiType: field.ui_type,
        ...(field.property?.options ? { options: field.property.options.map((option) => option.name) } : {}),
      })),
    })
  }
  // The repository is public: only encrypted metadata may enter Actions logs.
  const key = randomBytes(32)
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', key, iv)
  const data = Buffer.concat([cipher.update(JSON.stringify(schema), 'utf8'), cipher.final()])
  const publicKey = await readFile(new URL('../config/feishu-inspection-public.pem', import.meta.url))
  const envelope = {
    key: publicEncrypt({ key: publicKey, padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' }, key).toString('base64'),
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    data: data.toString('base64'),
  }
  console.log(`FEISHU_SCHEMA_ENCRYPTED:${Buffer.from(JSON.stringify(envelope)).toString('base64')}`)
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
