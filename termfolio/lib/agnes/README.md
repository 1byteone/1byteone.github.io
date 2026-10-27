# Agnes AI 接入层

`lib/agnes` 是一个不依赖 UI 框架的 Agnes OpenAI-compatible 客户端。它把服务商
响应转换为统一的 `AIResponse` / `AIBlock`，并集中处理超时、取消、429/5xx 退避、
网络错误和流式 SSE 解析。

`AIBlock` 已预留 `text`、`markdown`、`code`、`json`、`table`、`chart`、`image`、
`source`、`metric`、`status` 和受控 `artifact` 等类型。当前终端渲染器优先渲染
文本、代码、引用和安全结构化预览；其他类型可由后续业务组件按协议扩展。

## 安全边界

`createAgnesClient` 只应在 Next.js route、Server Action 或其他服务端代码中调用：

```ts
import { createAgnesClient } from "@/lib/agnes"

const agnes = createAgnesClient({
  apiKey: process.env.AGNES_API_KEY ?? "",
  baseUrl: process.env.AGNES_API_BASE_URL,
  model: process.env.AGNES_MODEL,
})

const result = await agnes.chat([{ role: "user", content: "解释 RAG 的召回与重排" }])
// result.message / result.text / result.blocks
```

浏览器侧如果需要调用本站代理，使用不带密钥的 `createAgnesRouteClient`：

```ts
import { createAgnesRouteClient } from "@/lib/agnes"

const agnes = createAgnesRouteClient()
const result = await agnes.chat([{ role: "user", content: "如何设计重试策略？" }])
```

该客户端只会请求本站 API，并没有 `apiKey` 配置项；`createAgnesClient` 则在浏览器
环境中主动拒绝执行，避免把服务端客户端误打包到前端。

浏览器只请求本站 `/api/agnes/chat`，不能读取 `AGNES_API_KEY`，也不能使用
`NEXT_PUBLIC_AGNES_API_KEY`。API route 可以直接返回 `result.message`、`result.model`
和 `result.requestId`，以兼容现有 `AgnesChat`。

## 流式输出

`parseSse` 可解析 OpenAI-compatible `data: {...}` / `data: [DONE]` 事件；
`streamText` 接受服务端已经带好 `Authorization` 的 `fetch` 请求，适合后续把终端
UI 改为逐字输出。当前 UI 仍使用普通 JSON 响应。

服务端返回的结构化块必须先经过 `parseAIBlocks`，再交给渲染器。它会限制文本、
代码、URL、表格行数和卡片字段长度，丢弃未知类型；渲染器仍需关闭原始 HTML，
并对链接、图片和 SVG 使用协议/来源白名单。`artifact` 只作为隔离预览数据，
不能直接执行模型生成的 JavaScript 或 HTML。

## 本地验证

项目没有测试运行器时，可使用项目已有的 `npm run typecheck` 和 `npm run lint`；
这些命令会检查所有 `lib/agnes` 文件。`withRetry`、`backoffDelay`、
`normalizeAgnesResponse`、`parseAIBlocks` 和 `parseSse` 都是纯函数/标准 Web API，可直接在 Node 或
浏览器测试环境中调用。
