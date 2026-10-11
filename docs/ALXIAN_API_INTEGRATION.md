# Alxian API integration

Alxian is deployable as a static GitHub Pages site. Its interactive controls use the browser as a deterministic fallback and can be connected to a same-origin or external API without changing the theme templates.

Set the API root in `config/alxian/params.yaml`:

```yaml
api_base: "https://api.example.com"
```

The client currently uses these contracts:

| Endpoint | Method | Payload / response |
| --- | --- | --- |
| `/api/comments` | `GET` | Array of comments or `{count}` |
| `/api/comments` | `POST` | `{content, nickname}` |
| `/api/reactions` | `GET` | Counts keyed by `like`, `cheer`, `celebrate`, `appreciate`, `smile` |
| `/api/reactions` | `POST` | `{type}` |
| `/api/visitors` | `GET` / `POST` | Stats `{todayVisitors, totalVisitors}`; record accepts `{path, referrer}` |
| `/api/chat/rooms` | `GET` | Array or `{rooms}` |
| `/api/chat/messages?roomId=...` | `GET` | Array or `{messages}` |
| `/api/chat/messages` | `POST` | `{roomId, nickname, content}` |
| `/api/friends` | `GET` | Approved friend records |
| `/api/friends/stats` | `GET` | `{approved, pending, rejected, totalVisits, totalLikes}` |
| `/api/friends/{id}/visit` | `POST` | Records a friend visit |

When an endpoint is unavailable, comments, reactions, chat messages, visitor totals, and static friend data remain usable locally. The site never embeds the reference site's live personal data.

## Verification

- `node --check static/js/alxian-theme.js`
- `node --check static/js/alxian-pages.js`
- `git diff --check`
- GitHub Actions deploy workflow route matrix
