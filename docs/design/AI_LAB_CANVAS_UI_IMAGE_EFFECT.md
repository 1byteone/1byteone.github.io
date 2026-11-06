# AI Lab Canvas UI 图片交互交付说明

## 目标

为 AI Lab 首页“继续了解”栏目和研究档案封面增加可读的 Canvas 图像交互层。原始 `<img>` 始终保留，Canvas 只负责悬浮、聚焦和触摸意图下的粒子显影，不改变文章封面的语义、链接和加载回退。

## 参考与边界

- 参考目录：<https://canvasui.dev/components>
- 研究档案图像参考：<https://archives.parallel.ai/>（作者：yang you / yangyou、christopher / reathchris）
- 采用的交互语法：`particle-reveal` 的局部粒子显影、光圈、细边界扫描和指针跟随。
- 本项目使用独立的 Canvas 2D 实现，没有复制 Canvas UI 的源码、品牌、素材或专属文案。
- 资产仍由 Hugo 本地处理，封面图片的来源和 `alt` 文本沿用现有内容模型。

## 运行时契约

| 状态 | 行为 |
| --- | --- |
| 初始/加载 | 原图和已有 shimmer 回退先显示；Canvas 不阻塞首帧。 |
| 悬浮/触摸 | 在指针附近采样原图颜色，绘制渐进粒子、径向光圈和双扫描环。 |
| 键盘聚焦 | 以图片中心作为焦点位置，触发同样的显影层；链接仍可用 Enter 打开。 |
| 离开/离屏 | 清空 Canvas 并停止帧循环；IntersectionObserver 和页面隐藏状态共同控制绘制。 |
| reduced-motion | 关闭 Canvas 动效层，保留完整静态图片和文字。 |
| 失败 | 图片错误时沿用 `IMAGE / FALLBACK` 或内容模型的回退状态。 |

## 性能与可访问性

- 采样缓冲限制在最大 640px 宽，设备像素比限制为 1.5，避免为封面创建过大的 `ImageData`。
- 绘制只发生在用户意图和元素可见时，不使用持续的全局轮播循环。
- Canvas 设置 `aria-hidden="true"`，不会重复读出图片内容；语义描述由 `<img alt>` 提供。
- 交互层使用 `mix-blend-mode: screen` 与低透明度，避免遮挡标题和封面主体。
- 浏览器回归覆盖 Canvas 初始化、悬浮可见、离开清除和 reduced-motion 隐藏。
