/*
  Portfolio Evolution collector.

  This exact file is vendored, unchanged, into all three sites (v1 static, v2
  Next.js, v3 SvelteKit). That is not tidiness, it is the measurement: the
  section it feeds compares its numbers across three designs, so if any site
  computed "bounce" or "scroll depth" even slightly differently the comparison
  would be reporting the difference between three implementations rather than
  three designs. Per-site differences live in `data-*` config below, never in
  the logic.

  It sends one row per session, not an event stream. Every published
  column is session-scoped, so a session summary is all the table
  ever needs — which is what keeps this small enough to own outright instead of
  inheriting a vendor's definitions.

  Deliberately dependency-free and framework-free: v1 is static HTML with no
  build step, so anything requiring a bundler could not run on the site the
  comparison most needs a baseline from.

  Config, on the script tag itself:

    <script src="/evolution.js"
            data-endpoint="https://matthewtrent.me/api/analytics/evolution"
            data-era="v1"
            data-version="v1.0.0"
            data-home="/,/index.html"
            data-blog="^/articles/[^/]+$"
            data-exclude="^/admin(/|$)"
            data-enabled="true"></script>

  From script, for actions no element owns (a keyboard shortcut, an assistant
  copying the address, a form that posts with fetch):
  `document.dispatchEvent(new CustomEvent('evo:mark', { detail: signal }))`,
  where signal is 'email' | 'form' | 'print' | 'resume' | 'share' | 'social' |
  '<url being opened>'. 'contact' is still read, as 'email'. The same words
  work as a `data-evo` attribute on the element that owns the action.
*/
(function () {
	'use strict';

	var script = document.currentScript;
	if (!script) return;

	function attr(name, fallback) {
		var value = script.getAttribute('data-' + name);
		return value === null || value === '' ? fallback : value;
	}

	var ENDPOINT = attr('endpoint', '');
	var ERA = attr('era', '');
	var VERSION = attr('version', 'v0.0.0');
	if (!ENDPOINT || !ERA) return;

	/*
	  Which definition of the columns this file records under. The server stores
	  it on the row and the aggregate decides per column what an older row can
	  still say (`SESSION_VALUES` in v3's evolution-store.ts). Sent, not stamped
	  server side, because the three sites deploy separately and a browser can
	  hold an older copy of this file for hours: the row has to say what
	  actually measured it. Rows from before this field arrive without it and
	  are read as definition 2.

	  3 — (2026-09-11) scrolling past 10% of any page is engagement, not only
	      the homepage; a touch-down and a browser shortcut are not engagement;
	      scroll depth comes only from visits that opened the homepage; GitHub
	      counts as a social click only under the owner's accounts; a session
	      ends after 30 idle minutes even in an open tab; a page restored from
	      the back/forward cache is a pageview.
	  4 — (2026-09-12) any scroll the visitor makes is engagement, not only one
	      past 10% of the page: on a long page 10% was several screens, so a
	      visitor reading the top of it was filed as a bounce.
	  5 — (2026-09-13) each profile (GitHub, X, LinkedIn, Instagram, Discord,
	      Spotify), the résumé, copying/opening the email, the contact form and
	      the printer form are recorded separately; "social" no longer includes
	      the résumé; opening the résumé page itself counts; the kind of page a
	      visit landed on is recorded.
	  6 — (2026-09-15) duration is engaged-visible time — it runs only while the
	      page is in front of someone and within five minutes of their last
	      input, or a single minute when they have not done anything yet, so a
	      tab left open banks a minute instead of half an hour; a
	      session ends after 45 minutes with no input, measured the same way
	      whether the session was found in storage or is the one already open; a
	      tab that loads hidden starts when it is first shown, and a reload is
	      not a second pageview; scroll depth comes only from scrolls the
	      visitor caused, never from the site's own glides; Escape, Tab, the
	      function keys and a right-click are not engagement, and a touch drag
	      that moves is.
	  9 — (2026-09-19) the window a homepage scroll was measured in is recorded
	      with it: viewport width and height, and the `scrollHeight - innerHeight`
	      the percentage actually divided by. Additive — no existing column is
	      redefined and nothing published reads them yet.

	      `max_scroll_pct`'s denominator is a property of the visitor's window,
	      not of the page, and the three sites answer a phone very differently:
	      v1 is 2.5x its desktop height on a phone where v3 is 1.1x. So the
	      published median was taken over a device mix that differed per era, and
	      nothing in the row could say so. With the denominator stored beside the
	      depth, a share can be rebuilt against a common height.

	  10 — (2026-09-24) the kind of device the visit was on is recorded: mobile,
	      tablet, desktop or unknown (see `deviceClass`). Additive — no existing
	      column is redefined and nothing published reads it yet; it exists so
	      every column can later be read per device.

	  11 — (2026-11-01) whether the visit copied an article's link with its
	      share button is recorded (`'share'`, marked by v3's article masthead;
	      v1 and v2 have no such button). Additive — no existing column is
	      redefined.

	  12 — (2026-11-05) v3's share codes: whether the visit pressed a series'
	      or a thought's share mark (`'share-series'`, `'share-thought'`) or any
	      share control at all, and the code the visit arrived through, read off
	      `data-share-via` on <html> where v3's boot script leaves it. Additive.

	  8 — (2026-09-19) four things the collector was getting wrong, each of which
	      made a published column measure something other than what it says.

	      A bfcache restore of the *same* page is no longer a pageview: iOS
	      freezes a backgrounded tab into it, so every app switch was counting
	      the page again (one v1 visit: ten pageviews in twenty seconds, nothing
	      clicked). Being shown is no longer treated as input: it used to re-arm
	      the time window and push the idle boundary, so an untouched tab banked
	      minutes of "still reading" and never expired. A click now arms the
	      scroll-gesture window, because v1 and v2 are navigated down the page by
	      buttons that scroll smoothly and neither fires a wheel or a touchmove.
	      And a finger's scroll keeps counting for three seconds after it lifts,
	      which is where most of an iOS fling happens; scroll keys pressed with a
	      modifier (Ctrl+End, Cmd+Down) count as well, having previously been
	      dropped before the scroll-key check could see them.

	      Known and still missing: a scrollbar drag and a find-in-page jump reach
	      the page through no event this can see, so both still record no depth.

	  7 — (2026-09-18) how far a visit gets down an article is recorded too, in
	      percent and in pixels, as a high-water mark across every article it
	      opened. Additive: a new column, no existing one redefined, so nothing
	      else loses its history.

	      Both units for the reason the homepage keeps both — a percentage of a
	      long page and of a short one are not the same reading. On this site's
	      own articles they disagree: 47% of one and 27% of another are the same
	      ~2,500px, because the second is 1.6x longer.

	      Known edge, the same one the homepage columns have: depth is sampled
	      only on a scroll the visitor makes, so an article short enough not to
	      scroll records 0 rather than 100. Left rather than papered over —
	      every article today is 5,000px+, and fixing it is a definition 8.
	*/
	var DEFINITION = 12;

	/*
	  The owner's own browsing is not a visitor's. v3 mutes its admin by cookie,
	  but v1 and v2 have no server to set one, so any of the three can be told
	  directly: open a page once with `?evo=off` and this browser stops
	  reporting on that site; `?evo=on` undoes it. Per origin, because storage
	  is.
	*/
	var OPT_OUT_KEY = 'evo_opt_out';
	try {
		var params = new URLSearchParams(window.location.search);
		var choice = params.get('evo');
		if (choice !== null) {
			if (choice === 'off') window.localStorage.setItem(OPT_OUT_KEY, '1');
			if (choice === 'on') window.localStorage.removeItem(OPT_OUT_KEY);
			/*
			  The choice belongs to the browser that made it, not to the address. It
			  was staying in the URL, so anyone who copied the link out of the bar and
			  shared it opted out everyone who followed it — silently, and for good.
			  Taking it back out of the address is the only part of this that can be
			  undone after the fact.
			*/
			params.delete('evo');
			var rest = params.toString();
			history.replaceState(
				history.state,
				'',
				window.location.pathname + (rest ? '?' + rest : '') + window.location.hash
			);
		}
		if (window.localStorage.getItem(OPT_OUT_KEY) === '1') return;
	} catch (e) {
		/* no storage, so no choice to remember */
	}

	/*
	  The two gates that kept this property clean, carried over from v3.

	  `enabled` is the prod gate. Without it a dev server reports into the live
	  numbers, which is not hypothetical: local traffic was ~63% of the Google
	  Analytics property these three sites shared, with engagement times of 18
	  and 38 minutes dragging every average with it.

	  The iframe check matters because the Portfolio Evolution section frames v1
	  and v2 inside v3. Without it, every reader who opens the era strip files a
	  short, bounce-shaped session against the very rows the strip is about, and
	  the section quietly corrupts its own subject.
	*/
	if (attr('enabled', 'true') !== 'true') return;

	/*
	  The owner's browser, by a readable marker cookie the site sets at sign-in
	  (v3's `admin_present`). Checked here, in the browser, and never by the
	  server leaving the tag out: a page's HTML must be the same for every
	  visitor, or a shared cache that stored the owner's copy would switch
	  counting off for everyone it served. Checked again before every send, so
	  signing in mid-visit (in another tab) stops the session at once.
	*/
	var MUTE_COOKIE = attr('mute-cookie', '');

	function muted() {
		if (!MUTE_COOKIE) return false;
		try {
			var parts = document.cookie.split(';');
			for (var c = 0; c < parts.length; c++) {
				if (parts[c].replace(/^\s+/, '').indexOf(MUTE_COOKIE + '=') === 0) return true;
			}
		} catch (e) {
			/* unreadable cookies: not the owner's marker */
		}
		return false;
	}

	if (muted()) return;

	var host = window.location.hostname;

	/*
	  Development never reports, by three independent means, because this is the
	  failure that already happened once: local traffic was ~63% of the Google
	  Analytics property these sites shared, with 18- and 38-minute "engagement"
	  times dragging every average with it.

	  1. `data-enabled` is the environment switch, and absent reads as off. A
	     deploy that forgets to set it reports nothing, which is recoverable; one
	     that reports development into the published numbers is not.

	  2. `data-hosts`, when set, is an allowlist of hostnames that may report.
	     This is how a site with no build step gets a gate at all — v1 is static
	     HTML, so it has no environment to read a variable out of, but it does
	     know what it is called in production. It also catches preview deploys,
	     which a boolean baked at build time cannot.

	  3. Loopback and private addresses are refused outright. `localhost` alone
	     was not enough: a dev server started with `--host` is reached over the
	     LAN at a 192.168/10./172.16 address, which is exactly how a phone gets
	     used to test a portfolio.

	  `data-allow-local="true"` lifts (3) to exercise the pipeline on purpose.
	*/
	var hosts = attr('hosts', '');
	if (hosts) {
		var permitted = false;
		var list = hosts.split(',');
		for (var h = 0; h < list.length; h++) {
			if (host === list[h].trim()) permitted = true;
		}
		if (!permitted) return;
	}

	var isLocal =
		host === '' ||
		host === 'localhost' ||
		host === '::1' ||
		host === '0.0.0.0' ||
		/^127\./.test(host) ||
		/^10\./.test(host) ||
		/^192\.168\./.test(host) ||
		/^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
		/\.local$/.test(host) ||
		window.location.protocol === 'file:';

	if (isLocal && attr('allow-local', 'false') !== 'true') return;

	try {
		if (window.self !== window.top) return;
	} catch (e) {
		return; // Cross-origin frame access throws: definitely embedded.
	}

	/*
	  A browser something is driving (Playwright, Puppeteer, WebDriver, or the
	  Claude app's browser pane) is not a visitor. Headless WebKit sends a plain
	  Safari user agent, so the server's bot filter alone never caught it.
	  `analytics_allow_automation=1` lets a deliberate probe through.
	*/
	try {
		if (
			(navigator.webdriver === true || /\bClaude\/\d/.test(navigator.userAgent)) &&
			document.cookie.indexOf('analytics_allow_automation=1') === -1
		) {
			return;
		}
	} catch (e) {
		/* no navigator: nothing to learn */
	}

	var HOME_PATHS = attr('home', '/').split(',');
	var BLOG_RE = attr('blog', '') ? new RegExp(attr('blog', '')) : null;
	/*
	  Paths that are not part of the site being measured. v3 has an /admin
	  console: the person reading the numbers must never be one of them, and the
	  session that walks into it must not grow while they are in there.

	  It is a per-site `data-*` and not a hardcoded '/admin' because v1 and v2
	  have no such page — and it is checked here, per pageview, rather than left
	  to whether the tag was served at all, because v3 navigates without a
	  document load. A client-side route change into /admin carries this same
	  script with it; only a live path check sees that.
	*/
	var EXCLUDE_RE = attr('exclude', '') ? new RegExp(attr('exclude', '')) : null;
	/*
	  Which pages, when opened, are the résumé itself. By default any page a
	  résumé link would match. v1 narrows it: its /resume/ is a "Resume Link
	  Directory" (reached by URL or QR code), not the résumé.
	*/
	var RESUME_PAGE_RE = attr('resume-pages', '') ? new RegExp(attr('resume-pages', '')) : null;
	var SOCIAL_HOSTS = attr(
		'socials',
		'github.com,linkedin.com,x.com,twitter.com,instagram.com,discord.gg,discord.com,spotify.com,stackoverflow.com'
	).split(',');
	/* Which per-profile flag a social host sets. Hosts not here only count as "any social". */
	var NETWORKS = {
		'github.com': 'gh',
		'x.com': 'x',
		'twitter.com': 'x',
		'linkedin.com': 'li',
		'instagram.com': 'ig',
		'discord.gg': 'dc',
		'discord.com': 'dc',
		'spotify.com': 'sp'
	};
	/*
	  GitHub is the one host these sites link that is not only the owner's: v1
	  credits collaborators by profile, v2 and v3 link repos under other people's
	  accounts. Following one of those is not a visit to the owner's socials, so
	  GitHub (and gist.github.com) counts only under these accounts — his own,
	  and the orgs of his own startups (Confesi, Kurlox). LinkedIn, X,
	  Instagram and Stack Overflow have the same rule below. Discord invites on
	  the three sites are all his servers; its /api/ links (a bot install) are
	  not a visit. Any Spotify link counts — a profile, a playlist, or a song
	  from the now-playing line: following one is going to his music.

	  YouTube is not a social at all: the sites link other people's tutorials,
	  a rick-roll on v2's error pages, and a project teaser, never a channel of
	  his (audited 2026-09-13).
	*/
	var GITHUB_ACCOUNTS = attr('github', 'mattrltrent,mattrltrent2,confesi,kurloxsearchengine')
		.toLowerCase()
		.split(',');
	/*
	  The same rule for the other profiles with a column of their own: v2 links
	  a teammate's LinkedIn, and an article can link anyone's. The first path
	  segment(s) must be one of the owner's accounts. X's `messages` is the
	  DM-compose link the sites use to reach him.
	*/
	var OWN_ACCOUNTS = {
		'linkedin.com': ['in/mattrltrent', 'in/matthewrltrent'],
		'x.com': ['mattrltrent', 'messages'],
		'twitter.com': ['mattrltrent'],
		'instagram.com': ['mattrltrent', 'matthewrltrent', 'comicalcoder', 'nerds_coding'],
		'stackoverflow.com': ['users/13029516']
	};

	/*
	  The session boundary: 45 minutes with no input from the visitor ends it,
	  wherever that is asked — of a session found in storage on a fresh document
	  and of the one this tab already has. It used to be asked two ways, and the
	  answers disagreed: storage was judged on the last *send*, which the
	  heartbeat pushed forward every 15 seconds, so a session in an open tab
	  actually ran for an hour while the code said thirty minutes.
	*/
	var IDLE_MS = 45 * 60 * 1000;
	/*
	  How long after an input the visit still counts as being read. Time only
	  accumulates inside this window (and only while the page is visible), which
	  is what separates a reader who scrolls every couple of minutes from a tab
	  nobody is in front of any more.
	*/
	var ENGAGED_INPUT_MS = 5 * 60 * 1000;
	/*
	  Before the visitor has done anything, though, the only evidence the page is
	  being read is that it is on screen — and a tab someone opened and wandered
	  away from looks exactly like one being read. So an arrival buys a minute,
	  and it takes an actual input to buy the five: a reader gets their window by
	  reading (a scroll, a key, a tap), and a visit that never does anything
	  cannot bank more than the minute it was in front of somebody.
	*/
	var ARRIVAL_INPUT_MS = 60 * 1000;

	/* How long after the last input time still counts, which the first input raises. */
	function inputWindow() {
		return s && s.acted ? ENGAGED_INPUT_MS : ARRIVAL_INPUT_MS;
	}
	/*
	  Every counter has a ceiling, and the same one at all three layers (here,
	  the server's `sanitizeSession`, the table's CHECK). A cap is what keeps
	  one impossible session — a tab open all day, a crawler that slipped the
	  agent check paging through everything — from moving a published mean
	  by itself. 45 minutes is the one the tooltip states; 100 pages is one
	  every 27 seconds for all of them, which no reader does and every bot does.
	*/
	var MAX_DURATION_SEC = 2700; // 45 minutes, matching the published tooltip.
	var MAX_PAGEVIEWS = 100;
	var MAX_SCROLL_PX = 200000; // Clamped server side too; see `sanitizeSession`.
	/*
	  Any scroll the visitor makes is engagement, and only scrolls the visitor
	  makes are anything at all. A scroll event also fires when the browser
	  restores a position on reload or back, when a framework navigates, and —
	  on v3 especially — whenever the page glides itself to a heading or out
	  from under an opened panel. None of those is someone reading, and they
	  were moving the depth columns. So a scroll is only read within this long
	  of the visitor's own wheel, touch-move or scrolling key press.
	*/
	var SCROLL_GESTURE_MS = 1000;
	/*
	  The keys that scroll a page. A scroll that follows one is the visitor's,
	  exactly as a wheel turn is; the rest of the keyboard scrolls nothing, so a
	  scroll after it belongs to the site.
	*/
	var SCROLL_KEYS = {
		' ': 1,
		Spacebar: 1,
		PageUp: 1,
		PageDown: 1,
		ArrowUp: 1,
		ArrowDown: 1,
		ArrowLeft: 1,
		ArrowRight: 1,
		Home: 1,
		End: 1
	};
	/*
	  How far a finger has to travel before it is a drag rather than the start of
	  a tap. v3's photos, sphere and map are all dragged without the window
	  scrolling, so on a phone the most engaged thing a visitor can do produced
	  no scroll event and no click — which held phones to a stricter test than
	  desktops, where any mouse press counts.
	*/
	var TOUCH_DRAG_PX = 10;
	/*
	  Five seconds between upserts. It was fifteen, and those fifteen seconds were
	  a window in which only the exit beacon could save a visit — and the exit
	  beacon is the least reliable send there is: closing a private window tears
	  down its network session and cancels it, and mobile browsers drop it on a
	  swipe away. A visitor who scrolled and left inside that window was never
	  recorded at all (reproduced 2026-09-11). Each send is a few hundred bytes.
	*/
	var THROTTLE_MS = 5000;
	/*
	  While the page is in front of someone, the visit is re-sent 5 seconds after
	  it starts and every 15 seconds after that, whether or not anything happens.
	  This is what records the visitor who reads one screen and leaves: they do
	  nothing the other sends react to, so they used to exist only in the exit
	  beacon — and closing a private window or swiping a mobile browser away
	  cancels that beacon. A beat carries time that is still accruing, so it
	  stops as soon as that does — while the tab is hidden, or five minutes
	  after the last input — and it no longer counts as activity itself, which
	  is what used to let a tab nobody was in front of run up the clock.
	*/
	var FIRST_BEAT_MS = 5000;
	var BEAT_MS = 15000;
	/*
	  Suffixed with the definition version, so a session accumulated under the
	  previous rules is abandoned rather than carried into the new series with
	  its old counters.

	  It sat at v6 through definition 7, which was defensible — 7 only added a
	  column — and wrong at 8, which changes what a pageview and a scroll are. It
	  also settles a subtler problem: a tab left open for days runs whatever copy
	  of this file it loaded, so a def-7 tab and a def-8 tab could share one
	  session id through storage and fold counters measured under two different
	  rules into one row, which is stamped with whichever definition wrote it
	  first. Different keys, different sessions, each labelled with the rules
	  that actually measured it.
	*/
	var STORE_KEY = 'evo_session_v8';

	/* ---------------------------------------------------------------- state */

	/*
	  The whole accumulator lives in storage, not just the id. v1 is fourteen
	  separate HTML documents, so a visitor moving between pages there gets a
	  fresh JS context each time; keeping only the id would restart the counters
	  on every navigation and make a five-page visit look like five bounces.

	  localStorage rather than sessionStorage for the same class of reason:
	  sessionStorage is per tab, so two tabs would file two sessions and inflate
	  the denominator under every "share of sessions" column.
	*/
	function now() {
		return Date.now();
	}

	function uuid() {
		try {
			if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
		} catch (e) {
			/* fall through */
		}
		return 'e-' + now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
	}

	/*
	  `inputAt` and `activeMs` live in the session, not in this document's
	  variables, because v1 is fourteen separate documents: the idle rule and the
	  time already banked have to mean the same thing on the page a visitor
	  clicks through to as they did on the one they left. `startedAt` is only
	  ever read to decide which of two sessions minted in the same instant is the
	  older one.
	*/
	function blank(id) {
		return {
			id: id,
			era: ERA,
			startedAt: now(),
			inputAt: now(),
			/* Whether the visitor has done anything yet — see `inputWindow`. */
			acted: 0,
			activeMs: 0,
			lastPath: null,
			pv: 0,
			engaged: 0,
			scroll: 0,
			scrollPx: 0,
			/* The window the deepest homepage scroll happened in; see `depth`. */
			vw: 0,
			vh: 0,
			sc: 0,
			aScroll: 0,
			aScrollPx: 0,
			social: 0,
			blog: 0,
			contact: 0,
			home: 0,
			gh: 0,
			x: 0,
			li: 0,
			ig: 0,
			dc: 0,
			sp: 0,
			resume: 0,
			email: 0,
			form: 0,
			print: 0,
			share: 0,
			/* Definition 12: a series', a thought's, or any share control pressed. */
			shs: 0,
			sht: 0,
			shany: 0,
			/* Definition 12: the share code the visit arrived through. */
			via: null,
			land: null
		};
	}

	/* Every yes/no the session carries, for merging and for "did a flag change". */
	var FLAG_KEYS = [
		'engaged',
		'social',
		'blog',
		'contact',
		'home',
		'gh',
		'x',
		'li',
		'ig',
		'dc',
		'sp',
		'resume',
		'email',
		'form',
		'print',
		'share',
		'shs',
		'sht',
		'shany'
	];

	/*
	  Storage can be absent (private windows, cleared site data, partitioned
	  contexts). The fallback keeps one in-memory session for the page rather
	  than throwing: a visit under those conditions is split across pageviews and
	  reads slightly bouncier than it was, which is a known and small bias, and
	  is how any storage-backed analytics degrades.
	*/
	var memory = null;

	/*
	  A stored session only continues on the site that started it. Two eras can
	  share one origin: matthewtrent.me served v2 and then v3, so a visitor who
	  read v2 there and came back to v3 inside the idle window would otherwise
	  carry v2's session id into v3 — and the server keeps a session's era from
	  its first write, so the v3 visit would be filed as v2.
	*/
	function sameEra(state) {
		return !state.era || state.era === ERA;
	}

	function read() {
		try {
			var raw = window.localStorage.getItem(STORE_KEY);
			if (raw) {
				var parsed = JSON.parse(raw);
				if (parsed && parsed.id && now() - parsed.inputAt < IDLE_MS && sameEra(parsed)) return parsed;
			}
		} catch (e) {
			if (memory && now() - memory.inputAt < IDLE_MS) return memory;
		}
		return blank(uuid());
	}

	var s = null;

	function either(a, b) {
		return a || b ? 1 : 0;
	}

	/*
	  Several tabs share one session, and each holds its own copy in memory.
	  Left alone, whichever tab wrote last would overwrite the others — a page
	  counted in one tab vanishing the moment another one scrolled. So every
	  write first folds in what storage holds for the same session: counters,
	  depths and banked time keep their maximum, flags stay set, the session keeps
	  its earliest start and its latest input. The union is a function of its own
	  because the `storage` listener below needs it against a session that is not
	  this tab's yet.
	*/
	function fold(o) {
		if (o.pv > s.pv) s.pv = o.pv;
		/*
		  The window travels with the depth it measured, so it comes from
		  whichever copy holds the deeper homepage scroll rather than being
		  maximised on its own: a tall window from one tab and a deep scroll from
		  another are not one reading. Taken before `scroll` is folded, while the
		  comparison still says which copy won.
		*/
		if ((o.scroll || 0) > (s.scroll || 0)) {
			s.vw = o.vw || 0;
			s.vh = o.vh || 0;
			s.sc = o.sc || 0;
		}
		if (o.scroll > s.scroll) s.scroll = o.scroll;
		if (o.scrollPx > s.scrollPx) s.scrollPx = o.scrollPx;
		/* Older copies of this file have no article depth: treat absent as 0. */
		if ((o.aScroll || 0) > s.aScroll) s.aScroll = o.aScroll;
		if ((o.aScrollPx || 0) > s.aScrollPx) s.aScrollPx = o.aScrollPx;
		if (o.activeMs > s.activeMs) s.activeMs = o.activeMs;
		s.acted = either(s.acted, o.acted);
		if (o.inputAt > s.inputAt) s.inputAt = o.inputAt;
		if (o.startedAt < s.startedAt) s.startedAt = o.startedAt;
		for (var i = 0; i < FLAG_KEYS.length; i++) {
			s[FLAG_KEYS[i]] = either(s[FLAG_KEYS[i]], o[FLAG_KEYS[i]]);
		}
		/* The landing is set once, by whichever tab counted the first page. */
		if (o.land) s.land = o.land;
		/* So is the code the visit arrived through: the first one stands. */
		if (!s.via && o.via) s.via = o.via;
	}

	function merge() {
		try {
			var raw = window.localStorage.getItem(STORE_KEY);
			if (!raw) return;
			var o = JSON.parse(raw);
			if (!o || o.id !== s.id) return;
			fold(o);
		} catch (e) {
			/* storage unreadable: this tab's copy is all there is */
		}
	}

	function write() {
		accrue();
		merge();
		memory = s;
		try {
			window.localStorage.setItem(STORE_KEY, JSON.stringify(s));
		} catch (e) {
			/* memory already holds it */
		}
	}

	/* ----------------------------------------------------------- collection */

	function path() {
		return window.location.pathname || '/';
	}

	function isHome() {
		var p = path();
		for (var i = 0; i < HOME_PATHS.length; i++) {
			if (p === HOME_PATHS[i].trim()) return true;
		}
		return false;
	}

	/*
	  An article, by the same pattern that decides `readBlog` — one rule, so a
	  page cannot be an article for one column and not for the other. v1 sets no
	  `data-blog` and has no articles, so this is always false there.
	*/
	function isBlog() {
		return !!BLOG_RE && BLOG_RE.test(path());
	}

	function excluded() {
		return Boolean(EXCLUDE_RE && EXCLUDE_RE.test(path())) || muted();
	}

	/*
	  How long the visit has been in front of someone who is still in it.

	  Duration used to be the wall clock from the session's first moment to its
	  last send, and the heartbeat sent every 15 seconds for as long as the tab
	  stayed open, so walking away from a visible page added the whole half hour
	  before the idle cutoff to the visit. What is wanted instead is the time
	  somebody was actually there for, which is the time the page was visible and
	  the visitor had done something within the last few minutes — a reader who
	  scrolls now and then keeps counting, and a tab left on a second monitor
	  stops. Nothing polls for it: the span is closed and reopened by the events
	  that can change either condition, so the spans never overlap and no clock
	  runs between them.
	*/
	var spanFrom = 0;

	function counting() {
		return document.visibilityState === 'visible' && !excluded() && now() - s.inputAt < inputWindow();
	}

	function accrue() {
		if (!s) return;
		if (spanFrom) {
			/* Time after the input window closed is time nobody was there for. */
			var until = s.inputAt + inputWindow();
			if (until > now()) until = now();
			if (until > spanFrom) s.activeMs += until - spanFrom;
			if (s.activeMs > MAX_DURATION_SEC * 1000) s.activeMs = MAX_DURATION_SEC * 1000;
		}
		spanFrom = counting() ? now() : 0;
	}

	/*
	  Input both closes the span the last one paid for and starts time counting
	  again, because it may have stopped five silent minutes ago.
	*/
	function touch() {
		if (excluded()) return;
		accrue();
		s.inputAt = now();
		if (!spanFrom && document.visibilityState === 'visible') spanFrom = now();
	}

	/*
	  The share code this document arrived with (v3 only: its boot script sets
	  the attribute before this file runs). Read once per document, so a session
	  this tab starts later, after an idle, is not filed under it too.
	*/
	var viaNoted = false;
	function arrivedVia() {
		try {
			var code = document.documentElement.getAttribute('data-share-via');
			return code && /^[A-Za-z0-9]{8}$/.test(code) ? code : null;
		} catch (e) {
			return null;
		}
	}

	function countPageview() {
		if (excluded()) return;
		merge();
		if (!viaNoted) {
			viaNoted = true;
			var via = arrivedVia();
			if (via && !s.via) s.via = via;
		}
		/* The first page of the visit: the homepage, an article, or anything else. */
		if (s.pv === 0 && !s.land) s.land = isHome() ? 'home' : BLOG_RE && BLOG_RE.test(path()) ? 'blog' : 'other';
		if (s.pv < MAX_PAGEVIEWS) s.pv += 1;
		s.lastPath = path();
		touch();
		/* Opening the résumé page counts however it was reached (typed, bookmarked). */
		if (RESUME_PAGE_RE ? RESUME_PAGE_RE.test(path()) : isResume(path())) s.resume = 1;
		/*
		  Whether this visit ever opened the homepage. Scroll depth is a question
		  about the homepage, so a visit that never saw it has no answer — it is
		  left out of that column rather than counted as having scrolled 0%.
		*/
		if (isHome()) s.home = 1;
		if (BLOG_RE && BLOG_RE.test(path())) s.blog = 1;
		write();
	}

	/*
	  Whether a page is the one the session last counted, the single question
	  behind three rules: a history call is only a pageview when the *path*
	  changed, a reload is the page again rather than another one, and joining a
	  session another tab started still counts the page this tab is on.

	  The path-change rule is the bug that made v3's bounce rate read 0%:
	  SvelteKit stamps its own state onto the landing entry with a `replaceState`
	  about a second after load, the blog's filters and search rewrite the query
	  string with more, and the article scroll-spy rewrites the hash on every
	  heading — and every one of those was being counted as a page. A visitor who
	  landed on `/` and did nothing arrived with two pageviews, which no
	  definition of bounce can include.

	  In the session rather than in this document's variables, because two of the
	  three questions are asked across documents.
	*/
	function countedHere() {
		return s.lastPath === path();
	}

	/*
	  A reload is the same page a second time, and it is how a visitor who cannot
	  see what they came for leaves. Counting it as a second pageview meant
	  anyone who reloaded and gave up could not be a bounce — the single
	  strongest signal the site is not working read as the opposite. The
	  navigation entry is absent in old browsers and in some embedded webviews,
	  where this simply stays off.
	*/
	function reloaded() {
		try {
			var entries = window.performance && window.performance.getEntriesByType('navigation');
			return Boolean(entries && entries[0] && entries[0].type === 'reload');
		} catch (e) {
			return false;
		}
	}

	/*
	  Idle means no input from the visitor. Nothing this file does on its own —
	  a heartbeat, an exit beacon, a scroll the site performed — is input, which
	  is the whole reason the boundary is measured from `inputAt` and never from
	  a send.
	*/
	function idle() {
		return now() - s.inputAt >= IDLE_MS;
	}

	/*
	  The idle boundary applies inside an open tab too. `read()` only runs when a
	  document loads, so a tab left for an afternoon and picked up again used to
	  carry the old session on — its duration pinned at the cap and the second
	  visit never counted. Input after the boundary starts a new session (or
	  joins the one another tab already started), and the page in front of the
	  visitor is a pageview of that session unless it is the page the session
	  last counted. Returns true when it counted one.
	*/
	function renew() {
		if (!s) return false;
		if (!idle()) {
			touch();
			return false;
		}
		s = read();
		spanFrom = 0;
		lastSentAt = 0;
		touch();
		if (countedHere()) return false;
		countPageview();
		return true;
	}

	/*
	  What decides a published yes/no — engaged, another page, a social or a
	  contact — goes out at once instead of waiting out the throttle. Each can
	  only happen a handful of times a visit, and they are exactly what a
	  visitor who leaves in the next few seconds must not lose: an engaged
	  visit saved without its engagement is filed as a bounce. Only the running
	  maxima (depth, time) are throttled.
	*/
	function countPageviewIfMoved() {
		if (excluded()) return;
		if (renew()) {
			flush(false);
			return;
		}
		if (countedHere()) return;
		countPageview();
		flush(false);
	}

	function markEngaged() {
		if (excluded()) return;
		/* The first input is what raises the time window; see `inputWindow`. */
		s.acted = 1;
		if (s.engaged) return;
		s.engaged = 1;
		touch();
		flush(false);
	}

	function flags() {
		var out = '';
		for (var i = 0; i < FLAG_KEYS.length; i++) out += s[FLAG_KEYS[i]] ? 1 : 0;
		return out;
	}

	/*
	  How far down the current page the viewport's top edge is, as a share of
	  what can be scrolled and in CSS pixels.
	*/
	function depth() {
		var doc = document.documentElement;
		var body = document.body;
		var height = Math.max(doc.scrollHeight, body ? body.scrollHeight : 0);
		var viewport = window.innerHeight || doc.clientHeight || 0;
		var scrollable = height - viewport;
		var top = window.pageYOffset || doc.scrollTop || 0;
		var pct = scrollable <= 0 ? 100 : Math.round((top / scrollable) * 100);
		if (pct < 0) pct = 0;
		if (pct > 100) pct = 100;
		var px = Math.round(top);
		if (px < 0) px = 0;
		if (px > MAX_SCROLL_PX) px = MAX_SCROLL_PX;
		if (scrollable < 0) scrollable = 0;
		if (scrollable > MAX_SCROLL_PX) scrollable = MAX_SCROLL_PX;
		/*
		  `vw`/`vh`/`scrollable` travel with the reading, not with the load. The
		  percentage above divides by `scrollable`, which is a property of this
		  window rather than of the page — and the three sites answer a phone very
		  differently, v1 being 2.5x its desktop height where v3 is 1.1x. Sent
		  alongside the depth so a share can be rebuilt against a common height
		  instead of being compared across whatever devices each era happened to
		  get. Measured here rather than at load because every one of these pages
		  is one viewport tall for its first half second.
		*/
		return {
			pct: pct,
			px: px,
			vw: Math.round(window.innerWidth || doc.clientWidth || 0),
			vh: Math.round(viewport),
			scrollable: Math.round(scrollable)
		};
	}

	/*
	  When the visitor last did one of the things that scroll a page: turned a
	  wheel, moved a touch, pressed a scrolling key. Only recorded here: a
	  gesture that scrolls nothing (a page too short to scroll, a wheel at the
	  top) is not engagement, so it is the scroll that follows that counts.
	*/
	var lastGestureAt = -Infinity;

	function onGesture() {
		lastGestureAt = now();
	}

	/*
	  How long a finger's scroll keeps coasting after it lifts.

	  `touchmove` stops the instant the finger leaves the glass, but iOS carries
	  the page for a second or three more, and that coast is usually the larger
	  half of a fling. Sampled only inside the wheel-sized window, a fling to
	  15,000px recorded 5,000 and the rest of someone's reading was filed as
	  scrolling the site did to itself.
	*/
	var TOUCH_COAST_MS = 3000;
	var coastUntil = 0;

	function onCoast() {
		coastUntil = now() + TOUCH_COAST_MS;
	}

	/*
	  Engagement from scrolling counts on every page: someone who reads an
	  article to the end without clicking has not bounced. Depth, though, is
	  recorded on the homepage only, as a running maximum — averaged across a
	  whole site it would mostly measure how long each page is, and the column
	  asks how far into the front page people get.

	  A scroll nobody asked for is not a reading, so it is not read at all — and
	  it must not keep a session alive either: v3 glides the page itself after a
	  hash landing and whenever MattGPT opens or closes, and an untouched tab
	  doing that on a timer would have kept renewing and could even have minted a
	  session with nobody in it.
	*/
	function sampleScroll() {
		if (excluded()) return;
		if (now() - lastGestureAt >= SCROLL_GESTURE_MS && now() >= coastUntil) return;
		if (renew()) flush(false);
		markEngaged();
		var d = depth();
		var moved = false;
		if (isHome()) {
			if (d.pct > s.scroll) {
				s.scroll = d.pct;
				moved = true;
				/*
				  Pinned to the deepest reading rather than the latest one: these
				  three describe the window that produced `scroll`, so they have to
				  move with it or they describe a different measurement. A visitor
				  who resizes mid-visit keeps the window their deepest scroll
				  happened in.
				*/
				s.vw = d.vw;
				s.vh = d.vh;
				s.sc = d.scrollable;
			}
			/*
			  The same high-water mark in CSS pixels. The percentage says how much of
			  the page was seen; this says how much scrolling that took, which is
			  what lets a short page and a long one be compared on the same row.
			*/
			if (d.px > s.scrollPx) {
				s.scrollPx = d.px;
				moved = true;
			}
		} else if (isBlog()) {
			/*
			  The same pair for the writing, kept apart from the homepage's rather
			  than folded in with it: one is how far down a front page people get,
			  the other how far into a piece they read, and an average over both
			  would answer neither. A visit that opens two articles keeps the
			  deeper of them — this is one row per session, not per article.
			*/
			if (d.pct > s.aScroll) {
				s.aScroll = d.pct;
				moved = true;
			}
			if (d.px > s.aScrollPx) {
				s.aScrollPx = d.px;
				moved = true;
			}
		}
		/*
		  Reading is time even when no depth moved, and it should reach the server
		  while it happens rather than only in the exit beacon. The `pending`
		  guard spares a storage write on every scroll event.
		*/
		if (moved || !pending) queue();
	}

	function hostOf(href) {
		try {
			return new URL(href, window.location.origin).hostname.replace(/^www\./, '');
		} catch (e) {
			return '';
		}
	}

	/*
	  Which of the owner's socials a link opens: the per-profile flag it sets
	  ('gh', 'x', …), 'other' for an owner social with no column of its own
	  (Stack Overflow, YouTube), or null when it is not one of his.
	*/
	function socialOf(href) {
		if (!href) return null;
		if (href.slice(0, 7).toLowerCase() === 'mailto:') return null;
		var host = hostOf(href);
		if (!host) return null;
		var pathname = '';
		try {
			pathname = new URL(href, window.location.origin).pathname;
		} catch (e) {
			return null;
		}
		for (var i = 0; i < SOCIAL_HOSTS.length; i++) {
			var candidate = SOCIAL_HOSTS[i].trim();
			if (!candidate || (host !== candidate && host.slice(-(candidate.length + 1)) !== '.' + candidate)) continue;
			var segments = pathname.toLowerCase().split('/');
			if (candidate === 'github.com' && GITHUB_ACCOUNTS.indexOf(segments[1] || '') === -1) return null;
			if ((candidate === 'discord.com' || candidate === 'discord.gg') && segments[1] === 'api') return null;
			var own = OWN_ACCOUNTS[candidate];
			if (own) {
				var one = segments[1] || '';
				var two = one + '/' + (segments[2] || '');
				if (own.indexOf(one) === -1 && own.indexOf(two) === -1) return null;
			}
			return NETWORKS[candidate] || 'other';
		}
		return null;
	}

	/*
	  Every way the three sites serve the résumé: v1's /resume/ directory, its
	  /resume/resume.html viewer, /old_resume/ and /assets/resume.pdf; v2's
	  /resume (a redirect to /resume.pdf) and the PDF itself; v3's /resume.
	  Only on this site: someone else's /resume is not his.
	*/
	var RESUME_PATH_RE = /(^|\/)(old_)?resume\d*(\.pdf|\.html)?(\/|$)/i;

	function isResume(href) {
		if (!href) return false;
		var u;
		try {
			u = new URL(href, window.location.href);
		} catch (e) {
			return false;
		}
		return u.host === window.location.host && RESUME_PATH_RE.test(u.pathname);
	}

	/*
	  One judge for every signal, whether it came off an element or from script:
	  a named action, or a URL judged like a link — a mailto is the email, the
	  owner's profiles are socials, and the résumé is its own thing. `contact`
	  is kept as the any-of-the-three flag the older columns read.
	*/
	var ACTIONS = { email: 'email', contact: 'email', form: 'form', print: 'print', resume: 'resume' };

	/*
	  The one address that is contact: the one he has always used. A mailto to
	  any other (v1's old work address, a university address) is not a way of
	  reaching him here, so it counts as nothing. A named 'email' signal from
	  script is always about this address.
	*/
	var CONTACT_EMAIL = attr('email', 'me@matthewtrent.me').toLowerCase();

	function isContactMailto(href) {
		if (href.slice(0, 7).toLowerCase() !== 'mailto:') return false;
		var to = href.slice(7).split('?')[0].split(',');
		for (var i = 0; i < to.length; i++) {
			var address = to[i];
			try {
				address = decodeURIComponent(address);
			} catch (e) {
				/* keep it as written */
			}
			if (address.replace(/^\s+|\s+$/g, '').toLowerCase() === CONTACT_EMAIL) return true;
		}
		return false;
	}

	function note(signal) {
		if (!signal || typeof signal !== 'string') return;
		/* Copying an article's link to pass on: not contact, not a profile. */
		if (signal === 'share') {
			s.share = 1;
			s.shany = 1;
			return;
		}
		/* Definition 12: every other share control v3 has (series, thought, a heading's link). */
		if (signal.slice(0, 6) === 'share-') {
			if (signal === 'share-series') s.shs = 1;
			if (signal === 'share-thought') s.sht = 1;
			s.shany = 1;
			return;
		}
		if (signal.slice(0, 7).toLowerCase() === 'mailto:' && !isContactMailto(signal)) return;
		var action = Object.prototype.hasOwnProperty.call(ACTIONS, signal)
			? ACTIONS[signal]
			: isContactMailto(signal)
				? 'email'
				: null;
		if (action) {
			s[action] = 1;
			if (action !== 'resume') s.contact = 1;
			return;
		}
		if (signal === 'social') {
			s.social = 1;
			return;
		}
		if (isResume(signal)) {
			s.resume = 1;
			return;
		}
		var network = socialOf(signal);
		if (!network) return;
		s.social = 1;
		if (network !== 'other') s[network] = 1;
	}

	function onClick(event) {
		/*
		  A click is a gesture, because a click can be a scroll.

		  v1's homepage is navigated by a floating down-arrow that calls
		  `scrollTo({behavior:'smooth'})`, v2 has the same control plus a
		  smooth-scrolling table of contents, and neither produces a wheel or a
		  touchmove. Requiring one of those meant that on the two sites whose
		  primary way down the page is a button, the page travelling was filed as
		  the site scrolling itself: 53% of v1's homepage visits recorded zero
		  scroll against 16% of v3's, which reads as a design difference and is a
		  listener difference.

		  A glide the visitor did not ask for still does not count — those happen
		  on load (a hash landing) or on a panel opening, with no press behind
		  them, and the window here is a second wide.
		*/
		onGesture();
		if (excluded()) return;
		renew();
		markEngaged();
		var before = flags();
		var node = event.target;
		/*
		  Walk up: the clickable thing is routinely a span inside the anchor, and
		  the `data-evo` hook is placed on whichever element owns the behaviour.
		  The hook is the escape hatch for surfaces no generic rule can see — a
		  contact form that posts with fetch, a button that navigates by script.
		*/
		for (var hops = 0; node && hops < 6; hops++, node = node.parentElement) {
			if (!node.getAttribute) continue;
			var hook = node.getAttribute('data-evo');
			if (hook) note(hook);
			note(node.getAttribute('href'));
		}
		touch();
		if (flags() !== before) flush(false);
		else queue();
	}

	/*
	  The same hook from script, for actions no element on the page owns: a
	  keyboard shortcut that opens the résumé, an assistant that copies the
	  address or opens a profile in a new tab.
	*/
	function onMark(event) {
		if (excluded()) return;
		renew();
		markEngaged();
		var before = flags();
		note(event && event.detail);
		touch();
		if (flags() !== before) flush(false);
		else queue();
	}

	/*
	  A key press is engagement, except a browser shortcut or a lone modifier:
	  Cmd/Ctrl-W, Cmd-L and Cmd-Tab are how people leave, and a leaving visitor
	  presses them as often as a reading one.
	*/
	var MODIFIER_KEYS = { Meta: 1, Control: 1, Alt: 1, Shift: 1, CapsLock: 1, OS: 1, Fn: 1 };
	/*
	  Nor are the keys that do not address the page. Escape dismisses whatever
	  the site put in the way, Tab is pressed on the way past to somewhere else,
	  and the function, lock, print-screen and media keys are the keyboard's own
	  furniture — someone changing the volume of a video in another window is not
	  reading this one.
	*/
	var IGNORED_KEYS = { Escape: 1, Esc: 1, Tab: 1, PrintScreen: 1, ScrollLock: 1, Pause: 1, NumLock: 1, ContextMenu: 1 };
	var IGNORED_KEY_RE = /^(F\d{1,2}|Media\w*|Audio\w*|Launch\w*|Browser\w*)$/;

	function onKey(event) {
		var key = event.key;
		/*
		  Ctrl+End and Cmd+Down are how a keyboard jumps to the bottom of a page,
		  and both were dropped by the modifier check one line below before the
		  scroll-key check could see them. The scroll that followed then had no
		  gesture behind it and was read as the site's own, so a visitor who
		  jumped to the end of an article recorded no depth, no engagement, and
		  landed in the bounce column.
		*/
		if (SCROLL_KEYS[key]) onGesture();
		if (event.metaKey || event.ctrlKey || event.altKey || MODIFIER_KEYS[key]) return;
		if (IGNORED_KEYS[key] || IGNORED_KEY_RE.test(key || '')) return;
		if (excluded()) return;
		renew();
		markEngaged();
	}

	/*
	  A mouse press is engagement, except the right button: a right-click opens
	  the browser's own menu, and it is as often the first half of "copy image
	  address" or a misfired trackpad as it is someone doing something here.

	  A touch-down on its own is not engagement either: it is how every scroll on
	  a phone begins, so counting it made a one-flick visit engaged and held
	  phones to a looser definition than desktops. A tap still counts, through
	  `click`, a swipe through the scroll floor as a wheel does, and a drag
	  through `onTouchMove` below.
	*/
	function onPointer(event) {
		if (event.button === 2) return;
		if (event.pointerType && event.pointerType !== 'mouse') return;
		if (excluded()) return;
		renew();
		markEngaged();
	}

	/*
	  Where the finger went down, so the move that follows can be told from the
	  wobble inside a tap.
	*/
	var touchFrom = null;

	function onTouchStart(event) {
		var t = event.touches && event.touches[0];
		touchFrom = t ? { x: t.clientX, y: t.clientY } : null;
	}

	/*
	  A finger that travels is someone doing something, whether or not the window
	  scrolled: on v3 the photos, the sphere and the map all move under the
	  finger while the page stays where it is, so the most deliberate thing a
	  phone visitor can do left no trace at all.
	*/
	function onTouchMove(event) {
		onGesture();
		var t = touchFrom && event.touches && event.touches[0];
		if (!t) return;
		var dx = t.clientX - touchFrom.x;
		var dy = t.clientY - touchFrom.y;
		if (dx * dx + dy * dy < TOUCH_DRAG_PX * TOUCH_DRAG_PX) return;
		/* One drag is one answer; the rest of its moves have nothing left to say. */
		touchFrom = null;
		if (excluded()) return;
		renew();
		markEngaged();
	}

	/* -------------------------------------------------------------- sending */

	/*
	  The site's own first-party visitor id, when the site that mounted this
	  script sets one. All three do now: v3 from its server, and since 2026-09-19
	  v1 and v2 from their edge middleware, each on its own origin under the same
	  cookie name and id shape. Before that the archives carried none at all —
	  the cookie lives on the site the visitor is actually on, and these posts are
	  cross-origin without credentials — so no v1 or v2 session could be counted
	  as a person rather than a visit, and the owner's own testing on them could
	  not be identified after the fact.

	  On v3 it is the same id the PostHog SDK is identified with, which is what
	  lets a session in /admin be opened as a person and not only as a replay.
	  Read on every send rather than once: the cookie is minted by the first
	  server response and can be absent for the very first flush.
	*/
	function visitorId() {
		try {
			var m = document.cookie.match(/(?:^|; )analytics_visitor_id=([^;]*)/);
			if (!m) return null;
			var v = decodeURIComponent(m[1]);
			return /^[A-Za-z0-9_-]{8,64}$/.test(v) ? v : null;
		} catch (e) {
			return null;
		}
	}

	/*
	  Mobile, tablet, desktop or unknown — decided here rather than from the
	  request's user agent on the server, because only the browser can tell an
	  iPad from a Mac: iPadOS Safari sends a Mac user agent by default, and the
	  touch points are the difference. User-Agent Client Hints answer "is this a
	  phone" outright where they exist (Chromium); the user agent string decides
	  the rest. A width is deliberately not used: a narrow desktop window is not
	  a phone. Read once; a visit does not change device.
	*/
	var DEVICE = (function () {
		try {
			var ua = navigator.userAgent || '';
			var touch = navigator.maxTouchPoints || 0;
			if (/iPad|PlayBook|Silk|Kindle|\bKF[A-Z]{2,4}\b|\bTablet(?! PC)/.test(ua)) return 'tablet';
			if (/Macintosh/.test(ua) && touch > 1) return 'tablet';
			if (/Android/i.test(ua)) return /Mobile/i.test(ua) ? 'mobile' : 'tablet';
			var hints = navigator.userAgentData;
			if (hints && typeof hints.mobile === 'boolean' && hints.mobile) return 'mobile';
			if (/iPhone|iPod|Mobi|Windows Phone|IEMobile|BlackBerry|Opera Mini/i.test(ua)) return 'mobile';
			if (/Windows NT|Macintosh|Mac OS X|CrOS|X11|Linux/i.test(ua)) return 'desktop';
			return 'unknown';
		} catch (e) {
			return 'unknown';
		}
	})();

	function payload() {
		/* Engaged-visible time, not wall clock: see `accrue`. */
		var duration = Math.round(s.activeMs / 1000);
		if (duration < 0) duration = 0;
		if (duration > MAX_DURATION_SEC) duration = MAX_DURATION_SEC;

		var ph = null;
		try {
			// Opportunistic only. PostHog is lazy-loaded and absent on v1/v2, so a
			// row must never wait on it — see the migration's note.
			if (window.posthog && window.posthog.get_session_id) ph = window.posthog.get_session_id();
		} catch (e) {
			ph = null;
		}

		return JSON.stringify({
			sid: s.id,
			era: ERA,
			version: VERSION,
			def: DEFINITION,
			pageviews: s.pv,
			durationSec: duration,
			maxScrollPct: s.scroll,
			maxScrollPx: s.scrollPx || 0,
			articleScrollPct: s.aScroll || 0,
			articleScrollPx: s.aScrollPx || 0,
			/* The window `maxScrollPct` was measured in; see `depth`. */
			viewportW: s.vw || 0,
			viewportH: s.vh || 0,
			scrollablePx: s.sc || 0,
			/* Mobile, tablet, desktop or unknown; see `DEVICE`. */
			device: DEVICE,
			sawHome: s.home,
			engaged: s.engaged,
			clickedSocial: s.social,
			readBlog: s.blog,
			contacted: s.contact,
			github: s.gh,
			x: s.x,
			linkedin: s.li,
			instagram: s.ig,
			discord: s.dc,
			spotify: s.sp,
			resume: s.resume,
			email: s.email,
			contactForm: s.form,
			print: s.print,
			sharedArticle: s.share,
			sharedSeries: s.shs || 0,
			sharedThought: s.sht || 0,
			sharedAny: s.shany || 0,
			via: s.via || null,
			landing: s.land,
			phSession: ph,
			vid: visitorId()
		});
	}

	/*
	  `text/plain` keeps this a CORS "simple request", so v1 and v2 posting to
	  v3's origin never trigger a preflight. sendBeacon cannot set headers anyway,
	  and a preflight that fails during unload would lose the flush.
	*/
	function send(useBeacon) {
		var body = payload();
		try {
			/*
			  A beacon can be refused outright — the browser's queue for the page is
			  full, or the body is over its limit — and it says so by returning false
			  rather than by throwing. That was read as "sent", so the visit was lost
			  at the one moment it could not be re-sent. A refusal falls through to
			  the keepalive fetch, which is the same request by another route.
			*/
			if (useBeacon && navigator.sendBeacon) {
				if (navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain;charset=UTF-8' }))) return;
			}
			fetch(ENDPOINT, {
				method: 'POST',
				body: body,
				headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
				keepalive: true,
				mode: 'cors',
				credentials: 'omit'
			}).catch(function () {});
		} catch (e) {
			/* analytics must never break the page */
		}
	}

	/*
	  Progressive upserts, not one write at the end.

	  A single send on unload loses every session whose beacon drops, and beacons
	  drop most on mobile. Because the server keeps the high-water mark per
	  session id, re-sending the whole snapshot is idempotent: a lost flush costs
	  a few seconds of duration rather than the session.
	*/
	var lastSentAt = 0;
	var pending = null;

	function flush(useBeacon) {
		if (pending) {
			clearTimeout(pending);
			pending = null;
		}
		/*
		  Nothing changed while the reader was on an excluded path, so there is
		  nothing to upsert — and a send from there would file the row with the
		  console's own visibilitychange and pagehide. The progressive upserts
		  before the detour already carry the session.
		*/
		if (excluded()) return;
		lastSentAt = now();
		write();
		send(useBeacon);
	}

	function queue() {
		if (excluded()) return;
		write();
		if (pending) return;
		var wait = Math.max(0, THROTTLE_MS - (now() - lastSentAt));
		pending = setTimeout(function () {
			pending = null;
			flush(false);
		}, wait);
	}

	/*
	  A session that has gone its idle minutes without input is over, so leaving
	  it later is not activity and there is nothing left to say about it: a tab
	  left open all afternoon and closed at night used to bank the whole
	  afternoon. A visitor who comes back to that tab gets a new session from
	  `renew`, not a resurrection of this one.
	*/
	function stale() {
		return idle();
	}

	/*
	  A beat is a re-send, never an event of its own. It used to call `touch`,
	  which is what let a visible tab bank the half hour to the idle cutoff and
	  what stretched the session boundary to an hour.
	*/
	function beat() {
		if (counting()) queue();
		setTimeout(beat, BEAT_MS);
	}

	/*
	  Coming back to a tab is the visit resuming — and it may be resuming a visit
	  that ended while nobody was looking. Past the idle cutoff the beat has
	  stopped and both exit handlers have nothing left to send, so a tab put aside
	  in the morning, read for ten minutes in the afternoon and closed recorded
	  none of the afternoon: the reader who never clicks is exactly the reader
	  this misses. Being shown renews the session, counts the page in front of
	  the visitor when it is not the one the session last counted, and starts the
	  clock again.
	*/
	function shown() {
		if (excluded()) return;
		/*
		  Being shown is not something the visitor did to the page.

		  `renew()` touches, and touching is what re-arms the time window, so
		  every hide-and-show bought another minute of "reading" and pushed the
		  idle boundary out — a tab nobody ever touched, cycled by an OS for an
		  hour, banked several minutes and never expired. The published column
		  says "time a visit spent with the page in front of someone and still
		  reading", and that was neither.

		  A renewed session is the exception: it is a fresh arrival and gets an
		  arrival's allowance. Otherwise the window stays where the visitor's own
		  last input left it, and `accrue()` re-settles the span against it — so
		  coming back to a tab counts once the visitor does something, and not
		  before.
		*/
		var lastInputAt = s ? s.inputAt : 0;
		if (renew()) {
			flush(false);
			return;
		}
		s.inputAt = lastInputAt;
		accrue();
		queue();
	}

	/*
	  SPA route changes are pageviews too. v2 and v3 both navigate without a
	  document load, so without this a five-page visit on either would count as
	  one pageview and read as a bounce. Only a changed path counts — see
	  `countPageviewIfMoved` for the frameworks' own history writes that do not.
	*/
	function patch(name) {
		var original = history[name];
		if (typeof original !== 'function') return;
		history[name] = function () {
			var result = original.apply(this, arguments);
			countPageviewIfMoved();
			return result;
		};
	}

	function start() {
		s = read();
		/* Arriving here is the visitor's doing, and it is where their clock starts. */
		touch();
		if (!reloaded() || !countedHere()) countPageview();
		flush(false);
		/*
		  The boot send does not start the throttle clock. On its own it carries
		  nothing the server keeps — one pageview and no signal is a probe — so
		  the first thing the visitor actually does goes out at once instead of
		  waiting out the throttle behind a send that was discarded.
		*/
		lastSentAt = 0;
		setTimeout(beat, FIRST_BEAT_MS);

		document.addEventListener('click', onClick, true);
		/*
		  A middle-click opens a link in a new tab and fires `auxclick`, not
		  `click`. Only the middle button: a right-click also fires it, and
		  opening a context menu is not following the link.
		*/
		document.addEventListener(
			'auxclick',
			function (event) {
				if (event.button === 1) onClick(event);
			},
			true
		);
		document.addEventListener('evo:mark', onMark);
		document.addEventListener('keydown', onKey, { passive: true });
		document.addEventListener('pointerdown', onPointer, { passive: true });
		/*
		  Passive, and on the document: a non-passive wheel or touch listener on
		  a page is what leaves Safari unable to scroll it.
		*/
		document.addEventListener('wheel', onGesture, { passive: true, capture: true });
		document.addEventListener('touchstart', onTouchStart, { passive: true, capture: true });
		document.addEventListener('touchmove', onTouchMove, { passive: true, capture: true });
		/* The coast after the finger lifts is still the visitor's scroll. */
		document.addEventListener('touchend', onCoast, { passive: true, capture: true });
		document.addEventListener('touchcancel', onCoast, { passive: true, capture: true });
		window.addEventListener('scroll', sampleScroll, { passive: true });

		/*
		  Two tabs opened in the same instant both read an empty store and both
		  mint an id: localStorage reaches another process a moment later, not at
		  once, so neither can see the other in time. The `storage` event is that
		  moment arriving. The tab whose session started later gives up its id and
		  folds what it has into the older one, which is the one every other tab
		  will also settle on. It happens within milliseconds of load, so all the
		  abandoned id can have sent is its boot snapshot: a pageview and nothing
		  else, which the server discards as a probe unless the tab landed on an
		  article, where a single thin row is left behind. Two whole sessions were
		  being filed before, which is the worse of the two by far — every tab a
		  visitor opens at once was inflating the denominator under every "share
		  of sessions" column.
		*/
		window.addEventListener('storage', function (event) {
			if (event.key && event.key !== STORE_KEY) return;
			if (!event.newValue || !s) return;
			try {
				var o = JSON.parse(event.newValue);
				if (!o || !o.id || o.id === s.id) return;
				/* An era never joins another's session, for the reason `sameEra` exists. */
				if (!sameEra(o) || now() - o.inputAt >= IDLE_MS) return;
				/*
				  The ids decide when both started in the same millisecond, which is
				  the usual case for the tabs this is about. Any rule would do as long
				  as every tab applies the same one and ends up on the same id.
				*/
				if (o.startedAt > s.startedAt) return;
				if (o.startedAt === s.startedAt && o.id > s.id) return;
				s.id = o.id;
				fold(o);
				lastSentAt = 0;
				queue();
			} catch (e) {
				/* another origin's key, or half a write: nothing to join */
			}
		});

		/*
		  `visibilitychange` first: it is the one that actually fires on mobile and
		  through the back/forward cache. `pagehide` backs it up. `beforeunload` is
		  deliberately not here — unreliable on mobile, and registering it disables
		  bfcache for everyone.

		  Both are sends, not activity. Leaving does not extend a visit any more,
		  because the time it would have extended is now counted as it is spent:
		  the visitor who read the first screen for a minute and left has that
		  minute banked already, without the exit having to claim it.
		*/
		document.addEventListener('visibilitychange', function () {
			if (document.visibilityState === 'visible') {
				shown();
				return;
			}
			if (document.visibilityState !== 'hidden' || stale()) return;
			flush(true);
		});
		window.addEventListener('pagehide', function () {
			if (stale()) return;
			flush(true);
		});

		/*
		  A page restored from the back/forward cache is a page seen again. On a
		  site of separate documents (v1) that is how most back-button views
		  arrive — they never load — so they went uncounted while the same view
		  on v2 or v3, a popstate, was counted.

		  `countedHere()` is the part this was missing, and it is the same guard
		  every other pageview path uses. A restore only counts when it lands
		  somewhere other than the page the session last counted — which is what
		  a back button does and what an app switch does not. Without it, every
		  time iOS froze a tab into the bfcache and handed it back, the same page
		  counted again: one v1 visit recorded ten pageviews in twenty seconds
		  with nothing clicked, and `pages` is published as a mean, so that one
		  visit moved a whole era's number.
		*/
		window.addEventListener('pageshow', function (event) {
			if (!event.persisted || excluded()) return;
			if (!renew() && !countedHere()) countPageview();
			flush(false);
		});

		patch('pushState');
		patch('replaceState');
		window.addEventListener('popstate', countPageviewIfMoved);
	}

	/*
	  A page nobody has looked at yet is not a pageview and has no time in it.

	  A prerendered page — speculation rules, or the browser guessing from the
	  address bar where you are about to go — runs its scripts before anyone has
	  asked for it, and may never be shown. A tab opened behind the one being
	  read, with a middle click or "open link in new tab", is the same situation
	  reached a different way, and it was the more expensive one: it loaded
	  hidden, counted its page immediately and started its clock, so a tab opened
	  at breakfast and read at noon arrived with the morning banked against it.

	  Either way the session starts on the first `visible`, and a tab closed
	  without ever being shown records nothing, which is what it was.
	*/
	function whenShown(fn) {
		/* A browser too old to have the state has no background tabs worth waiting on. */
		if (!document.visibilityState || document.visibilityState === 'visible') {
			fn();
			return;
		}
		var onShow = function () {
			if (document.visibilityState !== 'visible') return;
			document.removeEventListener('visibilitychange', onShow);
			fn();
		};
		document.addEventListener('visibilitychange', onShow);
	}

	if (document.prerendering) {
		document.addEventListener(
			'prerenderingchange',
			function () {
				whenShown(start);
			},
			{ once: true }
		);
	} else {
		whenShown(start);
	}
})();
