# 手动部署指南

由于GitHub OAuth Token权限限制，需要手动添加GitHub Actions工作流。

## 步骤1：在GitHub上添加工作流文件

1. 访问 https://github.com/1byteone/1byteone.github.io
2. 点击 "Create new file"
3. 文件名输入: `.github/workflows/deploy.yml`
4. 复制以下内容到文件中：

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

## 步骤2：启用GitHub Pages

1. 进入仓库 Settings → Pages
2. Source 选择: **GitHub Actions**
3. 等待工作流运行完成

## 步骤3：访问网站

- URL: https://1byteone.github.io
- 等待2-3分钟部署完成

## 备选方案：使用Netlify

如果GitHub Pages有问题，可以使用Netlify：

1. 访问 https://app.netlify.com
2. 点击 "Add new site" → "Import an existing project"
3. 选择 GitHub，授权后选择 `1byteone.github.io` 仓库
4. 部署设置保持默认
5. 点击 "Deploy site"

Netlify会自动检测Hugo项目并部署。

## 本地预览

在本地查看效果：

```bash
cd D:\1byteone.github.io

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:1313
```
