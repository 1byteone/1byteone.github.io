# AI Lab 开源图片资产库

更新日期：2026-11-05。当前批次新增 **53 个可复用文件**：33 个 SVG 编辑插画和 20 个 1200×675 PNG 横版封面。素材用于 AI Lab 的文章封面、研究卡片和正文插图；没有调用生图模型，也没有把 Anthropic 页面截图当成可再发布素材。

## 目录

```text
assets/media/ai-lab/library/
└── editorial/
    ├── open-doodles-react/          # 33 个可编辑 SVG
    ├── open-doodles-react-covers/   # 20 个 PNG 文章封面
    └── NOTICE-react-open-doodles.txt
```

Hugo 的 module mount 会将 `assets/media` 暴露为 `/media`，因此文章或模板可以使用类似下面的路径：

```markdown
![AI Lab 编辑插画](/media/ai-lab/library/editorial/open-doodles-react/open-doodles-reading.svg)
![实验封面](/media/ai-lab/library/editorial/open-doodles-react-covers/cover-20-reading-side.png)
```

## 来源与许可证

本批素材来自 npm 的 [`react-open-doodles@1.0.5`](https://www.npmjs.com/package/react-open-doodles/v/1.0.5) 分发包。该包 README 指向 [Open Doodles](https://www.opendoodles.com/)，并注明作者为 Pablo Stanley；上游插画页面标注 CC0 1.0 / Public Domain，可用于个人和商业项目。npm 包自身是 MIT 许可证，由 Leocardoso94 / Luna 维护，因此仓库保留了 [`NOTICE-react-open-doodles.txt`](../../assets/media/ai-lab/library/editorial/NOTICE-react-open-doodles.txt) 中的 MIT 版权和许可文本。

完整的多来源覆盖（Open Peeps、unDraw、ManyPixels、Humaaans、Blush、Kitbitz、Poly Haven、ambientCG、Wikimedia Commons、Smithsonian 等）见 [`AI_LAB_SOURCE_COVERAGE.md`](./AI_LAB_SOURCE_COVERAGE.md)。不同来源的文件和授权不会合并成一个模糊的“免费素材”标签。

许可证边界已经写入 [`ai-lab-open-source-library-manifest.json`](../../assets/data/ai-lab-open-source-library-manifest.json)：

- `license_status: verified`：本批 53 个文件都有明确的上游来源和许可证证据。
- `commercial_use: true`、`redistributable: true`：适用于本项目的学习、网站展示与商业部署；发布时继续携带 NOTICE。
- `attribution_required: false`：CC0 不强制署名，但页面和清单仍保留 Pablo Stanley、Open Doodles 及包作者信息。
- PNG 是本地 SVG 的栅格衍生物，不是模型生成图。源 SVG 的 SHA-256、PNG 的 SHA-256、尺寸、字节数和处理方式均已逐项记录。

这批素材与 Anthropic 页面只共享“温暖编辑插画”的研究方向，不复制 Anthropic 的标志、专有插图或官网素材。此前的 Anthropic 参考副本仍保持独立的 `reference-only` 授权状态，不能与本批 CC0 素材混用。

## 校验

```powershell
node tools/ai-lab/verify-open-source-library.cjs
```

校验器会检查：文件是否存在、SHA-256 和字节数是否一致、SVG 是否可解析且没有脚本/外部 URL、PNG 签名和 1200×675 尺寸是否正确，以及清单中的许可证状态是否为 `verified`。最近一次结果：`53 files (33 SVG + 20 PNG), hashes and dimensions verified`。

完整数据清单见 [`assets/data/ai-lab-open-source-library-manifest.json`](../../assets/data/ai-lab-open-source-library-manifest.json)。多来源下载状态见 [`AI_LAB_SOURCE_COVERAGE.md`](./AI_LAB_SOURCE_COVERAGE.md)。已有 Open Doodles 12 张原始 SVG、6 张衍生封面、20 张共享文章封面及 Anthropic 参考图继续保留各自的 manifest，不并入本批统计。
