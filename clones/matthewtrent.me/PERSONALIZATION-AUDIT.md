# 镜像站个性化审计

审计对象：`clones/matthewtrent.me`（分支 `dev_matthewtrent_clone`）。

## 当前已完成

- 首页首屏已替换为杨劲松头像、姓名、所在地和 AI 应用工程师定位。
- 首页中文内容、中文导航、项目卡片、文章列表、联系信息和本地图集已接入本地资源。
- Radio 使用本地 `songs/1.mp3`、`songs/2.mp3`、`songs/3.mp3`，点击后直接播放，不创建第三方弹窗。
- 首页项目和文章入口统一指向站内路径。

## 尚未统一的区域

### P0：会直接造成主题错乱

- 首页技术文章的旧实现按列表下标绑定详情 URL；列表重绘或顺序变化时，标题可能进入另一篇文章。应按标题/slug 固定映射。
- `/blog/` 下的中文技术文章详情页已统一迁移到 `ed3-*` 文章壳；后续新增文章必须复用该模板，避免重新引入 `engineer-terminal`。
- `/ai-lab/**` 仍使用 `emil-pixel-terminal`；`/blog/page/*` 与部分列表仍使用 `minimal-tech/paper-site`。这些路由需要统一导航、页脚、语言和个人品牌。

### P1：会被用户直接看见的身份残留

- 文章、系列、归档、分类、联系、聊天、credits、privacy 等页面仍有 `Matthew Trent`、`matthewtrent.me`、`MattGPT` 或原站社交语义。
- 多个页面的 `title`、作者字段、`author_url` 和内嵌元数据仍指向原站；部分详情内容还引用原站或 `raw.githubusercontent.com` 资源。
- `index.original.html`、`index.source.html`、`*.source.html` 等快照文件仍可被直接访问，内容保持源站身份。应标记为内部参考或移出可访问目录。
- 项目卡片、教育卡片、时间线和文章封面需要继续保持“头像只出现在首屏人物区域”的约束，不能复用头像作为文章/作品封面。

### P2：内容与交互细节

- 博客搜索、分页、系列页仍有英文占位或源站文案（例如 `machine learning`、`View all`、`MattGPT` 等）。
- 日期、标签和目录格式尚未全部采用中文友好格式。
- 首页标题 roll、姓名/角色动态字母层曾由多个脚本并行重建，语言切换和 hover 时可能出现旧文案与新文案重叠；应只保留一个可见层。
- `blog/__data.json` 的文章数组为空，博客列表依赖运行时 DOM 改写；需要补齐稳定的数据源或保证静态列表与详情路径一致。
- 部分页脚、外链、社交图标和按钮仍带有源站语义；需要统一到 `1byteone.github.io`、GitHub `1byteone` 和 `yjs_0831@qq.com`。
- 文章封面按分类循环复用，导致多篇文章看起来使用同一封面；应为 RAG、Agent、Java、Spring Boot、FastAPI、数据库分别准备稳定的本地封面集合。

## 规模统计

- 镜像目录约有 682 个 HTML 文件（含快照和语言副本）。
- 博客目录已扫描 70 个详情/列表页，当前中文详情页不再使用 `engineer-terminal`；其他非博客路由仍可能使用 `minimal-tech/paper-site` 或 `emil-pixel-terminal`。
- 镜像全目录仍包含多个历史主题副本，约 14 个页面使用 `minimal-tech/paper-site`，约 26 个页面使用 `emil-pixel-terminal`，需要后续按路由统一。
- 共有约 33 个 `*.source.html` 和若干 `index.original.html` 快照文件。

## 收口顺序

1. 统一首页和博客列表的标题到 slug 映射，修复文章详情壳和相邻文章导航。
2. 收敛首页标题、姓名、角色的动态层，恢复源站 roll 容器但只显示当前语言文案。
3. 将文章详情页、项目页和核心信息页迁移到同一 `ed3-*` 主题壳。
4. 清理原站身份、英文占位、原站外链和快照可访问性。
5. 最后逐路由检查 200 响应、图片本地化、语言切换、hover/roll、Radio 和移动端布局。
