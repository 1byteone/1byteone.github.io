# 🎯 专业GOAL: 图片预览放大 + 流程图插入

## 需求对齐（头脑风暴）

### 需求1: 图片预览放大功能

**目标**: 文章内嵌的架构图、流程图点击后可以放大预览，而非固定在文章排版宽度内。

**方案对比**:

| 方案 | 实现方式 | 性能 | 复杂度 |
|------|---------|------|--------|
| A. 原生JS Lightbox | 自写HTML+CSS+JS轻量实现 | ✅ 零依赖、<1KB | ⭐ 低 |
| B. GLightbox库 | 第三方开源库，功能完整 | ✅ 约10KB | ⭐ 低 |
| C. medium-zoom | 轻量库，仅缩放 | ✅ 约2KB | ⭐ 极低 |
| D. Hugo渲染钩子 | `_markup/render-image.html` 全局注入 | ✅ 自动对所有图片生效 | ⭐ 极低 |

**推荐方案**: **A+D** — Hugo渲染钩子 + 自写轻量Lightbox，零依赖、自动对所有文章图片生效。

### 需求2: 流程图输出到文章

**目标**: 使用 `diagram-design` 或 `uml` 技能为文章生成专业架构图，并嵌入到文章中合适位置。

**方案对比**:

| 方案 | 工具 | 风格 | 适合 |
|------|------|------|------|
| A. `diagram-design` 技能 | 自绘HTML+CSS+SVG | 可定制、品牌统一 | 架构图、流程图 |
| B. `uml` 技能 | PlantUML | 标准UML符号 | 类图、时序图 |
| C. `graphviz` 技能 | DOT语言 | 自动布局 | 依赖图、拓扑图 |
| D. `architecture-diagram` 技能 | 深色科技风 | 专业科技感 | 系统架构图 |

**推荐方案**: **A为主+B为辅** — `diagram-design` 生成品牌统一的白板风格架构图，与 `CLAUDE.md` 视觉规范一致。

---

## 执行计划

### Phase 1: 图片预览放大
1. 创建 `layouts/_default/_markup/render-image.html` — Hugo渲染钩子，包裹图片
2. 添加 `assets/css/lightbox.css` — 灯箱样式（暗色覆盖、居中、动画）
3. 添加 `assets/js/lightbox.js` — 点击放大、关闭、键盘导航

### Phase 2: 流程图输出
1. 使用 `diagram-design` 或 `uml` 技能生成架构图
2. 输出为SVG/PNG到 `assets/media/blog/` 或 `content/zh|en/blog/<文章>/`
3. 嵌入到文章正文中

### Phase 3: 集成验证
1. 验证所有页面图片可点击放大
2. 验证流程图显示正常
3. 部署并验证HTTP 200

## 验收标准

1. ✅ 点击文章内图片可放大预览
2. ✅ 点击遮罩层/关闭按钮可关闭
3. ✅ 支持键盘ESC关闭
4. ✅ 流程图与文章内容匹配
5. ✅ 流程图风格统一（白板手绘风）
6. ✅ 部署成功，HTTP 200