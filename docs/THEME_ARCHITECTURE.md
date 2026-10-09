# 多主题博客架构

本项目把“内容”和“呈现”分开：同一套 Hugo 内容、数据和媒体，可以切换不同的首页主题。

## 分层

```text
content/{zh,en}/       文章、项目、技术路线，内容的唯一来源
data/                   跨页面共享的静态数据与身份信息
config/_default/params.yaml
                        当前主题选择与站点级参数
layouts/home.html      主题路由器
layouts/partials/themes/
  oil/home.html         Oil 交互主题
  minimal/home.html     Minimal 阅读主题
static/css/             主题样式
static/js/              交互脚本
```

## 切换主题

修改 `config/_default/params.yaml`：

```yaml
site_theme: oil
```

可选值为 `oil` 和 `minimal`。`layouts/home.html` 会根据这个值加载对应主题；未知值自动回退到 Oil，避免部署时出现空白首页。

## 数据边界

- `content/` 保存可发布内容：文章、项目、技术栈页面。主题只负责读取，不复制内容。
- `data/site.yaml` 保存跨主题共享的身份、联系方式、导航和短文案。
- 主题专属的视觉参数应留在主题 CSS 或主题局部模板中，不写入内容 Markdown。
- 语言内容继续放在 `content/zh` 和 `content/en`，主题通过 `.Site.Language.Lang` 选择语言文案。

## 新增主题

1. 在 `layouts/partials/themes/<name>/home.html` 创建首页模板。
2. 在 `static/css/` 增加 `<name>-theme.css`，必要时在 `static/js/` 增加脚本。
3. 在 `config/_default/params.yaml` 的注释和 `data/site.yaml` 的 `available_themes` 中登记主题。
4. 将 `site_theme` 改为新主题并执行 Hugo 构建，检查 `/`、`/en/`、文章链接和移动端布局。

## 验证

主题切换不应改变 `content/` 文件。构建后重点检查：

- `/` 与 `/en/` 的语言和切换链接
- 项目、文章数量和详情链接
- 共享邮箱、GitHub、姓名和页脚文案
- 无效主题值是否回退到 Oil
