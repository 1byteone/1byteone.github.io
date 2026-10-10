# 多主题个人主页架构

本文定义个人主页在同一个域名下承载多种视觉主题时的内容模型、资源边界、构建策略和切换方式。目标是让 `oil` 继续作为当前线上主页，同时可以安全增加 `minimal`、`editorial` 等主题，而不复制博客、项目、简历和图片数据。

## 1. 设计目标与约束

### 目标

- 内容只维护一份，中文和英文由同一内容模型表达。
- 主题可以独立演进，包括模板、样式、脚本、设计令牌和主题专属图片。
- 主题切换有明确的 URL、缓存和 SEO 语义，不影响文章与项目链接。
- 本地预览、Pull Request 检查和 GitHub Pages 发布使用同一套构建入口。
- 新主题接入有可验证的契约，不因为缺少一个局部模板导致线上空白页。

### 约束

- GitHub Pages 是静态托管，不提供按 Cookie、请求头或服务端会话选择 Hugo 模板的能力。
- `content/` 是可索引内容的唯一事实来源，主题不能复制或修改文章正文。
- 主题 ID 必须来自仓库中的白名单，不能直接把 URL 参数拼接成文件路径或脚本地址。
- 每个主题必须支持中文根路径 `/` 和英文根路径 `/en/`，并保留博客、项目、技术栈和简历等公共入口。

## 2. 分层架构

```text
内容层（唯一事实来源）
  content/zh|en/{blog,projects,tech-stack}/
  static/uploads/                     简历等公共下载文件

数据层（跨主题共享）
  data/site.yaml                      身份、导航、联系方式、双语短文案
  data/authors/                       作者资料
  data/tech_learning.yaml             技术路线数据

主题层（可替换实现）
  layouts/home.html                   主题路由器与安全回退
  layouts/partials/themes/<id>/       首页模板和主题局部
  static/themes/<id>/                 CSS、JS、字体、主题专属图片
  data/theme_registry.yaml            主题注册表、能力声明和预览路径

交付层（构建与发布）
  config/_default/                    公共 Hugo 配置
  config/<id>/                        主题构建覆盖配置（可选）
  .github/workflows/                  单主题生产构建和多主题验证
```

当前仓库采用 `site_theme` 分发首页、section 列表、详情页、技术栈、资源、聊天室、友链和 404。公共内容位于 `content/`，共享资料位于 `data/site.yaml`；Alxian 的页面壳层和资源位于 `layouts/partials/themes/alxian/`、`static/css/alxian-*` 与 `static/js/alxian-*`。Oil 根站继续使用自己的模板和资源。

现有的 `static/css/oil-theme.css`、`static/css/minimal-theme.css` 和 `static/js/oil-theme.js` 可以作为迁移到 `static/themes/<id>/` 的起点；迁移期间保留兼容路径，避免已发布页面的资源 URL 失效。当前生效选择器只有 `config/_default/params.yaml` 的 `site_theme`，主题白名单和预览路径统一登记在 `data/theme_registry.yaml`，避免再维护第二个选择器。

## 3. 公共内容、数据与资源边界

### 公共内容

`content/zh` 和 `content/en` 保存可发布页面。文章、项目和技术路线的 front matter 应描述事实属性，例如 `title`、`summary`、`date`、`tags`、`featured` 和 `image`。主题只读取这些属性，不在模板中写第二份文章列表。

推荐的内容结构：

```text
content/
  zh/
    _index.md
    blog/<slug>/index.md
    projects/<slug>/index.md
    tech-stack/<slug>/index.md
  en/
    _index.md
    blog/<slug>/index.md
    projects/<slug>/index.md
    tech-stack/<slug>/index.md
```

### 共享数据

`data/site.yaml` 适合放主题之间都需要的稳定信息：姓名、英文名、邮箱、GitHub、所在地、导航键、双语短文案和站点级开关。导航项使用稳定的 `key`，主题自行决定它的视觉呈现：

```yaml
site:
  identity:
    name: 杨劲松
    name_en: Jinsong Yang
    email: yjs_0831@qq.com
    github: https://github.com/1byteone
  navigation:
    - key: projects
      zh: 项目
      en: Projects
      anchor: work
```

主题差异化数据放在 `data/theme_registry.yaml` 的主题条目中；规模扩大后可以拆成 `data/theme_profiles/<id>.yaml`，例如主题显示名称、默认动画开关和设计令牌。不要把颜色、字号和间距写进文章 front matter，也不要把同一联系方式复制到每个主题模板。

### 资源分类

| 资源 | 归属 | 示例 | 规则 |
| --- | --- | --- | --- |
| 内容媒体 | 公共 | `static/assets/articles/covers/`、页面 bundle resources | 文章和项目引用的图片只保留一份 |
| 身份媒体 | 公共 | `static/assets/hero/person.png`、`static/uploads/resume.pdf` | 主题通过数据或稳定路径引用 |
| 主题 UI | 主题独立 | `static/themes/oil/css/theme.css` | 只服务该主题的 CSS、JS、字体和装饰图 |
| 构建产物 | 不入库 | `public/`、Pagefind index | CI 每次重新生成并上传 |

主题专属图片如果将来被文章正文引用，应迁移到公共内容媒体目录；反过来，主题装饰资源不应进入 `content/`，防止更换主题时污染内容模型。

## 4. 主题契约

主题 ID 是小写、稳定、只含字母数字和连字符的标识，例如 `oil`、`minimal`、`alxian`。每个主题必须提供：

```text
layouts/partials/themes/<id>/home.html
static/themes/<id>/css/theme.css
static/themes/<id>/js/theme.js       # 无交互时可以省略
data/theme_registry.yaml             # 主题注册表
```

模板最低契约如下：

- 输出有效 HTML，并设置正确的 `lang`、标题、description 和 canonical。
- 从 `.Site.Data.site.site` 读取身份和导航，从当前语言读取双语文案。
- 提供指向 `/blog/`、`/projects/`、`/tech-stack/`、简历和联系方式的入口。
- 在缺少可选内容或图片时显示可访问的降级文本，不因 `GetPage` 为空而中止渲染。
- 主题脚本使用 `defer`，只绑定当前主题存在的元素，并在 `prefers-reduced-motion` 下关闭非必要动画。
- 所有交互控件具备键盘焦点、可见状态和 `aria-*` 语义；主题切换入口不能只依赖颜色或悬停。

`layouts/home.html` 只负责白名单解析和分发。未知主题必须回退到 `oil`，并在开发构建中输出诊断信息：

```go-html-template
{{- $theme := lower (default "oil" .Site.Params.site_theme) -}}
{{- $allowed := slice "oil" "minimal" "alxian" -}}
{{- if not (in $allowed $theme) -}}{{- $theme = "oil" -}}{{- end -}}
{{- partial (printf "themes/%s/home.html" $theme) . -}}
```

实际实现可以继续使用显式 `if` 分支；关键要求是主题值不能直接来自未经校验的路径拼接。

### 首页主题与整站主题

主题包应声明自己的覆盖范围：

```yaml
# data/theme_registry.yaml
id: oil
scope: site                     # site | home-only
routes:
  - home
  - section
  - single
  - tech-stack
```

`home-only` 主题只承诺首页和首页内的锚点交互；公共详情页继续使用稳定的共享壳层。`site` 主题则需要为首页、section list、single、tech-stack、语言切换、页脚和错误页提供一致的壳层。这样可以把“增加一种首页风格”和“替换整个网站信息架构”分成两个风险级别，而不是由模板目录名称推断能力。

推荐的整站主题目录演进方式：

```text
layouts/partials/themes/<id>/
  shell/head.html
  shell/header.html
  shell/footer.html
  home.html
  list.html
  single.html
  tech-stack.html
```

主题路由器仍由共享入口负责，主题只实现契约规定的局部。不存在主题专属模板时，路由器可以回退到公共壳层；禁止让一个主题的首页 CSS 隐式控制另一个主题的详情页。

## 5. 主题选择与同域名切换

### 5.1 生产默认：构建时选择

生产根路径只发布一个主题，配置示例：

```yaml
# config/_default/params.yaml
site_theme: oil
```

发布前由 CI 校验该值存在于 `data/theme_registry.yaml` 注册表中，然后执行一次 Hugo 构建。切换生产主题就是修改一个配置值、提交并发布；文章 URL、RSS、Pagefind 索引和 sitemap 均保持稳定。该方式最适合 SEO、缓存和无 JavaScript 访问。

为避免手工改文件，可以为每个主题提供环境覆盖：

```text
config/
  _default/params.yaml
  minimal/params.yaml
```

当前工作流使用 `hugo --configDir config --environment minimal` 和 `hugo --configDir config --environment alxian` 生成预览。构建日志必须打印最终主题 ID，产物检查也要确认首页包含对应主题资源。

### 5.2 推荐的同域名快捷切换：主题子路径

静态站点不能在同一个请求路径上重新运行 Hugo 模板。要让访问者在当前域名快速试用多种结构化主题，推荐同时生成：

```text
/                       生产默认主题，例如 oil
/themes/oil/            oil 预览入口
/themes/minimal/       minimal 预览入口
```

每个主题预览都包含同一套语言和内容路由，例如 `/themes/minimal/en/blog/`。根页面的主题选择器只跳转到白名单路径，并把选择写入 `localStorage`；下次访问 `/` 时由一个很小的 bootstrap 脚本询问本地偏好后导航。生产根路径仍保留 canonical，主题预览页应设置 `noindex` 或 canonical 指向根路径，避免重复内容竞争搜索结果。

这种方案的优点是每个主题仍然是独立、可缓存、可无脚本访问的静态 HTML；缺点是主题预览 URL 带有前缀，主题模板必须通过 `relURL`、`relLangURL` 生成链接，不能硬编码 `/blog/`。

### 5.3 CSS 级切换：仅适用于同一 DOM

如果多个主题只改变颜色、字体、间距和动效，可以在一份 HTML 上使用 `data-theme="oil"` 和 CSS 变量切换。脚本保存 `localStorage.theme`，并在首屏渲染前设置根节点属性以减少闪烁。这种方式不能解决首页结构、交互模型或语义不同的主题；不要用它强行替代独立模板。

### 5.4 不推荐方案

不建议通过 `?theme=minimal` 让浏览器动态 `fetch` 另一套 HTML 并替换 `document.body`。它会带来 SEO、返回键、焦点、脚本重复执行、错误处理和缓存问题，也容易让静态托管下的资源路径失效。如果产品确实要求同一 URL、无跳转且结构差异很大，应升级为客户端应用壳层，并把主题渲染为受控模块；这已经超出 Hugo 静态主页的简单主题切换范围。

## 6. 构建与 CI 标准

CI 分为“验证所有主题”和“发布一个默认主题”两类任务：

```yaml
jobs:
  validate-themes:
    strategy:
      matrix:
        theme: [oil, minimal]
    # 用矩阵主题构建到独立目录，执行链接、资源和 HTML 检查

  deploy:
    needs: validate-themes
    # 只把 production_theme 对应的 public/ 上传到 GitHub Pages
```

每个主题构建应至少执行以下检查：

1. Hugo 构建成功，中文 `/` 和英文 `/en/` 均生成首页。
2. 首页包含主题 CSS，主题脚本和图片请求无 404。
3. 博客、项目、技术栈详情页的数量和 slug 与公共内容一致。
4. 站内链接、语言切换、canonical、sitemap 和 RSS 可解析。
5. 使用 Playwright 或等价浏览器检查桌面和移动视口；对动画执行 reduced-motion 检查。
6. Pagefind 在最终上传目录生成索引，且不把主题预览路径重复索引为生产内容。

产物目录应隔离，例如 `public-builds/oil`、`public-builds/minimal`，避免矩阵任务互相覆盖。上传 Pages 前再复制默认主题到 `public/`，并记录 `THEME_ID`、Git SHA 和 Hugo 版本，便于回滚。

## 7. 版本、缓存与 SEO

- 主题资源使用带内容哈希的 Hugo Pipes 或版本查询参数；升级 CSS/JS 时必须让浏览器获取新文件。
- 公共文章 URL 不随主题变化，主题前缀只用于预览入口。
- 页面 `<html lang>`、canonical、Open Graph 和 RSS 使用当前语言与当前生产 URL。
- 主题预览路径默认 `noindex`，不能把同一篇文章生成多个可索引副本。
- 主题切换偏好只保存在浏览器，不写入内容或服务器；清除站点数据应恢复生产默认主题。
- 选择器必须提供“恢复默认主题”操作，并在无 JavaScript 时仍能访问生产页面。

## 8. 新主题接入清单

1. 建立 `layouts/partials/themes/<id>/home.html` 和独立资源目录。Alxian 已声明为 `site`，提供首页、列表、详情、资源、聊天室、友链和 404 壳层；Minimal 仍保持 `home-only`。
2. 补齐主题契约中的元数据、导航、语言、内容入口和无障碍要求。
3. 在 `data/theme_registry.yaml` 与 CI 预览构建登记 ID。
4. 添加主题预览配置和截图基线，确认桌面、移动、暗色/浅色（如支持）布局。
5. 构建中英文首页及全部公共详情页，执行 404、链接和 Pagefind 检查。
6. 先以预览路径发布，确认资源缓存与 SEO；再将 `site_theme` 切换为新主题。
7. 保留上一个生产主题的可回滚提交和构建产物至少一个发布周期。

## 9. 分阶段迁移路径

### 阶段 A：稳定现状

保留当前 `layouts/home.html` 路由器和 `site_theme` 配置；把主题允许列表、构建回退和首页资源检查加入 CI。此阶段不改内容目录和公共 URL。

### 阶段 B：资源归档

将 `static/css/oil-theme.css`、`static/css/minimal-theme.css` 和对应脚本迁移至 `static/themes/<id>/`，通过兼容重定向或短期别名保持旧资源可用。把主题令牌和可选文案拆到 `data/themes/<id>.yaml`。

### 阶段 C：多主题预览

CI 矩阵同时生成 `/themes/<id>/` 产物，根页面增加白名单选择器和本地偏好。补充 canonical/noindex 和端到端导航测试。

### 阶段 D：生产切换

以一个配置提交切换根路径主题；观察 Pages 构建、404、搜索索引和 Core Web Vitals。出现问题时回滚 `site_theme`，无需回滚内容。

## 10. 架构决策

当前项目采用“公共内容 + 独立主题模板 + 构建时生产选择 + 子路径预览”的组合。它符合 Hugo 和 GitHub Pages 的静态特性，保留 SEO、缓存、可访问性和回滚能力；运行时 CSS 变量只作为同 DOM 主题的增强，不承担结构化模板切换。
