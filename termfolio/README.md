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
