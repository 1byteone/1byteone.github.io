# 🎯 专业GOAL: 修复英文版白屏问题

## 问题诊断

### 根因分析
当我们把 `content/zh/` 的中文内容移动到 `content/` 后，原始的英文内容被覆盖删除。`languages.yaml` 中英文语言配置没有指定 `contentDir`，导致 Hugo 切换英文时找不到任何内容，渲染白屏。

### 问题验证
- `content/` 目录: 只有中文内容
- `content/en/` 目录: ❌ 不存在
- 英文内容: 存在于 git 历史记录 (commit `14a9752`)
- 当前 `languages.yaml` 中 `en` 缺少 `contentDir` 配置

## 解决方案

### 方案: 创建英文内容目录 + 恢复历史内容

**核心思路**:
1. 创建 `content/en/` 目录
2. 从 git 历史恢复英文首页、项目、博客内容到 `content/en/`
3. 更新 `languages.yaml`，为英文设置 `contentDir: content/en`
4. 将英文内容适配为与当前中文内容一致的最新版本（含专业GOAL展示）

### 文件清单

| 文件 | 来源 | 说明 |
|------|------|------|
| `content/en/_index.md` | git恢复 + 适配 | 英文首页，含Hero、项目、技术栈、经历、博客、联系 |
| `content/en/projects/ecommerce-rag-search/index.md` | git恢复 + 适配 | 英文项目页：分布式微云商城 |
| `content/en/projects/agricultural-qa-agent/index.md` | git恢复 + 适配 | 英文项目页：农业知识问答系统 |
| `content/en/blog/building-rag-pipeline/index.md` | git恢复 + 适配 | 英文博客：RAG管道教程 |
| `content/en/blog/building-ai-agents/index.md` | git恢复 + 适配 | 英文博客：AI智能体教程 |
| `content/en/blog/hallucination-prevention/index.md` | git恢复 + 适配 | 英文博客：幻觉预防指南 |
| `content/en/authors/` | git恢复 | 英文作者信息 |
| `content/en/work/professional-goal.md` | 新建 | 英文专业GOAL页面 |

## 验收标准

1. ✅ 中文版 (默认) 正常显示中文内容
2. ✅ 切换英文后显示完整英文内容，而非白屏
3. ✅ 英文内容与中文内容结构一致（项目、博客、专业GOAL）
4. ✅ 所有导航链接正常工作
5. ✅ 部署成功，HTTP 200

## 执行计划

1. 创建 `content/en/` 目录结构
2. 从 git 恢复英文首页内容并适配
3. 从 git 恢复英文项目内容并适配
4. 从 git 恢复英文博客内容并适配
5. 创建英文专业GOAL页面
6. 更新 `languages.yaml` 配置 `contentDir`
7. 提交并推送，验证部署
8. 验证英文页面显示正常