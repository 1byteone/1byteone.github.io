# 项目文档

本目录存放架构设计、主题说明、交付记录和运维资料。Hugo 约定目录仍保留在仓库根目录，避免改变构建入口。

## 文档分区

- [`architecture/THEME_ARCHITECTURE.md`](architecture/THEME_ARCHITECTURE.md)：多主题内容模型、路由和发布策略。
- [`design/ALXIAN_DESIGN.md`](design/ALXIAN_DESIGN.md)：Alxian 主题的视觉参考和设计令牌。
- [`integrations/ALXIAN_API_INTEGRATION.md`](integrations/ALXIAN_API_INTEGRATION.md)：Alxian 交互 API 契约和静态回退机制。
- [`delivery/`](delivery/)：交付结果和验收记录。
- [`operations/`](operations/)：部署与构建工具链说明。
- [`history/`](history/)：历史目标和过程记录。

## 主题分支边界

- `dev_theme_oil` 只维护 Oil 主题运行代码和公共内容。
- `dev_theme_AIxian` 维护 Alxian 主题模板、样式、脚本和专属资源。
- 两个分支共享 `content/`、`data/site.yaml`、作者资料和公共媒体。

主题专属代码必须位于 `layouts/partials/themes/<theme-id>/`、`static/css/`、`static/js/` 和 `static/assets/<theme-id>/`，不要把主题视觉样式写入文章内容或共享数据。

## 数据事实来源

发布内容位于 `content/zh/` 和 `content/en/`，共享个人资料位于 `data/`。主题只读取这些数据，不复制文章正文、项目描述和联系方式。
