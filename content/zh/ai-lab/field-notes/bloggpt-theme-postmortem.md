---
title: "BlogGPT 主题：把技术博客做成工作台，而不是一张文章列表"
date: 2026-10-22
summary: "复盘 BlogGPT 主题的工作区布局、文章与资源路由、主题选择器和 AI 组件实验室接入。"
lab_category: field-notes
cover: media/ai-lab/open-doodles-covers/agent-tool-boundary.png
cover_alt: "以工具边界、输入和输出卡片表现 AI 技术工作台。"
cover_credit: "Pablo Stanley / Open Doodles (CC0 1.0)"
translationKey: theme-bloggpt-postmortem
source_page: "theme-center/"
authors: [me]
---

> **交付里程碑：2026-10-22。** `c1c2127` 记录 BlogGPT 主题与选择器部署；随后 10 月 23 日加入交互式 AI 组件实验室。日期按主题首轮部署记录计算，实验室属于后续能力。

## 碰壁：博客、资源和聊天各自有入口，却没有一个工作区

技术文章、资源、分类、归档、关于、状态和聊天如果各自使用不同 shell，用户会在页面之间丢失上下文。主题选择器若直接改变根站点，也会让 BlogGPT 的工作台和其他主题互相覆盖。另一个风险是“AI”按钮只有展示，没有清楚的输入、输出、错误和离线边界。

## 工作台化修复

把 BlogGPT 作为独立的 site theme 注册，统一 home、list、single、resource、chat、friends、tech-stack、categories、archives、about、search、status 和 404 路由。侧栏、搜索、文章内容、资源卡和状态面板共享同一站点数据；主题预览使用独立路径。AI 组件实验室单独定义输入、渲染和错误状态，不能把演示响应冒充模型实测。

文章页的 Markdown、代码块、标签和归档需要同一内容模型；导航激活态、返回路径和语言 URL 要在所有模板中一致。布局的关键指标是“从搜索到文章、从文章到相关资源、从资源回到主题中心”的路径是否连续，而不是首页卡片数量。

## 前后差异与学习方法

10 月 22 日主题部署记录了可浏览工作区和选择器；10 月 23 日的 AI 组件实验室是后续交互扩展。优化后，BlogGPT 在注册表中作为 production 主题保留完整能力列表，但生产 AI 服务、真实调用指标和数据权限仍需单独验证。不要把“有聊天页面”写成“有可靠 AI 后端”。

费曼练习是让实习生不用看视觉代码，描述一个请求从搜索词到文章、再到相关资源和返回主题中心的完整路径；再补出超时、空搜索和页面不存在时的回退。工作台主题的质量来自路径连续性、内容准确性和错误可解释性。
