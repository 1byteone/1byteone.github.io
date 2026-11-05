# AI Lab 多来源素材覆盖记录

本次按参考资料逐个核对来源，避免只使用 Open Doodles 却把目录写成“已覆盖全部图库”。当前清单包含 **27 个来源**，其中 **6 个来源已下载 258 个文件**，另有 4 个来源保存了官方预览图，因此本地资产目录共 **262 个图像文件**；其余来源按实际授权和网络结果明确标记。

完整字段见 [`ai-lab-source-library-manifest.json`](../../assets/data/ai-lab-source-library-manifest.json)，校验命令为：

```powershell
node tools/ai-lab/verify-source-library.cjs
```

## 已下载并核验

| 来源 | 本地文件 | 许可证/边界 |
| --- | ---: | --- |
| Open Doodles | 33 SVG | CC0 1.0；原有 20 个 PNG 封面另有专用 manifest |
| Open Peeps | 219 SVG/PNG | 官方页面 CC0；来自官方页面 CDN，保留来源 URL |
| unDraw | 3 SVG | unDraw 免费许可；从 `undraw-svg@2.0.0` 提取 |
| Poly Haven | 1 PNG 预览 | CC0 资产；API 集成有额外使用条款 |
| ambientCG | 1 PNG 材质预览 | CC0 1.0 |
| Wikimedia Commons | 1 JPEG | CC BY-SA 4.0；必须署名并以相同方式共享 |

## 已下载但仅作参考

ManyPixels、Humaaans、Blush、Kitbitz 各有官方页面预览图保存到 `editorial/official-reference-pages/`。这些文件用于研究版式、色彩和构图，清单中标记为 `reference-only`，没有声明可以重新打包分发。

## 已核对来源但当前未复制原始图片

- Smithsonian Open Access：API 元数据记录 `siris_sil_13719` 已返回 `CC0`，但图像 delivery endpoint 在本机被上游 WAF 拒绝，因此只保留 [`SOURCE_RECORD.json`](../../assets/media/ai-lab/library/editorial/smithsonian/SOURCE_RECORD.json)，没有伪造图片文件。
- 3Dicons、Khagwal 3D、Storyset、Texturelabs、Textures for Free、MuseuMoon、National Gallery of Art、BlenderKit、Sketchfab、CGAxis：需要文件级许可证或稳定官方下载端点，清单标为 `not-downloaded` / `review-required`。
- Unsplash、Pexels：是免费图库许可，不等同于开源再分发许可；当前只保留来源记录。
- Pinterest、Behance、Dribbble、SVG Nexus：只作为灵感或索引，严禁把搜索结果当作素材下载源。

每个来源都已经有独立状态、来源页、许可证 URL、商业使用字段、署名要求和本地文件 hash。这样后续继续下载时可以追加单个来源，不会把不同平台的授权混在一起。
