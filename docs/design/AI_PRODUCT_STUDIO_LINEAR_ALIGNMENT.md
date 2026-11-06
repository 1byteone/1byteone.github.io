# AI Product Studio / Linear 对齐验收记录

本记录使用公开页面可观察的结构与交互作为参考，不复制 Linear 私有源码、商标、字体、专属图片或文案。验收对象是原创实现的 render contract：布局关系、状态机、动效触发和响应式约束。

## 参考提取

公开首页可观察到的产品表达包括：轻量粘性导航、产品状态工作面、问题列表、活动流、分段产品能力展示、紧凑型 CTA 和高密度页脚。当前主题将这些关系映射为 `PRODUCT SURFACE`、工作台、研究档案和工程实践模块。

本轮参考页在浏览器会话中出现 `ERR_TIMED_OUT`，因此没有把未实测的参考几何值伪装成精确数据。参考站几何测量待网络可用后补录；本地测量和交互证据已记录如下。

## 本地几何测量

测量页面：`http://127.0.0.1:1328/`，Hugo environment：`ai-product-studio`，Hugo Extended `0.161.1`。

| 视口 | Header | Hero | H1 | Product surface | Footer | 页面高度 | 横向溢出 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| 1440 × 900 | 82.7px | y=82.7 / h=736px | 103.68px / line-height 94.35px | y=1165.6 / h=432px | y=5295.2 | 5487px | 无 |
| 768 × 1024 | 72.7px | y=72.7 / h=586.1px | 56.83px / line-height 51.72px | y=1019.4 / h=532.4px | y=5174.3 | 5366px | 无 |
| 664 × 524 | 66.7px | y=66.7 / h=886.4px | 70px / line-height 63.7px | y=1343.7 / h=812.9px | y=6530.9 | 6770px | 无 |
| 390 × 844 | 66.7px | y=66.7 / h=718.2px | 50.7px / line-height 46.14px | y=1192.5 / h=812.9px | y=6166.6 | 6405px | 无 |

窄屏 CSS 约束：

- `680px` 以下，页面容器收敛到 `calc(100% - 40px)`。
- 产品工作面的状态列只在内部横向滚动，页面本身保持 `overflow-x: clip`。
- `390px` 下产品卡片改为单列，按钮和关键内容保持可见。
- `prefers-reduced-motion: reduce` 下 reveal、parallax、hover transition 均降级为静态内容。

## 状态矩阵

| 组件 | 默认 | Hover | Focus | Pressed / Selected | Reduced motion |
| --- | --- | --- | --- | --- | --- |
| Header nav | muted | ink + underline | visible outline | `aria-current=page` | 无动画 |
| Workspace view | Inbox selected | raised surface | keyboard outline | `aria-selected=true` + context label | 无动画 |
| Issue card | collapsed | lift + border | outline | `aria-expanded=true` + inspected state | 静态展开 |
| Board filter | All selected | ink surface | visible outline | `aria-pressed=true` + hidden cards | 静态筛选 |
| Workbench tab | first selected | raised surface | roving tabindex | panel visibility sync | 静态切换 |
| Search dialog | closed | trigger feedback | focus restore | modal + result selection | 无过渡 |

## 已执行验证

- `node --check static/js/ai-product-studio.js`：通过。
- `git diff --check`：通过。
- Hugo production preview（中英文 508 页）构建：通过。
- Inbox / My work / Reviews：点击切换并更新上下文标题。
- Issue card：Enter 与 Space 可展开 inspected 状态并更新 live region。
- All / Active：筛选按钮更新 `aria-pressed`，队列和完成卡片正确隐藏。
- `body.scrollWidth === viewport`：1280px 本地浏览器验证通过。
- 浏览器控制台错误：0。

## 未完成项

- 参考页因当前网络超时，1440×900、768×1024、664×524、390×844 的双页截图叠加和像素差异热力图尚未生成。
- 线上页面需在 Pages 发布后重新抓取 `linear-surface-3` 资源版本，确认 CDN 缓存已刷新。
