# 飞书维护照片墙和成员

网站地址：https://zephyr-wzx.github.io/QZracingteam_website/

日常维护在飞书多维表格完成。勾选“是否展示”的记录会在下一次成功发布时替换对应的整个板块；取消勾选或删除记录即可下架。两张表都没有勾选记录时，两个板块会清空，不会重新显示本地数据。

## 1. 创建多维表格并导入模板

现有的“照片墙”和“成员信息”已按简化结构接入，无需恢复删除的列。新建时可导入 `docs/templates/photos.csv` 和 `docs/templates/members.csv`；旧模板字段仍兼容，也可按以下简化结构调整。模板示例默认不展示，替换示例内容后再勾选。

CSV 无法保存附件和复选框类型。**导入后必须按下面设置字段类型，字段名保持一致**。附件列留空，转换为“附件”后在飞书上传图片。是否展示、是否组长转换为“复选框”后检查状态，模板中的 FALSE 应保持未勾选。

照片墙字段：

- 名称：文本，展示记录必填。
- 照片：附件，每条展示记录上传一张图片。
- 说明：文本，选填；悬停图片时显示，留空显示名称。
- 排序：可选数字列，数值越小越靠前；删去后保持接口返回的记录顺序。
- 是否展示：复选框，勾选才发布。
- 布局高度：数字，选填；240–800，默认 400。竖图可填 600，横图可填 320。

成员信息字段：

- 姓名：文本，展示记录必填。
- 组别标识：多选，直接使用中文组名；成员可以同时属于多个组。
- 职务：单选，可留空；现有选项为指导老师、队长、经理、组长。
- 头像：附件，选填，每人一张；留空显示姓名首字占位。
- 简介：文本，选填；指导老师卡片展示该字段。
- 个人链接：超链接，选填，仅接受 http 或 https；指导老师卡片展示该字段。
- 排序：可选数字列，组内数值越小越靠前；删去后保持接口返回的记录顺序。
- 是否展示：复选框，勾选才发布。

分组标签使用多选项名称，并按多选项的配置顺序展示。当前分组为管理层、底盘组、电气组、空套组、单体壳组、运营组、无人组；可以自行新增选项。同一个人只需维护一条记录，多选后自动出现在对应的各个组中。

职务为“指导老师”时，自动归入指导老师板块，可以不选择组别；指导老师板块显示在最前。“队长”在所选的管理层中单独展示，在其他所选组中作为普通成员展示。“组长”只能选择一个组别，每个组最多设置一名组长。经理和其他成员可多选组别。

“组别名称”“组别排序”“是否组长”均不再必填，旧表保留时仍兼容；旧表使用英文组别标识、文本职务及组长复选框的逻辑保持兼容。没有排序列时，网页不保证跟随某个飞书视图的手动拖动顺序；需要固定顺序时可恢复可选的数字“排序”列。

图片支持 JPG、PNG、WebP、GIF，单张不超过 25 MiB；建议先压缩至 1–2 MB。手机 HEIC 图片需转换后上传。

## 2. 创建飞书自建应用

进入 [飞书开发者后台](https://open.feishu.cn/app)，创建企业自建应用。

1. 在“凭证与基础信息”取得 App ID、App Secret。
2. 为应用开通读取多维表格、列出字段、下载素材所需的**应用身份**权限。优先选择只读权限，例如 `bitable:app:readonly` 和 `docs:document.media:download`；若后台权限分类有变化，以对应接口页面列出的可用权限为准。
3. 在“版本管理与发布”发布应用版本，按所在组织要求完成权限审批。
4. 回到新建的多维表格，通过“添加文档应用”添加此应用并授予读取权限。开启高级权限时，应用还需有两张表及附件字段的读取权限。

这两个授权都需要完成：应用获准调用接口，以及此多维表格允许该应用读取。无需把飞书表格设为公开。

## 3. 获取表格标识

在浏览器打开每张表。直接多维表格链接通常为：

```text
https://你的组织.feishu.cn/base/BASE_TOKEN?table=TABLE_ID&view=...
```

`/base/` 后的部分是 `FEISHU_BASE_TOKEN`，两张表共用。`table=` 后的部分分别是照片表和成员表 ID。它们与应用的 App ID 是不同标识。若使用知识库 `/wiki/` 链接，需取得对应多维表格的 base 标识；本集成不把 wiki 节点标识当作 base 标识。

## 4. 配置 GitHub Secrets

打开 [仓库 Actions Secrets 设置](https://github.com/Zephyr-WZX/QZracingteam_website/settings/secrets/actions)，新增以下五项 **Repository secrets**：

- `FEISHU_APP_ID`：自建应用 App ID。
- `FEISHU_APP_SECRET`：自建应用 App Secret。
- `FEISHU_BASE_TOKEN`：多维表格 base 标识。
- `FEISHU_PHOTOS_TABLE_ID`：照片墙数据表 ID。
- `FEISHU_MEMBERS_TABLE_ID`：成员信息数据表 ID。

密钥只在 GitHub Secrets 填写，不写入源码、不以 `VITE_` 开头、不发送到聊天。同步脚本只读取指定表格，不向飞书写入内容。

## 5. 启用并首次发布

1. 确认两张表的字段类型已设置，填写要展示的照片和成员并勾选“是否展示”。首次同步会以飞书内容替换整个照片墙和成员板块，建议先补齐需要保留的内容。
2. 打开 [Actions Variables 设置](https://github.com/Zephyr-WZX/QZracingteam_website/settings/variables/actions)，新增 **Repository variable**：`FEISHU_SYNC_ENABLED`，值为 `true`。
3. 打开 [部署工作流](https://github.com/Zephyr-WZX/QZracingteam_website/actions/workflows/deploy.yml)，点击 **Run workflow**，选择 `main`。可以先勾选“仅验证飞书同步和构建，不发布网站”，检查真实同步；该选项即使尚未启用同步开关也会读取飞书，但会跳过上传和发布。
4. 验证通过后，不勾选“仅验证”再运行，等待 `Sync published Feishu content`、构建和 Deploy 均成功后访问网站。首次务必核对照片、分组和组长。

## 日常更新

修改飞书后，可以在上述工作流页面点击 **Run workflow** 发布，通常数分钟完成。默认每小时第 17 分钟自动同步一次，北京时间也为每小时第 17 分钟；GitHub 定时任务可能延迟，网站 CDN 缓存也可能延迟显示更新。

启用同步后，推送代码至 `main` 也会先同步再部署。每次获取最新的两张表和已展示附件，数据及图片随部署包发布，网页访问时不调用飞书 API，也不使用飞书临时图片地址。

字段错误、权限不足、网络中断或图片下载失败会让工作流失败，停止本次部署，线上网站保留上一次成功版本。失败时在工作流页面检查日志并按提示修正，再运行。输出只包含同步后的公开字段，未勾选的记录不会下载图片；同步产物在 `.gitignore` 中，不写入公开 Git 历史。

不要把 `FEISHU_SYNC_ENABLED` 改为 false 当作暂停发布：关闭后下次手动发布或代码推送会重新使用本地旧内容。需要暂停自动更新时，在 Actions 中停用该工作流，线上最后一次成功版本会继续保留。公开仓库的定时任务长期无活动时可能被 GitHub 自动停用，可在 Actions 中重新启用。

## 接口与代码入口

- 同步脚本：`scripts/sync-feishu.mjs`，Node.js 22，无额外服务端依赖。
- 数据入口：`src/data/feishu.ts`，无同步产物时使用原有本地数据。
- 本地验证：`npm run test:feishu`；生产构建：`npm run build`。
- 本地同步：先通过环境变量设置上述五个值，再执行 `npm run sync:feishu`。运行后可用 `npm run build` 查看生成结果。
- [飞书列出记录接口](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-record/list)
- [飞书列出字段接口](https://open.feishu.cn/document/server-docs/docs/bitable-v1/app-table-field/list)
- [飞书下载素材接口](https://open.feishu.cn/document/server-docs/docs/drive-v1/media/download)
