const e=({status:t,message:n})=>`<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<meta name="robots" content="noindex" />
		<meta name="theme-color" content="#f8f8f8" />
		<title>`+t+` | matthewtrent.me</title>
		<!--
			SvelteKit's last resort, and the only page on this site that cannot be a
			component: it is what renders when the app shell itself failed — an error
			thrown while rendering \`+error.svelte\`, or before a route was ever
			reached. Until this file existed that case served SvelteKit's default
			white "Internal Error" card, which is how a database outage looked like
			somebody else's website.

			So: no JavaScript, no fonts to fetch, no stylesheet that could be the
			thing that is broken. Inline, static, and close enough to the site's own
			paper that it reads as this place having a bad minute.
		-->
		<style>
			:root {
				--paper: #f8f8f8;
				--ink: #1a1a1a;
				--muted: #6e6e6e;
				--rule: #d8d8d8;
			}
			@media (prefers-color-scheme: dark) {
				:root {
					--paper: #121212;
					--ink: #ededed;
					--muted: #9a9a9a;
					--rule: #2e2e2e;
				}
			}
			html {
				color-scheme: light dark;
			}
			body {
				margin: 0;
				min-height: 100vh;
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 1.5rem;
				box-sizing: border-box;
				background: var(--paper);
				color: var(--ink);
				font:
					450 1rem/1.5 Inter,
					'Inter Fallback',
					system-ui,
					-apple-system,
					sans-serif;
				-webkit-font-smoothing: antialiased;
			}
			main {
				width: 100%;
				max-width: 30rem;
			}
			.code {
				font:
					400 0.8125rem/1 ui-monospace,
					SFMono-Regular,
					Menlo,
					monospace;
				letter-spacing: 0.08em;
				text-transform: uppercase;
				color: var(--muted);
			}
			h1 {
				margin: 0.75rem 0 0;
				font-size: 1.5rem;
				font-weight: 550;
				letter-spacing: -0.01em;
			}
			p {
				margin: 0.75rem 0 0;
				color: var(--muted);
			}
			hr {
				margin: 1.5rem 0 0;
				border: 0;
				border-top: 1px solid var(--rule);
			}
			a {
				display: inline-block;
				margin-top: 1.5rem;
				color: var(--ink);
				text-decoration-color: var(--rule);
				text-underline-offset: 0.25em;
			}
			a:hover {
				text-decoration-color: currentColor;
			}
		</style>
	</head>
	<body>
		<main>
			<div class="code">Error `+t+`</div>
			<h1>Something went wrong</h1>
			<p>`+n+`</p>
			<hr />
			<a href="/">Back to the homepage</a>
		</main>
	</body>
</html>
`;export{e as default};
