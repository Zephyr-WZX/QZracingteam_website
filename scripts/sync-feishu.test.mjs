import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { buildContent, FeishuClient, imageExtension, readConfig, syncFeishu, validateFields } from './sync-feishu.mjs'

const photoFieldTypes = { 名称: 1, 照片: 17, 排序: 2, 是否展示: 7 }
const memberFieldTypes = { 姓名: 1, 组别标识: 1, 组别名称: 1, 组别排序: 2, 是否组长: 7, 职务: 1, 头像: 17, 简介: 1, 个人链接: 15, 排序: 2, 是否展示: 7 }
const fields = (types) => Object.entries(types).map(([field_name, type], i) => ({ field_name, type, field_id: `fld${i}` }))
const photoFields = validateFields(fields(photoFieldTypes), photoFieldTypes)
const memberFields = validateFields(fields(memberFieldTypes), memberFieldTypes)
const row = (record_id, fields) => ({ record_id, fields })
const photo = (record_id, more = {}) => row(record_id, { 名称: '测试照片', 照片: [{ file_token: 'private-photo-token' }], 是否展示: true, ...more })
const member = (record_id, more = {}) => row(record_id, { 姓名: '测试成员', 组别标识: 'chassis', 组别名称: '底盘组', 组别排序: 2, 是否展示: true, ...more })
const options = (more = {}) => ({ photoRecords: [], memberRecords: [], photoFields, memberFields, saveImage: async () => 'content/feishu/images/photo.png', ...more })
const fakeConfig = { FEISHU_APP_ID: 'app', FEISHU_APP_SECRET: 'secret', FEISHU_BASE_TOKEN: 'base', FEISHU_PHOTOS_TABLE_ID: 'photos', FEISHU_MEMBERS_TABLE_ID: 'members' }
const jsonResponse = (value, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'content-type': 'application/json' } })
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZlE8AAAAASUVORK5CYII=', 'base64')

test('only explicitly published records are downloaded; output excludes raw tokens and extra fields', async () => {
  const calls = []
  const content = await buildContent(options({
    photoRecords: [photo('rec-private', { 是否展示: false }), photo('rec-no-checkbox', { 是否展示: undefined }), photo('rec-visible', { 内部备注: 'never publish' })],
    memberRecords: [member('rec-hidden-member', { 是否展示: false, 姓名: 'never publish' }), member('rec-visible-member')],
    saveImage: async (...args) => { calls.push(args); return 'content/feishu/images/photo.png' },
  }))
  assert.equal(calls.length, 1)
  assert.equal(calls[0][2], 'rec-visible')
  assert.equal(content.photos.length, 1)
  assert.equal(content.groups[0].members.length, 1)
  assert.doesNotMatch(JSON.stringify(content), /private-photo-token|rec-visible|never publish|内部备注/)
})

test('sorting, group leaders, rich text, optional avatars and links map to existing UI data', async () => {
  const content = await buildContent(options({
    memberRecords: [
      member('b', { 姓名: [{ text: '成员' }], 排序: 2, 个人链接: { link: 'https://example.com/profile' } }),
      member('a', { 姓名: '组长', 排序: 1, 是否组长: true }),
      member('c', { 姓名: '老师', 组别标识: 'advisors', 组别名称: '指导老师', 组别排序: 1 }),
    ],
    photoRecords: [photo('second', { 排序: 2 }), photo('first', { 排序: 1, 布局高度: 600, 说明: '车队合影' })],
  }))
  assert.deepEqual(content.groups.map((g) => g.key), ['advisors', 'chassis'])
  assert.equal(content.groups[1].leader.name, '组长')
  assert.equal(content.groups[1].members[0].name, '成员')
  assert.equal(content.groups[1].members[0].link, 'https://example.com/profile')
  assert.equal(content.groups[1].members[0].avatar, undefined)
  assert.equal(content.photos[0].height, 600)
  assert.equal(content.photos[0].caption, '车队合影')
})

test('empty published lists intentionally clear sections', async () => {
  const content = await buildContent(options())
  assert.deepEqual(content.photos, [])
  assert.deepEqual(content.groups, [])
})

test('bad fields, unsafe links, ambiguous leaders and invalid images stop publication', async () => {
  assert.throws(() => validateFields([{ field_name: '是否展示', type: 1 }], { 是否展示: 7 }), /类型错误/)
  for (const memberRecords of [
    [member('a', { 个人链接: { link: 'javascript:alert(1)' } })],
    [member('a', { 是否组长: true }), member('b', { 是否组长: true })],
    [member('a'), member('b', { 组别名称: '不一致' })],
    [member('a', { 组别标识: '../oops' })],
    [member('a', { 姓名: '' })],
  ]) await assert.rejects(buildContent(options({ memberRecords })))
  await assert.rejects(buildContent(options({ photoRecords: [photo('a', { 照片: [] })] })), /上传/)
  await assert.rejects(buildContent(options({ photoRecords: [photo('a', { 布局高度: 10000 })] })), /布局高度/)
  assert.throws(() => imageExtension(Buffer.from('<html>expired download</html>')), /格式/)
  assert.throws(() => imageExtension(Buffer.from('<svg></svg>')), /格式/)
  assert.equal(imageExtension(png), 'png')
})

test('configuration errors name missing keys without revealing credentials', () => {
  assert.throws(() => readConfig({ FEISHU_APP_SECRET: 'sensitive-value' }), (error) => /FEISHU_APP_ID/.test(error.message) && !error.message.includes('sensitive-value'))
})

const simplifiedMemberFields = new Map([
  ['姓名', { type: 1 }],
  ['组别标识', { type: 4, property: { options: [{ name: '管理层' }, { name: '底盘组' }, { name: '无人组' }] } }],
  ['职务', { type: 3 }],
  ['头像', { type: 17, field_id: 'avatar' }],
  ['是否展示', { type: 7 }],
])

test('current simplified tables accept multi-select groups and optional removed columns', () => {
  const current = [...simplifiedMemberFields].map(([field_name, value]) => ({ field_name, ...value }))
  assert.doesNotThrow(() => validateFields(current, { 姓名: 1, 组别标识: [1, 3, 4], 职务: [1, 3], 是否展示: 7 }, { 排序: 2, 组别名称: 1 }))
  assert.throws(() => validateFields([...current, { field_name: '排序', type: 1 }], {}, { 排序: 2 }), /可选字段/)
})

test('one member appears in multiple selected groups; advisor and captain use existing layouts', async () => {
  let downloads = 0
  const content = await buildContent(options({
    memberFields: simplifiedMemberFields,
    memberRecords: [
      row('captain', { 姓名: '队长', 职务: '队长', 组别标识: ['底盘组', '管理层'], 头像: [{ file_token: 'avatar' }], 是否展示: true }),
      row('advisor', { 姓名: '指导老师', 职务: '指导老师', 是否展示: true }),
      row('leader', { 姓名: '底盘组长', 职务: '组长', 组别标识: ['底盘组'], 是否展示: true }),
      row('member', { 姓名: '跨组成员', 组别标识: ['无人组', '底盘组'], 是否展示: true }),
    ],
    saveImage: async () => { downloads++; return 'content/feishu/images/avatar.png' },
  }))
  assert.deepEqual(content.groups.map((g) => g.key), ['advisors', 'management', 'chassis', 'autonomous'])
  assert.equal(content.groups[0].members[0].name, '指导老师')
  assert.equal(content.groups[1].leader.name, '队长')
  assert.equal(content.groups[2].leader.name, '底盘组长')
  assert.deepEqual(content.groups[2].members.map((m) => m.name), ['队长', '跨组成员'])
  assert.equal(content.groups[3].members[0].name, '跨组成员')
  assert.equal(downloads, 1)
})

test('group leaders must select exactly one group; ordinary members require a group', async () => {
  for (const f of [
    { 职务: '组长', 组别标识: ['底盘组', '无人组'] },
    { 职务: '', 组别标识: [] },
  ]) await assert.rejects(buildContent(options({ memberFields: simplifiedMemberFields, memberRecords: [row('a', { 姓名: '测试', 是否展示: true, ...f })] })))
})

test('without a sort column, API record order is preserved instead of sorting by record ID', async () => {
  const content = await buildContent(options({ photoRecords: [photo('z', { 名称: '先返回' }), photo('a', { 名称: '后返回' })] }))
  assert.deepEqual(content.photos.map((p) => p.caption), ['先返回', '后返回'])
})

test('API client paginates and supplies application auth; rejects business errors without leaking responses', async () => {
  const requests = []
  const responses = [
    { code: 0, tenant_access_token: 'test-token' },
    { code: 0, data: { items: [row('a', {})], has_more: true, page_token: 'next' } },
    { code: 0, data: { items: [row('b', {})], has_more: false } },
    { code: 99991672, msg: 'sensitive-server-details' },
  ]
  const client = new FeishuClient({ pause: async () => {}, fetchImpl: async (url, init) => {
    requests.push({ url: String(url), init })
    return jsonResponse(responses.shift())
  } })
  await client.authenticate(fakeConfig)
  assert.deepEqual((await client.list('base', 'table', 'records')).map((r) => r.record_id), ['a', 'b'])
  assert.equal(requests[1].init.headers.Authorization, 'Bearer test-token')
  assert.match(requests[2].url, /page_token=next/)
  await assert.rejects(client.json('example'), (error) => /99991672/.test(error.message) && !/sensitive/.test(error.message))
})

test('rate limits retry, pagination loops fail, and advanced attachment permissions are sent', async () => {
  let calls = 0
  const client = new FeishuClient({ pause: async () => {}, fetchImpl: async () => ++calls < 3 ? new Response('', { status: 429 }) : jsonResponse({ code: 0 }) })
  assert.equal((await client.json('example')).code, 0)
  assert.equal(calls, 3)
  const loop = new FeishuClient({ pause: async () => {}, fetchImpl: async () => jsonResponse({ code: 0, data: { items: [], has_more: true, page_token: 'same' } }) })
  await assert.rejects(loop.list('base', 'table', 'records'), /分页/)
  const download = new FeishuClient({ pause: async () => {}, fetchImpl: async (url, init) => {
    assert.equal(init.redirect, 'error')
    assert.deepEqual(JSON.parse(url.searchParams.get('extra')), { bitablePerm: { tableId: 'table', attachments: { field: { record: ['file'] } } } })
    return new Response(png)
  } })
  assert.equal((await download.download('table', 'field', 'record', 'file')).extension, 'png')
})

test('failed downloads preserve last snapshot; successful replacement removes stale images', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'qz-feishu-test-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const destination = join(root, 'public/content/feishu')
  await mkdir(destination, { recursive: true })
  await writeFile(join(destination, 'snapshot.json'), 'previous good snapshot')
  await writeFile(join(destination, 'old.png'), png)
  const client = {
    authenticate: async () => {},
    list: async (_base, table, resource) => resource === 'fields' ? fields(table === 'photos' ? photoFieldTypes : memberFieldTypes) : table === 'photos' ? [photo('a')] : [member('b')],
    download: async () => { throw new Error('download failed') },
  }
  await assert.rejects(syncFeishu({ root, config: fakeConfig, client }), /download failed/)
  assert.equal(await readFile(join(destination, 'snapshot.json'), 'utf8'), 'previous good snapshot')
  assert.deepEqual(await readdir(join(root, 'public/content')), ['feishu'])
  client.download = async () => ({ bytes: png, extension: 'png' })
  const content = await syncFeishu({ root, config: fakeConfig, client })
  assert.equal(content.photos.length, 1)
  assert.deepEqual(await readdir(destination), ['images', 'snapshot.json'])
  assert.deepEqual(JSON.parse(await readFile(join(destination, 'snapshot.json'), 'utf8')), content)
  assert.ok(await readFile(join(root, 'public', content.photos[0].img)))
})
