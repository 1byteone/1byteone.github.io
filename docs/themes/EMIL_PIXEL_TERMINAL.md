# Emil Pixel Terminal 专业交付说明

## 设计判断

这是一个面向 AI 工程师个人品牌的全屏交互式作品集，不是传统博客首页。实现采用“像素 CRT 启动屏 + 游戏式作品入口 + 共享内容归档”的结构，参考 emil.art 的交互语言重新设计为 YOYO 工程内容。

设计参数：`DESIGN_VARIANCE 8`、`MOTION_INTENSITY 7`、`VISUAL_DENSITY 3`。

## 专业术语

- **CRT compositor**：固定视口的 Canvas 背景合成层，负责扫描线、网格、粒子和指针反馈。
- **Boot state**：首屏启动状态，只保留品牌标识、主题标签、`PRESS START` 和版权信息。
- **Active state**：按下开始后的作品状态，显示左侧导航、右侧像素线框画布和底部键位提示。
- **Portfolio selector**：作品类别选择器，支持鼠标悬停、`↑↓`、`Enter` 和直接链接。
- **Pixel wireframe renderer**：根据 `work / notes / lab / about / themes` 状态绘制不同的线框图形。
- **Asset compositor**：每个状态拥有独立的本地像素资产构图：系统库存面板、知识文档、实验仪表、个人档案、主题画廊；资产不依赖外站图片或跳转。
- **Artboard inspection**：右侧作品画布支持按住拖拽，改变资产透视偏移；角标会显示当前资产码与检查状态。
- **Input contract**：`Enter` 启动或打开、`↑↓` 切换、`Esc` 重置、`M` 切换音效。
- **Content adapter**：视觉层不复制参考站点内容，分类目标接入本站文章、项目、实验和主题中心。
- **Reduced-motion fallback**：系统开启减少动态时，停用背景动画和启动闪烁，但保留完整导航与可读内容。

## 状态机

```text
BOOT
  └─ Enter / Space / Press Start
       └─ ACTIVE
            ├─ Arrow Up/Down -> selector index
            ├─ Enter -> selected route
            ├─ M -> sound state
            └─ Escape / Restart -> BOOT
```

## 资产对照与交付状态

**当前等级：交互式视觉原型，尚未达到逐资产复刻交付。** 页面状态、像素化呈现和 2.5D 画布已实现；作品场景、字形、光标和分类页仍是本地原创适配，和参考站点的资产形态有明显差距。

| 参考资产 / 能力 | 当前实现 | 状态与剩余差距 |
| --- | --- | --- |
| Emil Pixel 显示字体与字标 | 本地绘制的 YOYO 5×7 像素字形 | **部分完成**：品牌字标是自绘像素字，菜单、说明和中文仍使用系统字体；没有复刻字体的逐字字形系统 |
| Boot sprite 与 tiny squares | 原创 Byte sprite、低分辨率粒子、ASCII 点阵和 CRT 扫描线 | **部分完成**：构图和运动是近似设计，尚未逐项匹配参考站点的点阵图案、密度和转场节奏 |
| 五类右侧动态作品资产 | 242×242 Canvas 上的原创透视线框：库存面板、文档、实验台、像素人物、主题方块 | **部分完成**：支持慢速旋转和双轴拖拽，但不是参考画面的同构网格/线稿模型，材质、轮廓、遮挡和动画细节未对齐 |
| 指针资源 | 链接、文本、默认三种 CSS 像素指针态 | **部分完成**：状态可切换，但没有参考站点的独立光标位图资产及完整热点行为 |
| 声音反馈 | Web Audio 方波提示音 | **部分完成**：交互可听见，音色、音序和分类反馈节奏没有按参考音效逐项匹配 |
| 分类详情页 | 工程文章、项目、实验、个人介绍、主题中心等本站路由 | **适配完成 / 复刻未完成**：保留本站内容模型，没有逐一构建参考站点的 Minecraft、Capes、Art、Other 内容页及其作品资产库 |
| 响应式画面 | 桌面与移动布局、无横向溢出 | **行为通过**：移动端已经检查溢出，尚未完成逐状态视觉对照和截图差异验收 |

### 发布验收门槛

- 对照参考站点分别记录 Boot、五个选择状态、返回入口、Sound 开关和拖拽状态的截图。
- 每种选择状态必须呈现可辨识、持续更新的独立作品资产；不能只更换标题、颜色或同一组方框。
- 字体、像素尺寸、点阵背景、光标热点和转场需要有明确的本地资产或绘制规范。
- 在 `1440×1000`、`1280×800`、`390×844` 三种视口检查布局、焦点、触控和 `prefers-reduced-motion`。
- 只有完成上述截图对照与交互回归，才能将状态升级为“参考资产复刻完成”。

## 文件边界

- 模板：`layouts/partials/themes/emil-pixel-terminal/`
- 样式：`static/css/emil-pixel-terminal.css`
- 交互：`static/js/emil-pixel-terminal.js`
- 配置：`config/emil-pixel-terminal/params.yaml`
- 注册：`data/theme_registry.yaml`
- 部署：`.github/workflows/deploy.yml`

## 本地验收

```text
http://localhost:1317/
http://localhost:1317/blog/
http://localhost:1317/theme-center/#terminal-family
```

已验证桌面端 `1440x1000` 与移动端 `390x844`：启动前后状态隔离、Canvas 有像素输出、键盘选择有效、音效状态可切换、移动端 `scrollWidth === viewportWidth`。

参考站点只作为视觉与交互研究对象；本主题不复用其源码、外部素材或外链跳转。
