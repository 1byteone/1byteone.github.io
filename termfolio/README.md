# YOYO / Termfolio

This directory is the standalone Next.js terminal portfolio for the `dev_termfolio` branch.
It is based on [wa1939/termfolio](https://github.com/wa1939/termfolio), which is MIT licensed.
The upstream terminal-native layout and interactive tools are retained while the identity,
avatar, journal, lab records, and contact surface are customized for Jinsong Yang.

## Run locally

```bash
npm install
npm run dev -- -p 1315
```

Open <http://localhost:1315>. The Hugo site can continue running on port 1314 at the same time.

Useful checks:

```bash
npm run typecheck
npm run lint
npm run build
```

Content lives in `content/site.ts`, `content/card.md`, `content/lab.ts`, and `content/posts/`.
The non-human engineering IP is `public/engineer-terminal-avatar.png`.

Article fallback artwork and the related-illustration shelf use a local Bitmap
catalog prepared from 100 visible references on the [Icons8 Bitmap style page](https://icons8.com/illustrations/style--bitmap).
The source previews are archived outside `public/`, while the site serves only
cleaned local PNG derivatives. Keep `assets/sources/icons8-bitmap/README.md`
with the source and license links when redistributing the site.

## Agnes AI terminal assistant

The home terminal includes `agnes` (alias: `chat`), which opens a Chinese engineering
assistant powered by Agnes AI. The browser only calls the local `/api/agnes/chat` route;
the API key is read server-side from `AGNES_API_KEY` and is never sent to the client.

Copy `.env.example` to `.env.local` and set `AGNES_API_KEY` before starting the app.
The default OpenAI-compatible endpoint is `https://api.agnes-ai.cn/v1` and the default
model is `agnes-3.0-flash`. You can override them with `AGNES_API_BASE_URL` and
`AGNES_MODEL`. The route limits message size/history, applies a small request guard, and
returns friendly messages for timeouts, rate limits, and upstream outages.
