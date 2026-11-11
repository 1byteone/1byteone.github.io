# Linear /homepage 公开前端快照

这个目录是 `https://linear.app/homepage` 在 2026-11-10 的离线研究快照，不是 Linear 的私有源码仓库。采集器保留了页面交付的 HTML、CSS、JavaScript module chunks、字体、公开图片与视频，并把 CDN 资源按主机名分目录保存。

## 本地查看

```powershell
python -m http.server 14321 --directory clones/linear.app
```

打开 `http://127.0.0.1:14321/homepage/`。必须通过 HTTP 服务打开，直接双击 HTML 会让 module preload、字体和相对路径失效。

## 采集结果

- 入口：`homepage/index.html`（同时提供根目录 `index.html`）
- 页面入口静态资源引用：321 个相对 `href` / `src`，当前缺失 0 个
- 采集清单：`MIRROR_MANIFEST.json`
- 采集脚本：`../../tools/mirror_linear.py`

Linear 首页会引用 Cloudflare `/cdn-cgi/` 图片、服务端 API、登录态和分析接口。访问控制拒绝的资源、认证接口和服务器行为没有伪造为本地实现；清单中会记录失败项和离线限制。公开静态交互可以加载，但依赖线上数据或认证的动作不会在离线环境中工作。
