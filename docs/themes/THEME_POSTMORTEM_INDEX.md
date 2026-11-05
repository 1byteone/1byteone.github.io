# 主题开发工程复盘交付索引

工作树：`D:\worktrees\dev_theme_ai_lab`  
分支：`dev_theme_ai_lab`  
审计日期：2026-11-05

这组文章位于 AI Lab 的 `field-notes` 栏目，按主题或主题家族各写一篇中英文对应的工程复盘。文章记录的是会话中有文件、提交、交付说明或审计结果支撑的开发节点；没有把规划项写成已完成项目，也没有把本地构建写成线上部署。

| 主题 / 家族 | 文章日期 | 可核实证据 | 当前状态 |
| --- | --- | --- | --- |
| Minimal 家族 | 2026-10-23 | `7e13a91`、`a042df6`、`acf47f9`、`9f74cb8` | 生产父主题 + 预览变体；`ai-minimal-tech` 仍 planned |
| Engineer Terminal 家族 | 2026-10-27 | `b54b953`；终端模板、CLI/GUI 与命令脚本 | preview |
| Astro TUI Portfolio | 2026-10-27 | `b54b953`；注册表含上游仓库与预览路径 | preview |
| Termfolio | 2026-10-27 | `651fae9`、`ea2e893`、`2629721`、`7d17b33`、`5e0df7e` | Next.js 独立预览；服务端 Agnes 需服务端部署 |
| Oil | 2026-10-10 | `2b7e6af`；开发分支发布记录 | preview |
| Alxian / Jinsong | 2026-10-11 | `85a62bb` 至 `5f395c3` 的页面、交互与数据回退提交 | production（仍需第三方与无障碍复核） |
| BlogGPT | 2026-10-22 | `c1c2127`；主题部署与选择器 | production（AI 服务能力需单独验证） |
| LZW Personal Archive | 2026-11-01 | `6dd406e`、`639b405`；交付说明与预览隔离 | preview |
| Cyberpunk 2077 | 2026-11-02 | `docs/audit/UIUX-MOTION-AUDIT.md` 与 `audit-final.json` | CONDITIONAL PASS；未完成全量无障碍/真机/部署验收 |
| Emil Pixel Terminal | 2026-11-03 | `docs/themes/EMIL_PIXEL_TERMINAL.md` 的阶段性验收记录 | 交互式视觉原型；逐资产复刻未完成 |
| AI Lab | 2026-11-05 | `docs/themes/AI_LAB_COMPLETION_AUDIT.md` | preview；部署、评测、授权和自动化回归仍开放 |

## 有意未写成“已完成”的方向

`ai-editorial`、`ai-product-studio` 和 `ai-pixel-world` 在主题注册表中仍为 `planned`；`ai-minimal-tech` 是规划中的 AI 工程子方向。它们没有独立的可验证交付节点，因此没有伪造工程复盘文章。`ai-engineering` 是父主题底座，也不是一个已经发布的单独视觉站点。

## 统一复盘结构

每篇文章使用相同的交付结构：背景与验收目标、碰壁症状、根因、架构/内容修复、优化前后、测试证据、未测量项、实习生费曼练习和发布门槛。文章明确区分视觉结构相似、交互可用、内容真实、资产许可和线上部署这五种完成状态。

## 验证

使用 Hugo Extended `0.162.0` 执行 `--renderToMemory`，中文 312 页、英文 310 页成功渲染；新建文章均有中英文配对、相同 `translationKey` 和本地封面路径。该构建只证明本地内容可生成，不证明 GitHub Pages 已部署。
