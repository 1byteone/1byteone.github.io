# 🎯 专业GOAL: 为技术文章寻找真实图片封面

## 问题分析

之前创建的SVG架构图作为featured图片虽然专业，但存在两个问题：
1. Hugo对SVG的图片处理方法有限制（`image/svg+xml does not support Width method`）
2. 已经转换为PNG后工作正常

用户希望使用`skills`（image-search）找到真正的**真实照片**作为封面图片，让文章更有视觉吸引力。

## 需求对齐

| 需求 | 说明 |
|------|------|
| 寻找真实照片 | 使用image-search skill从Unsplash/Openverse搜索 |
| 版权合规 | 仅使用CC0/CC-BY/Unsplash可商用许可 |
| 专业调性 | 科技感、AI主题、技术氛围 |
| 尺寸要求 | 1200×630 16:9宽屏(landscape) |
| 覆盖范围 | 3篇博客文章 + 2个项目页面 |

## 技术方案

通过image-search skill搜索真实照片，使用Openverse（CC许可）作为主要来源，Unsplash（tteg）作为备选。

## 执行计划

1. 搜索AI/科技主题的真实照片
2. 筛选高质量、可商用、landscape照片
3. 下载到项目目录
4. 替换原有featured.png
5. 推送部署验证

## 验收标准

1. ✅ 每篇文章有真实照片封面
2. ✅ 照片与文章主题相关
3. ✅ 版权合规（CC/Unsplash许可）
4. ✅ 1200×630以上分辨率
5. ✅ 部署成功，HTTP 200