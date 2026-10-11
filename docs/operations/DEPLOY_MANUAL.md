# 中文博客部署指南

## 当前状态

✅ **中文内容已添加完成**，网站现在支持中英双语，默认显示中文。

### 已完成的中文内容

| 板块 | 中文内容 |
|------|----------|
| **首页** | "你好，我是 1byteone" + AI工程师介绍 |
| **项目** | 电商RAG检索系统 + 农业问答Agent（中文详情） |
| **技术栈** | AI与大模型、后端开发、基础设施、开发工具 |
| **经历** | AI应用开发实习生 + 独立开发者 |
| **博客** | 3篇RAG/LangChain技术文章（中文版） |
| **联系** | yjs_0831@qq.com |

## 部署步骤

### 步骤1：添加GitHub Actions工作流

由于GitHub OAuth Token权限限制，需要手动添加工作流文件：

1. 访问 https://github.com/1byteone/1byteone.github.io
2. 点击 "Create new file"
3. 文件名输入: `.github/workflows/deploy.yml`
4. 复制以下内容：

```yaml
name: Deploy Hugo site to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

defaults:
  run:
    shell: bash

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      HUGO_VERSION: 0.139.0
    steps:
      - name: Install Hugo CLI
        run: |
          wget -O ${{ runner.temp }}/hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
          && sudo dpkg -i ${{ runner.temp }}/hugo.deb

      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0

      - name: Setup Go
        uses: actions/setup-go@v5
        with:
          go-version: 'stable'

      - name: Install dependencies
        run: npm ci

      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5

      - name: Build with Hugo
        env:
          HUGO_CACHEDIR: ${{ runner.temp }}/hugo_cache
          HUGO_ENVIRONMENT: production
          TZ: America/New_York
        run: |
          hugo \
            --gc \
            --minify \
            --baseURL "${{ steps.pages.outputs.base_url }}/"

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

5. 点击 "Commit new file"

### 步骤2：启用GitHub Pages

1. 进入仓库 Settings → Pages
2. Source 选择: **GitHub Actions**
3. 等待工作流运行完成（约2-3分钟）

### 步骤3：访问网站

- **URL**: https://1byteone.github.io
- 默认显示中文，可通过导航栏切换到英文

## 语言切换

网站支持中英双语切换：
- 默认语言：中文（zh）
- 可切换到英文（en）
- 导航栏右上角有语言切换按钮

## 本地预览

```bash
cd D:\1byteone.github.io

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:1313
```

## 内容结构

```
content/
├── _index.md          # 英文首页
├── zh/
│   ├── _index.md      # 中文首页
│   ├── projects/      # 中文项目
│   └── blog/          # 中文博客
├── projects/          # 英文项目
└── blog/              # 英文博客
```

## 自定义修改

### 更换头像
替换 `assets/media/authors/me.png`（建议400x400px正方形）

### 添加更多中文内容
在 `content/zh/` 目录下创建新的文件夹和 `index.md` 文件

### 修改主题颜色
编辑 `config/_default/params.yaml` 中的 `theme.colors.primary`

---

**中文博客已准备就绪，推送到GitHub即可自动部署！** 🎉
