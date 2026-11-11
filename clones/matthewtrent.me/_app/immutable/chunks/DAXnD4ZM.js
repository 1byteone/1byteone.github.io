const t=`<script lang="ts">
	import { faviconProxyPath } from '$lib/media/favicons';
	import { onMount, tick, untrack } from 'svelte';
	import { runHashLanding } from '$lib/scroll/hash-landing';
	import { browser } from '$app/environment';
	import { pointerFineHoverEnabled } from '$lib/interaction/effects';
	import { createSwapStepper, glyphRoll } from '$lib/motion/glyph-roll';
	import { animateGridTrack } from '$lib/motion/animate-track';
	import { DURATION } from '$lib/motion/scale';
	import Ed3BylineName from '$lib/components/home/Ed3BylineName.svelte';
	import ArticleToc from '$lib/components/shared/ArticleToc.svelte';
	import type { MarkdownHeading } from '$lib/markdown/heading-anchors';
	import Ed3AccordionList, {
		type Ed3AccordionEntry
	} from '$lib/components/shared/Ed3AccordionList.svelte';
	import Ed3ExperienceBoard from '$lib/components/home/Ed3ExperienceBoard.svelte';
	import Ed3IndexList, {
		type Ed3IndexEntry,
		type Ed3IndexMark
	} from '$lib/components/shared/Ed3IndexList.svelte';
	import Ed3AsAKidSphere from '$lib/components/home/Ed3AsAKidSphere.svelte';
	import Ed3ReceiptSection from '$lib/components/home/Ed3ReceiptSection.svelte';
	import Ed3DisclosureReply from '$lib/components/home/Ed3DisclosureReply.svelte';
	import Ed3TicketRevealSection from '$lib/components/home/Ed3TicketRevealSection.svelte';
	import Ed3Footer from '$lib/components/shared/Ed3Footer.svelte';
	// TEMPORARILY OFF — the "Who You Are" LGBM predictor row in Misc. is commented
	// out below; uncomment both together to bring it back.
	// import VisitorPredictor from '$lib/components/home/VisitorPredictor.svelte';
	import Ed3FrameRails from '$lib/components/shared/Ed3FrameRails.svelte';
	import Ed3ProjectWorkGrid, {
		type WorkEntry
	} from '$lib/components/home/Ed3ProjectWorkGrid.svelte';
	import Ed3SkillsGrid, { type Ed3SkillEntry } from '$lib/components/home/Ed3SkillsGrid.svelte';
	import DitherImage from '$lib/components/shared/DitherImage.svelte';
	import Ed3PortfolioEvolution from '$lib/components/home/Ed3PortfolioEvolution.svelte';
	import Ed3Recommendations from '$lib/components/home/Ed3Recommendations.svelte';
	import Ed3HomeSection from '$lib/components/home/Ed3HomeSection.svelte';
	import Ed3SectionTabs from '$lib/components/home/Ed3SectionTabs.svelte';
	import Ed3ClassesMarqueeSection from '$lib/components/home/Ed3ClassesMarqueeSection.svelte';
	import Ed3SpotifyNowPlayingMarquee from '$lib/components/home/Ed3SpotifyNowPlayingMarquee.svelte';
	import Ed3PlaylistShelf from '$lib/components/home/Ed3PlaylistShelf.svelte';
	import Ed3SpotifyControl from '$lib/components/home/Ed3SpotifyControl.svelte';
	import type { SpotifyNowPlayingPayload } from '$lib/spotify/now-playing-types';
	import type { SpotifyPlaylistCard } from '$lib/spotify/playlist-types';
	import Ed3SfMapTip from '$lib/components/home/Ed3SfMapTip.svelte';
	import Ed3CatchEmAll from '$lib/components/home/Ed3CatchEmAll.svelte';
	import Ed3CatchModePicker from '$lib/components/home/Ed3CatchModePicker.svelte';
	import {
		catchProgress,
		COUNTRIES_TOTAL,
		US_STATES_TOTAL,
		type CatchModeId,
		type PlacesPayload
	} from '$lib/evolution/places';
	import { LINK_REL_NOOPENER_NOREFERRER, LINK_TARGET_BLANK, PERSONAL_NAME } from '$lib/constants';
	import { tagOutboundUrl } from '$lib/routing/outbound-utm';
	import {
		COMPETITIONS,
		competitionEventLink,
		competitionFlairLabel,
		competitionRepos,
		competitionTech
	} from '$lib/content/competitions';
	import { FAVORITE_CLASSES } from '$lib/content/classes';
	/* Every word this page says. See \`$lib/content/home\`. */
	import {
		BLOG,
		BLOG_PREDICTION_KEYS,
		BYLINE,
		BYLINE_CA_GLYPHS,
		BYLINE_ROLE_SWAPS,
		BYLINE_US_GLYPHS,
		COMPETITIONS_LIST_LABEL,
		ETHICAL_HACKING,
		FOOTER_MARKER,
		HERO_PORTRAIT_ALT_TEMPLATE,
		HERO_TOP_ANCHOR,
		heroLede,
		type HomeBlogView,
		HUD,
		MISC,
		NUMBERS,
		NUMBERS_LIST_LABEL,
		type NumbersView,
		otherProjectsMarker,
		PORTFOLIO_EVOLUTION,
		SPOTIFY_SECTION,
		type PortfolioEvoCompare,
		type SpotifyView,
		PROJECTS,
		SECTIONS,
		SKILL_ROWS,
		SKILLS_LIST_LABEL,
		statCells,
		LIVE_RANK_STATS,
		TLDR_LIST_LABEL,
		TLDR_POINTS
	} from '$lib/content/home';
	import { UNIVERSITIES } from '$lib/content/education';
	import type { WritingSectionEntry } from '$lib/content/writing';
	import { WORK_PLACES } from '$lib/content/work';
	import { analytics, IS_PROD, trackOutboundOpen, trackUiOnce } from '$lib/analytics';
	import {
		countryDisplayName,
		countryFlagEmoji,
		rankReferrerRows,
		referrerDisplayParts,
		referrerProxyFaviconPath
	} from '$lib/analytics/visitor-display';
	import { ORBIT_FIRST_LINK, ORBIT_LINKS } from '$lib/content/orbit';
	import { sendOrbitClick } from '$lib/analytics/orbit-click';
	import { glideHeight } from '$lib/actions/glideHeight';
	import { justifyCopyOnScroll } from '$lib/actions/justifyCopyOnScroll';
	import { ED3_AS_A_KID, type KidActivity } from '$lib/content/childhood';
	import { FEATURED_TILES } from '$lib/content/featured-projects';
	import { MORE_PROJECTS } from '$lib/content/project-archive';
	import { heroImageSrc, thumbSrc } from '$lib/media/image-thumb';
	import SeoHead from '$lib/components/shared/SeoHead.svelte';
	import { SEO_HOME } from '$lib/seo';
	import PolaroidLifeSection from '$lib/components/polaroid/PolaroidLifeSection.svelte';
	import { latestAnalyticsVisitors } from '$lib/analytics/visitors-client';
	import type { PageData } from './$types';

	/** \`active\` is false when CoreRouteStack keeps this page alive off-screen. */
	let { data, active = true }: { data: PageData; active?: boolean } = $props();

	/*
	  The article gutter rail, pointed at this page's own section markers.

	  Same component and the same design it wears on an article: one bar per
	  section down the left of the frame, filling as the reading line crosses it,
	  the section's name set plain in the gutter on hover, and only from 900px up
	  — below that there is no gutter to put it in.

	  The list is read off the rendered page rather than written out again here.
	  Every marker is already an \`h2.ed3__section-title\` carrying the id its
	  anchor uses, so the DOM is the one true copy; a hand-kept array beside it
	  would be a second copy of the page that could quietly drift from it.

	  \`.ed3__section-title__label\` and not the whole heading: a brand mark beside
	  the name (Spotify's) is not part of it.
	*/
	let ed3RootEl = $state<HTMLElement | null>(null);
	let sectionHeadings = $state.raw<MarkdownHeading[]>([]);

	/*
	  The one tick that is written here rather than read off the page.

	  The hero has no marker of its own, because it is not a section of the page
	  — it is the top of it. So "Me" is aimed at a zero-height mark at the very
	  top of the frame (\`.ed3__top-anchor\` below), and once the reading-line
	  offset is subtracted the jump resolves to 0. Which is what it should mean.
	*/
	const ED3_TOP_HEADING: MarkdownHeading = {
		level: 2,
		id: HERO_TOP_ANCHOR.id,
		text: HERO_TOP_ANCHOR.label
	};

	function readSectionHeadings(root: HTMLElement): MarkdownHeading[] {
		const markers = Array.from(root.querySelectorAll<HTMLElement>('h2.ed3__section-title[id]'))
			.map((heading) => ({
				level: 2,
				id: heading.id,
				// The attribute, not \`textContent\`: a hovered title holds its rolling copies too.
				text: (
					heading.querySelector<HTMLElement>('.ed3__section-title__label')?.dataset.headingText ??
					''
				).trim()
			}))
			.filter((heading) => heading.text.length > 0);

		return [ED3_TOP_HEADING, ...markers];
	}

	$effect(() => {
		// Re-read on the two things that can add or drop a marker: the keep-alive
		// pane coming back on screen, and Playlists, the one section the payload
		// gates. Everything else on the page is unconditional markup.
		const shown = active;
		const playlistCount = data.playlists.length;
		const root = ed3RootEl;
		if (!browser || !shown || !root) {
			sectionHeadings = [];
			return;
		}
		void playlistCount;

		void tick().then(() => {
			const next = readSectionHeadings(root);
			const prev = untrack(() => sectionHeadings);
			if (
				prev.length !== next.length ||
				next.some((heading, i) => heading.id !== prev[i]?.id || heading.text !== prev[i]?.text)
			) {
				sectionHeadings = next;
			}
		});
	});

	let kidHighlightActivity = $state<KidActivity | null>(null);

	const HERO_LEDE = heroLede();

	/** One tick per glyph swap; the two sides alternate ticks so they never flip in unison. */
	const BYLINE_GLYPH_TICK_MS = 190;

	let bylineCaIndex = $state(0);
	let bylineUsIndex = $state(0);
	let bylineGlyphTimer = 0;
	let bylineGlyphTick = 0;

	function startBylineGlyphs() {
		if (!browser || bylineGlyphTimer) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		/*
		  A hovering pointer only. On a phone the tap fires the synthetic
		  \`mouseenter\` that starts this and the \`mouseleave\` that stops it never
		  comes until the next tap somewhere else — so the riffle ran on and on,
		  two faces at a time, and read as the flags jittering.
		*/
		if (!pointerFineHoverEnabled()) return;
		bylineGlyphTick = 0;
		bylineGlyphTimer = window.setInterval(() => {
			bylineGlyphTick += 1;
			if (bylineGlyphTick % 2 === 1) {
				bylineCaIndex = (bylineCaIndex + 1) % BYLINE_CA_GLYPHS.length;
			} else {
				bylineUsIndex = (bylineUsIndex + 1) % BYLINE_US_GLYPHS.length;
			}
		}, BYLINE_GLYPH_TICK_MS);
	}

	function stopBylineGlyphs() {
		if (bylineGlyphTimer) {
			clearInterval(bylineGlyphTimer);
			bylineGlyphTimer = 0;
		}
		bylineCaIndex = 0;
		bylineUsIndex = 0;
	}

	onMount(() => stopBylineGlyphs);

	/*
	  The role's letters, each tagged with the symbol it becomes on hover and its
	  place in the swap order (\`o\` first, then every \`e\`, then the rest). Letters
	  with no symbol stay plain text.
	*/
	const BYLINE_ROLE_LETTERS = (() => {
		let order = 0;
		const orderOf = new Map<number, number>();
		const chars = [...BYLINE.role];
		for (const [from] of BYLINE_ROLE_SWAPS) {
			chars.forEach((char, i) => {
				if (char === from && !orderOf.has(i)) orderOf.set(i, order++);
			});
		}
		return chars.map((char, i) => ({
			char,
			swap: BYLINE_ROLE_SWAPS.find(([from]) => from === char)?.[1] ?? null,
			order: orderOf.get(i) ?? -1
		}));
	})();
	const BYLINE_ROLE_SWAP_COUNT = BYLINE_ROLE_LETTERS.filter((letter) => letter.swap).length;
	/** Gap between one letter turning and the next. */
	const BYLINE_ROLE_TICK_MS = 70;

	/** How many letters, in swap order, currently show their symbol. */
	let bylineRoleSwapped = $state(0);
	const bylineRoleStepper = createSwapStepper(
		BYLINE_ROLE_TICK_MS,
		() => bylineRoleSwapped,
		(n) => (bylineRoleSwapped = n)
	);

	function startBylineRole() {
		if (!browser) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		// Same gate as the flags: a tap would leave the symbols up until the next tap.
		if (!pointerFineHoverEnabled()) return;
		bylineRoleStepper.to(BYLINE_ROLE_SWAP_COUNT);
	}

	function stopBylineRole() {
		if (!browser) return;
		/*
		  Always re-aim, even at 0. The stepper's first tick is 70ms out, so a
		  quick pass leaves before any letter has turned — and returning early
		  here left the stepper walking on to every symbol, stuck there.
		*/
		bylineRoleStepper.to(0);
	}

	onMount(() => bylineRoleStepper.stop);

	/* \`/#contact\` and the legacy URLs that redirect to a section: glide there. */
	onMount(() => runHashLanding());

	/*
	  The rest of the projects are an accordion, not a media grid. The grid put
	  every project behind a thumbnail of equal weight, which is the opposite of
	  what a "more projects" list is for — the featured deck already carries the
	  images, and this is the index you scan.
	*/
	const PROJECT_ENTRIES: Ed3IndexEntry[] = MORE_PROJECTS.map((project) => ({
		id: \`more-\${project.title}\`,
		title: project.title,
		meta: project.period,
		flair: project.highlight,
		body: project.summary,
		links: project.links,
		tech: project.tech
	}));

	const otherProjectsSection = otherProjectsMarker(PROJECT_ENTRIES.length);

	/*
	  Dates in the featured list are written \`apr '24\` — a month and a two-digit
	  year — or, for work that ran a while, a span: \`apr '24 — feb '25\`. That is
	  the form they are *read* in and the form they stay in. The work grid needs
	  the two halves apart: the year groups the list and labels the gutter, the
	  rest sits at the end of the card's foot row.

	  The grid sets the month in full — \`April\`, \`April '24 — February '25\` —
	  where the archive rows keep the three-letter form. A card's foot has the
	  width for it and one word there reads better than an abbreviation; the
	  data stays abbreviated so every list is still written the same way.

	  A span is filed under the year it finished — that is when the project
	  became the thing the card shows, and it is the order the list is kept in —
	  and its foot carries the whole span, since the gutter alone would say only
	  where it ended.

	  The century is assumed rather than parsed. Every project here postdates 2000
	  by a wide margin and the alternative is a sliding window that would silently
	  start mislabelling things in seventy-five years, which is a worse trade than
	  a comment.
	*/
	const MONTH_NAMES = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	function fullMonthName(abbreviation: string): string {
		const key = abbreviation.slice(0, 3).toLowerCase();
		return MONTH_NAMES.find((name) => name.slice(0, 3).toLowerCase() === key) ?? abbreviation;
	}

	function parseProjectDateEnd(end: string): { month?: string; year: string } | undefined {
		const match = /^\\s*([a-z]{3,})?\\s*'?(\\d{2}|\\d{4})\\s*$/i.exec(end);
		if (!match) return undefined;
		const [, month, digits] = match;
		return {
			month: month ? fullMonthName(month) : undefined,
			year: digits.length === 2 ? \`20\${digits}\` : digits
		};
	}

	function splitProjectDate(date: string): { year: string; month?: string; date?: string } {
		const ends = date.split(/\\s*[—–]\\s*/).map(parseProjectDateEnd);
		const last = ends[ends.length - 1];
		if (!last || ends.some((end) => !end)) return { year: date.trim() };
		/* On desktop the gutter says the year and the foot only the rest —
		   \`August\`. On a phone there is no gutter, so the foot gets the whole
		   date instead: \`August 2024\`. A span — \`April '24 — February '25\` — is
		   the whole date either way, since the gutter alone would only say where
		   it ended. */
		if (ends.length === 1) {
			return {
				year: last.year,
				month: last.month,
				date: last.month ? \`\${last.month} \${last.year}\` : last.year
			};
		}
		const span = ends
			.map((end) => \`\${end!.month ? \`\${end!.month} \` : ''}'\${end!.year.slice(2)}\`)
			.join(' — ');
		return { year: last.year, month: span, date: span };
	}

	/*
	  The article banners the writing section already knows, by slug, for the two
	  featured plates that are those banners. A card's flight lands on a *live*
	  banner, so the picture has to be decoded before the click or the second half
	  of the flight is the card's own snapshot sharpening into it; the grid warms
	  this the way a /blog row does, on the pointer resting. An article outside
	  the home page's list simply has no warm — the flight still flies, on the
	  card's snapshot as its floor.
	*/
	const articleHeroSrcBySlug = new Map<string, string>();
	for (const entry of data.articles ?? []) {
		if (!entry.id.startsWith('article:')) continue;
		const src = heroImageSrc(entry.bannerImgUrl);
		if (src) articleHeroSrcBySlug.set(entry.id.slice('article:'.length), src);
	}

	const featuredWorkEntries: WorkEntry[] = FEATURED_TILES.map((tile) => {
		const { year, month, date } = splitProjectDate(tile.date);
		return {
			id: \`work-\${tile.title}\`,
			title: tile.title,
			year,
			month,
			date,
			badge: tile.highlight,
			/* The card's only click targets, so the list goes through whole. A tile's
			   \`href\` is deliberately dropped: it is one destination, and every tile
			   that sets one also names it in \`links\`. */
			links: tile.links,
			/*
			  \`logoSrc\` is the existing signal for "this project has artwork of its
			  own" — \`withOwnArtwork\` in \`content/featured-projects\` sets it only
			  when a tile brought its own image; the deck once fell back to one
			  shared Golden Gate sketch otherwise. The book could carry that placeholder
			  because it showed one page at a time; a grid shows three identical
			  bridges at 16:9 in a single screen, which reads as a broken build
			  rather than as a stand-in.

			  Passing no \`src\` leaves the plate hatched, which is the grid's own
			  way of saying a cell is empty. Same call the round badge already
			  makes — see \`FeaturedProjectTile.logoSrc\`: a shared
			  placeholder has to be recognised as fake before it says anything, and
			  an honestly empty plate says it immediately.
			*/
			src: tile.logoSrc ? tile.imageSrc : undefined,
			alt: tile.logoSrc ? tile.imageAlt : undefined,
			/* Same gate as \`src\` — the clip is the plate, and a tile with no artwork
			   of its own has no clip either. \`src\` doubles as its poster. */
			videoSrc: tile.logoSrc ? tile.videoSrc : undefined,
			/* Pairs the plate with the article's banner for the hero morph, where the
			   two are the same photograph — see \`FeaturedProjectTile.articleSlug\`. */
			morphId: tile.articleSlug,
			preloadSrc: tile.articleSlug ? articleHeroSrcBySlug.get(tile.articleSlug) : undefined,
			/*
			  Passed through in its segment form rather than flattened, so the red
			  on a \`highlight\` part survives. It is the same sentence, with the same
			  clause in the same accent, that \`Ed3FeaturedProjectDeck\` already sets —
			  flattening here would have been the one place on the site where this
			  copy loses its emphasis.
			*/
			description: tile.description,
			tech: tile.tech
		};
	});

	const COMPETITION_ENTRIES: Ed3IndexEntry[] = COMPETITIONS.map((entry) => ({
		id: entry.event,
		title: entry.event,
		meta: entry.year,
		flair: competitionFlairLabel(entry.category, entry.flairDetail),
		href: competitionEventLink(entry),
		/* Named rather than left as "website": the row is the hackathon, and the
		   line it lands on is otherwise repos. */
		hrefLabel: 'Event',
		body: entry.result,
		links: [
			...competitionRepos(entry),
			...(entry.discordLink ? [{ label: 'Discord', href: entry.discordLink }] : [])
		],
		tech: competitionTech(entry)
	}));

	const SKILL_ENTRIES: Ed3SkillEntry[] = SKILL_ROWS.map((skill) => ({
		id: skill.category,
		title: skill.category,
		body: skill.body,
		...(skill.footnote ? { footnote: skill.footnote } : {})
	}));

	/* Live where the Discord scrape landed, so the row is \`$derived\` rather than
	   read once — the count arrives with the page data. */
	const STAT_CELLS = $derived(statCells(data.discordMemberCount));

	/*
	  Same two-line index as Experience: the figure is the title, the label is
	  the muted line under it — paired up two to a row, which is the one place on
	  the page that gets a split index. A figure over a four-word label is a
	  third of the measure wide, so run singly these left a column of air down
	  the right and the section ran twice as long as it reads.
	*/
	/*
	  The two measured rows in By the Numbers.

	  Read off \`dashboard24h\` — the rolling 7-day PostHog snapshot the globe
	  already pulls in this page's load — so neither row costs a query of its
	  own. Nothing on the row states the window or the counts: it is a glance,
	  and a cached weekly aggregate cannot honour the precision that spelling
	  out an age or a session tally would imply.

	  Referrers: named sources with a favicon, then named ones without, then
	  Direct, Unknown and the other unnamed buckets, each by session count, with
	  rows that read the same merged — already in that order from the load
	  (\`rankReferrerRows\`, which needs the server's favicon cache). Countries are
	  the top five by count, with the US and then Canada lifted to the front
	  when they are among them.
	*/
	/*
	  The load's snapshot, or — when the SSR read missed its budget and came back
	  without one (a cold process, or a dev server just after an edit) — the
	  facepile poll's, the way the bot rows below fall back. The poll's referrers
	  are censored by the public payload already but not ranked, and the client
	  has no favicon cache, so they rank on "has a host" alone.
	*/
	const liveDashboard = $derived.by(() => {
		const loaded = data.liveVisitors?.dashboard24h;
		if (loaded) return loaded;
		const polled = $latestAnalyticsVisitors?.dashboard24h;
		return polled ? { ...polled, referrers: rankReferrerRows(polled.referrers) } : null;
	});

	type RankRow = { name: string; count: number; meta?: string | null };

	function rankMarks(
		rows: readonly RankRow[] | undefined,
		mark: (row: RankRow) => { img?: string; glyph?: string; bot?: boolean; name: string },
		reorder: (rows: RankRow[]) => RankRow[] = (rows) => rows
	): Ed3IndexMark[] {
		const top = (rows ?? []).filter((row) => row.count > 0).slice(0, LIVE_RANK_STATS.limit);
		return reorder(top).map((row, i) => {
			const { img, glyph, bot, name } = mark(row);
			/* Just the name. The strip is already in rank order, so a "#1" in the
				   popup restates the position the eye has, and a session count invites
				   the reader to do arithmetic on a figure that is a cached weekly
				   aggregate rather than a live tally. */
			return {
				id: \`\${row.name}-\${i}\`,
				...(img ? { img } : {}),
				...(glyph ? { glyph } : {}),
				...(bot ? { bot } : {}),
				tip: name
			};
		});
	}

	/* Home countries lead when they made the top five on their own: US, then
	   Canada, then the rest in count order. Applied after the cut, so a sixth-place
	   US never displaces a real top-five entry. */
	const LEADING_COUNTRY_CODES = ['US', 'CA'];

	function leadWithHomeCountries(rows: RankRow[]): RankRow[] {
		const rank = (row: RankRow) => {
			const i = LEADING_COUNTRY_CODES.indexOf((row.meta ?? '').toUpperCase());
			return i === -1 ? LEADING_COUNTRY_CODES.length : i;
		};
		return rows
			.map((row, i) => ({ row, i }))
			.sort((a, b) => rank(a.row) - rank(b.row) || a.i - b.i)
			.map(({ row }) => row);
	}

	const TOP_COUNTRY_MARKS = $derived(
		rankMarks(
			liveDashboard?.countries,
			(row) => ({
				glyph: countryFlagEmoji(row.meta),
				/* The snapshot's own name where it has one; the ISO code is the fallback. */
				name: row.name || countryDisplayName(row.meta)
			}),
			leadWithHomeCountries
		)
	);

	const TOP_REFERRER_MARKS = $derived(
		rankMarks(liveDashboard?.referrers, (row) => {
			const img = referrerProxyFaviconPath(row.name);
			/* No favicon and no host: the link glyph carries it (Direct, odd UTMs). */
			return { ...(img ? { img } : {}), name: referrerDisplayParts(row.name).label };
		})
	);

	/*
	  The week's automated visitors, by visit count across all three sites: each
	  bot's operator favicon, with its name (and the company, when that says
	  more) in the tip. Recorded server-side (\`$lib/server/bots\`), so these
	  rows see the crawlers the analytics above never can.
	*/
	function botMarks(
		rows:
			| readonly { name: string; operator: string | null; domain: string | null; visits: number }[]
			| undefined
	) {
		return rankMarks(
			(rows ?? []).map((row) => ({
				name: row.name,
				count: row.visits,
				meta: row.domain ? \`\${row.domain}|\${row.operator ?? ''}\` : \`|\${row.operator ?? ''}\`
			})),
			(row) => {
				const [domain, operator] = (row.meta ?? '|').split('|');
				const name =
					operator && !row.name.toLowerCase().includes(operator.toLowerCase())
						? \`\${row.name} (\${operator})\`
						: row.name;
				/* No operator favicon to wear: the drawn robot, as in the facepile. */
				return { ...(domain ? { img: faviconProxyPath(domain) } : { bot: true }), name };
			}
		);
	}

	/* The load's rows until the facepile's first poll, then whatever it last brought. */
	const topBots = $derived($latestAnalyticsVisitors?.topBots ?? data.topBots);
	const TOP_BOT_MARKS = $derived(botMarks(topBots?.bots));
	const TOP_CITER_MARKS = $derived(botMarks(topBots?.citers));

	/**
	 * A measured row, or nothing at all.
	 *
	 * The two rows drop out independently: no snapshot yet, an empty window, or
	 * a window with only one of the two populated, and the section simply has
	 * one fewer row. A stat grid is a list of things I can state — a row saying
	 * "no data yet" states nothing, and dressing an unfilled cache as a zero
	 * would be worse. Both being absent is a normal state, not a broken one.
	 */
	function liveRankEntry(
		spec: { id: string; label: string },
		marks: Ed3IndexMark[]
	): Ed3IndexEntry | null {
		if (marks.length === 0) return null;
		return { id: spec.id, title: '', marks, subtitle: spec.label };
	}

	const STAT_ENTRIES: Ed3IndexEntry[] = $derived(
		[
			...STAT_CELLS.map((cell) => ({
				id: cell.id,
				title: cell.value,
				subtitle: cell.label,
				href: cell.href,
				caret: cell.caret
			})),
			liveRankEntry(LIVE_RANK_STATS.countries, TOP_COUNTRY_MARKS),
			liveRankEntry(LIVE_RANK_STATS.referrers, TOP_REFERRER_MARKS),
			liveRankEntry(LIVE_RANK_STATS.bots, TOP_BOT_MARKS),
			liveRankEntry(LIVE_RANK_STATS.citers, TOP_CITER_MARKS)
		].filter((entry): entry is Ed3IndexEntry => entry !== null)
	);

	let homeBlogView = $state<HomeBlogView>('articles');
	/* By the Numbers: the figures by default; the map only once asked for. */
	let numbersView = $state<NumbersView>('stats');
	let catchMode = $state<CatchModeId>('countries');
	/* The map's places, once it has loaded them — the lede counts from the same payload,
	   and from the server's count until then, so the numbers are there on first paint. */
	let catchPlaces = $state.raw<PlacesPayload | null>(null);
	const catchLede = $derived.by(() => {
		const caught = catchPlaces ? catchProgress(catchPlaces) : data.catchCounts;
		return \`\${NUMBERS.catch.lede} \${NUMBERS.catch.progress(
			caught ? String(caught.countries) : '–',
			COUNTRIES_TOTAL,
			caught ? String(caught.usStates) : '–',
			US_STATES_TOTAL
		)}\`;
	});

	function homeBlogListHref(view: HomeBlogView): string {
		return \`/blog?view=\${view}\`;
	}

	/*
	  The home section is a taster with a "view all" under it — the accordion never
	  expands here. Cutting the list at what is shown matters now that every row
	  carries a dithered print: the rows past this point were already inert, and
	  building them would mount a canvas and a thumbnail fetch apiece for nothing.
	*/
	const HOME_BLOG_ROWS = 3;

	function writingToAccordion(
		entries: readonly WritingSectionEntry[] | null | undefined,
		view: HomeBlogView
	): Ed3AccordionEntry[] {
		return (entries ?? []).slice(0, HOME_BLOG_ROWS).map((entry) => {
			let href = entry.href;
			if (view === 'thoughts') {
				const thoughtId = entry.id.startsWith('thought:')
					? entry.id.slice('thought:'.length)
					: entry.id;
				href = \`/blog?view=thoughts&thought=\${thoughtId}\`;
			}
			const slug =
				view === 'articles' && entry.id.startsWith('article:')
					? entry.id.slice('article:'.length)
					: undefined;
			return {
				id: entry.id,
				left: entry.title,
				right: entry.year,
				href,
				/* Resized copy, not the banner itself — a row draws it at 78px and the
				   originals are full-resolution photographs. Same call /blog makes. */
				previewSrc: thumbSrc(entry.bannerImgUrl),
				/* Warmed on hover so the hero morph flies into a decoded picture — the
				   same URL the banner will ask for. See \`hero-preload.ts\`. */
				preloadSrc: view === 'articles' ? heroImageSrc(entry.bannerImgUrl) : undefined,
				/* Pairs this thumb with the article's own banner for the hero morph,
				   so a click from here runs the same transition a /blog row does. */
				morphId: slug,
				static: true
			};
		});
	}

	/*
	  All three lists, built once — the section renders every one of them and only
	  shows the tab you picked. See \`.ed3__blog-pane\` for why.
	*/
	const blogEntriesByView = $derived({
		articles: writingToAccordion(data.articles, 'articles'),
		series: writingToAccordion(data.series, 'series'),
		thoughts: writingToAccordion(data.thoughts, 'thoughts')
	} satisfies Record<HomeBlogView, Ed3AccordionEntry[]>);

	const homeBlogViewAllHref = $derived(homeBlogListHref(homeBlogView));

	let portfolioEvoCompare = $state<PortfolioEvoCompare>('baseline');
	let spotifyView = $state<SpotifyView>('playlists');
	/*
	  The Control tab's buttons take no room on the Playlists tab: the drawer
	  under the shelf opens and closes its height on a switch, stepped in whole
	  pixels like every accordion (see \`animate-track\`). The first run only
	  records the starting tab — nothing animates on load.
	*/
	let spotifyActionsEl = $state<HTMLDivElement | null>(null);
	let spotifyActionsSeen = false;
	$effect(() => {
		const open = spotifyView === 'control';
		const el = spotifyActionsEl;
		if (!el) return;
		if (!spotifyActionsSeen) {
			spotifyActionsSeen = true;
			return;
		}
		untrack(() => animateGridTrack(el, open, DURATION.slow));
	});
	/* Written by the now-playing line; the Control tab reads whether I am listening. */
	let spotifyNowPlaying = $state<SpotifyNowPlayingPayload | null>(null);
	/* The communal playlist: the shared paragraph links it and counts it, and
	   the shelf stands it alone on the Control tab. Loaded with the page, so the
	   shelf is built with it; replaced after an add so the count moves. */
	let spotifyCommunal = $state<SpotifyPlaylistCard | null>(untrack(() => data.communalPlaylist));
	/* The same jackets every time — only the communal one's count can change. */
	const spotifyShelf = $derived(
		spotifyCommunal ? [...data.playlists, spotifyCommunal] : data.playlists
	);
	/* Written by the shelf; the now-playing line is held to its plank. */
	let spotifyPlankWidth = $state(0);

	/*
	  Portfolio Evolution reports from the live site only — see \`$lib/analytics/prod\`
	  for why, and \`Ed3PortfolioEvolution\` for the events raised inside it.

	  Dropping the spec's \`prediction\` key is what takes the section's own
	  instrumentation off the wrapper: \`Ed3HomeSection\` renders every \`data-*\`
	  from the spec, so an absent key means an absent attribute, and the viewport
	  and scroll-depth observers that read those attributes never see a section
	  to report on. The marker, the anchor and the rail tick are untouched — the
	  section is still fully there, it just stops keeping score.
	*/
	const { prediction: _evoPrediction, ...portfolioEvoSectionSilent } = SECTIONS.portfolioEvolution;
	const portfolioEvoSection = IS_PROD ? SECTIONS.portfolioEvolution : portfolioEvoSectionSilent;

	/**
	 * Heavy panes load via dynamic import AFTER first paint.
	 * Static-importing them pulls mapbox/polaroid into the critical Vite graph and can
	 * stall hydration for minutes on a cold/contended dev server.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let VisitorsGlobeSection = $state<any>(null);
	let orbitDeck = $state<string[]>([]);
	let orbitDeckIndex = $state(0);
	let lastOrbitHref = $state<string | null>(null);

	function shuffleOrbitLinks(excludeFirst: string | null): string[] {
		const deck = [...ORBIT_LINKS];
		for (let i = deck.length - 1; i > 0; i -= 1) {
			const j = Math.floor(Math.random() * (i + 1));
			[deck[i], deck[j]] = [deck[j], deck[i]];
		}
		if (excludeFirst && deck.length > 1 && deck[0] === excludeFirst) {
			const swapWith = 1 + Math.floor(Math.random() * (deck.length - 1));
			[deck[0], deck[swapWith]] = [deck[swapWith], deck[0]];
		}
		return deck;
	}

	/** First deck of the visit leads with ORBIT_FIRST_LINK; later decks are fully shuffled. */
	function firstOrbitDeck(): string[] {
		const deck = shuffleOrbitLinks(null);
		const at = deck.indexOf(ORBIT_FIRST_LINK);
		if (at > 0) [deck[0], deck[at]] = [deck[at], deck[0]];
		return deck;
	}

	function viewSomeoneAwesome() {
		if (orbitDeckIndex >= orbitDeck.length) {
			orbitDeck = lastOrbitHref === null ? firstOrbitDeck() : shuffleOrbitLinks(lastOrbitHref);
			orbitDeckIndex = 0;
		}
		const href = orbitDeck[orbitDeckIndex];
		orbitDeckIndex += 1;
		lastOrbitHref = href;
		trackOutboundOpen(href, 'orbit');
		sendOrbitClick(href);
		window.open(tagOutboundUrl(href), LINK_TARGET_BLANK, LINK_REL_NOOPENER_NOREFERRER);
	}

	onMount(() => {
		let cancelled = false;
		/*
		 * The polaroid frame used to lazy-load the drag/pan/zoom gallery here. It is
		 * a drift field now (\`PolaroidDriftField\`) — small enough to import with the
		 * section, so there is no heavy chunk left to defer.
		 */
		/* The globe chunk used to be fetched when the analytics section came into
		   view. That section is gone; the fullscreen stage warms the same chunk
		   from idle instead (see \`ensureVisitorsSection\`). */
		const observers: IntersectionObserver[] = [];

		return () => {
			cancelled = true;
			for (const observer of observers) observer.disconnect();
		};
	});
<\/script>

{#if active}
	<SeoHead {...SEO_HOME} />
{/if}

<div class="ed3 ed3--ruled" bind:this={ed3RootEl}>
	<span class="ed3__top-anchor" id={HERO_TOP_ANCHOR.id} aria-hidden="true"></span>
	<Ed3FrameRails />
	<!-- Declared here so it renders in place on the server, but the rail portals
	     itself to \`<body>\` on mount: a fixed layer under this frame's \`overflow\`
	     clips jittered on scroll in Safari. Its \`--ed3-*\` tokens are declared on
	     the rail's own class too (\`ed3-shell.css\`), so it paints the same out there. -->
	{#if active}
		<ArticleToc
			headings={sectionHeadings}
			labelBoundsSelector=".ed3__shell"
			labelObstacleSelector={null}
			predictionKey={null}
		/>
	{/if}
	<div class="ed3__shell">
		<div data-prediction-section="polaroids">
			<PolaroidLifeSection {active}>
				{#snippet hero()}
					<!-- \`data-cursor-anchor\`: live cursors name what is under the pointer from here (\`live-cursors/anchors.ts\`). -->
					<header class="ed3__hero" data-prediction-section="hero" data-cursor-anchor="hero">
						<!--
						  The halftone portrait, moved up from /credits where it was parked as
						  a test bed. Dots spread apart under the cursor and the whole picture
						  morphs to account for the room that takes — an incompressible source,
						  so the far field falls off as 1/r rather than stopping at a radius.

						  Tuning notes live on the credits copy; the one difference here is
						  \`cell\`. Pitch is in CSS pixels, so the same value on a picture a
						  third the width would leave a third of the dots across the face and
						  it would stop resolving. Finer screen, same read.

						  \`buildIn\` prints the portrait on arrival: a ragged front travels up
						  from the bottom edge and every dot grows into place behind it, once
						  per load. It deliberately overrides \`posterSrc\` — a baked poster is
						  the finished print, and showing it first would leave the sweep with
						  nothing to lay down — so the frame is blank until the source has
						  been sampled. The poster stays declared because reduced motion (and
						  a page with scripting off) falls back to it, and because it is
						  still what the canvas hands over from there.

						  \`renderWidth\` is what makes that handover invisible. It fixes the
						  screen to one bitmap — same grid, same tone, same device ratio, at
						  every viewport and on every display — and the poster is read
						  straight out of that canvas by \`npm run build:halftone-poster\`, so
						  the two are the same pixels rather than two attempts at the same
						  picture. Re-run it after changing any prop below.
						-->
						<figure class="ed3__hero-portrait">
							<DitherImage
								src="/media/misc_landing_page/portrait-halftone.jpg"
								alt={HERO_PORTRAIT_ALT_TEMPLATE.replace('{name}', PERSONAL_NAME)}
								posterSrc="/media/misc_landing_page/portrait-halftone-poster-hero.png"
								mode="halftone"
								renderWidth={176}
								restState="dither"
								reveal={false}
								buildIn
								buildInMs={1300}
								buildInDelayMs={140}
								pointerPush
								pushRadius={16}
								pushStrength={6}
								cell={2}
								dotScale={1.05}
								edgeFade={44}
								edgeFadeJitter={0.6}
								gamma={0.8}
								contrast={2.0}
								maxSampleWidth={320}
								ink="#27272a"
								paper="transparent"
								objectFit="cover"
								loading="eager"
							/>
						</figure>

						<!--
						  \`ed3-band\` is the site's ruled band, unchanged: the same two
						  hairlines, from the same tokens, that enclose every section
						  marker below. A masthead set at the display step with nothing
						  drawn around it was the one heading on the page not sitting in
						  the page's ruling. See \`.ed3-band\` in \`ed3-shell.css\`.
						-->
						<h1 class="ed3__byline ed3-band">
							<span class="ed3__byline-name"
								><Ed3BylineName name={PERSONAL_NAME} />
								<span
									class="ed3__byline-glyphs"
									role="img"
									aria-label={BYLINE.glyphsLabel}
									onmouseenter={startBylineGlyphs}
									onmouseleave={stopBylineGlyphs}
									>(<span class="ed3__byline-glyph" aria-hidden="true"
										><span class="ed3__byline-glyph-strut">🇨🇦</span
										>{#each BYLINE_CA_GLYPHS as glyph, i (i)}<span
												class="ed3__byline-glyph-face"
												class:ed3__byline-face--alt={i !== 0}
												use:glyphRoll={i === bylineCaIndex}>{glyph}</span
											>{/each}</span
									>→<span class="ed3__byline-glyph" aria-hidden="true"
										><span class="ed3__byline-glyph-strut">🇺🇸</span
										>{#each BYLINE_US_GLYPHS as glyph, i (i)}<span
												class="ed3__byline-glyph-face"
												class:ed3__byline-face--alt={i !== 0}
												use:glyphRoll={i === bylineUsIndex}>{glyph}</span
											>{/each}</span
									>)</span
								></span
							>
							<span class="ed3__byline-slash" aria-hidden="true">/</span>
							<span
								class="ed3__byline-strong ed3__byline-role"
								onmouseenter={startBylineRole}
								onmouseleave={stopBylineRole}
								><span class="visually-hidden">{BYLINE.role}</span><span aria-hidden="true"
									>{#each BYLINE_ROLE_LETTERS as letter, i (i)}{#if letter.swap}<span
												class="ed3__byline-letter"
												><span class="ed3__byline-letter-strut">{letter.char}</span><span
													class="ed3__byline-letter-face"
													use:glyphRoll={letter.order >= bylineRoleSwapped}>{letter.char}</span
												><span
													class="ed3__byline-letter-face ed3__byline-face--alt"
													use:glyphRoll={letter.order < bylineRoleSwapped}>{letter.swap}</span
												></span
											>{:else}{letter.char}{/if}{/each}</span
								></span
							>
							<span class="ed3__byline-slash" aria-hidden="true">/</span>
							<span class="ed3__byline-strong"><Ed3SfMapTip label={BYLINE.location} /></span>
						</h1>

						<p class="ed3__obsessed">
							{HERO_LEDE.lead}
							{HERO_LEDE.tailBefore}{HERO_LEDE.tailEmphasis}{HERO_LEDE.tailAfter}
						</p>

						<ul class="ed3__tldr" aria-label={TLDR_LIST_LABEL}>
							{#each TLDR_POINTS as point (point.id)}
								<li class="ed3__tldr-item">
									<span class="ed3__tldr-bullet" aria-hidden="true"></span>
									{#if 'href' in point && point.href && 'linkText' in point && point.linkText}
										{@const linkAt = point.text.indexOf(point.linkText)}
										<span class="ed3__tldr-copy">
											<span class="ed3__tldr-text">
												{#if 'blob' in point && point.blob}<span
														class="ed3-logo-chip ed3-logo-chip--lead"
														aria-hidden="true"
														><img
															src={point.blob.src}
															alt=""
															width="14"
															height="14"
															loading="eager"
															decoding="async"
															draggable="false"
														/></span
													>{/if}{#if linkAt >= 0}{point.text.slice(0, linkAt)}<a
														class="ed3__tldr-text--link ed3-link"
														href={point.href}
														target={LINK_TARGET_BLANK}
														rel={LINK_REL_NOOPENER_NOREFERRER}>{point.linkText}</a
													>{point.text.slice(linkAt + point.linkText.length)}
												{:else}
													{point.text}
												{/if}
											</span>
										</span>
									{:else if 'href' in point && point.href}
										<span class="ed3__tldr-copy">
											<a
												class="ed3__tldr-text ed3__tldr-text--link ed3-link"
												href={point.href}
												target={LINK_TARGET_BLANK}
												rel={LINK_REL_NOOPENER_NOREFERRER}
											>
												{#if 'blob' in point && point.blob}<span
														class="ed3-logo-chip ed3-logo-chip--lead"
														aria-hidden="true"
														><img
															src={point.blob.src}
															alt=""
															width="14"
															height="14"
															loading="eager"
															decoding="async"
															draggable="false"
														/></span
													>{/if}{point.text}
											</a>
										</span>
									{:else}
										<span class="ed3__tldr-copy">
											<span class="ed3__tldr-text">
												{#if 'blob' in point && point.blob}<span
														class="ed3-logo-chip ed3-logo-chip--lead"
														aria-hidden="true"
														><img
															src={point.blob.src}
															alt=""
															width="14"
															height="14"
															loading="eager"
															decoding="async"
															draggable="false"
														/></span
													>{/if}{point.text}
											</span>
										</span>
									{/if}
								</li>
							{/each}
						</ul>
					</header>
				{/snippet}
			</PolaroidLifeSection>
		</div>

		<Ed3HomeSection section={SECTIONS.experience}>
			<Ed3ExperienceBoard entries={WORK_PLACES} />
		</Ed3HomeSection>

		<Ed3HomeSection section={SECTIONS.numbers}>
			{#snippet control()}
				<!-- One flex item: the picker continues the "Catch 'em All" tab as its ": Countries". -->
				<span class="ed3__numbers-control">
					<Ed3SectionTabs
						label={NUMBERS.tabsLabel}
						tabs={NUMBERS.tabs}
						bind:value={numbersView}
						onselect={(tab) => {
							trackUiOnce(
								\`home_numbers_view:\${tab.view}\`,
								'portfolio_interact',
								\`Switched By the Numbers to \${tab.label}\`
							);
						}}
					/>
					<Ed3CatchModePicker
						bind:value={catchMode}
						inactive={numbersView !== 'catch'}
						onactivate={() => {
							numbersView = 'catch';
							const tab = NUMBERS.tabs.find((option) => option.view === 'catch');
							if (tab)
								trackUiOnce(
									\`home_numbers_view:\${tab.view}\`,
									'portfolio_interact',
									\`Switched By the Numbers to \${tab.label}\`
								);
						}}
					/>
				</span>
			{/snippet}
			{#if numbersView === 'catch'}
				<p class="ed3__lede">{catchLede}</p>
				<Ed3CatchEmAll {active} mode={catchMode} bind:places={catchPlaces} />
			{:else}
				<Ed3IndexList entries={STAT_ENTRIES} label={NUMBERS_LIST_LABEL} columns={2} tabularTitle />
			{/if}
		</Ed3HomeSection>

		<Ed3HomeSection section={SECTIONS.blog}>
			{#snippet control()}
				<Ed3SectionTabs
					label={BLOG.tabsLabel}
					tabs={BLOG.tabs}
					bind:value={homeBlogView}
					onselect={(tab) => {
						void analytics.track('portfolio_interact', {
							sinks: ['prediction'],
							prediction: { type: 'inc', key: BLOG_PREDICTION_KEYS[tab.view].switched }
						});
						trackUiOnce(
							\`home_blog_view:\${tab.view}\`,
							'portfolio_interact',
							\`Switched home blog to \${tab.label}\`
						);
					}}
				/>
			{/snippet}
			<!--
			  One list per tab, all three mounted, and the switcher only changes which
			  one is shown.

			  Rebuilding a single list from the picked view is what it looked like it
			  should be, and it flickered: the rows are keyed on the entry id, so every
			  row of every tab is a different key, so switching destroyed three rows and
			  built three new ones. Each new row mounts its own dither canvas, which
			  cannot paint until its thumbnail has been fetched, decoded and sampled —
			  so the switch went old print → three empty boxes → three photographs →
			  three prints, one row at a time as the images landed.

			  Kept mounted, nothing is rebuilt and there is nothing to re-fetch: the
			  swap is one class. Same trick, and the same reasoning, as the keep-alive
			  route panes in \`CoreRouteStack\`.

			  \`predictionUnique\` is deliberately only on the shown pane. The rows of the
			  hidden ones are laid out (which is what lets their images load ahead of
			  time) and \`IntersectionObserver\` does not care about \`visibility\`, so
			  leaving the attribute on all three would count every tab as read the
			  moment any one of them scrolled past.
			-->
			<div class="ed3__blog-panes">
				{#each BLOG.tabs as tab (tab.view)}
					{@const shown = homeBlogView === tab.view}
					<div
						class="ed3__blog-pane"
						class:ed3__blog-pane--shown={shown}
						inert={!shown}
						aria-hidden={!shown}
					>
						<Ed3AccordionList
							entries={blogEntriesByView[tab.view]}
							label={tab.label}
							initialVisibleCount={HOME_BLOG_ROWS}
							showExpandActions={false}
							rowThumbs={tab.view !== 'thoughts'}
							predictionUnique={shown ? BLOG_PREDICTION_KEYS[tab.view].viewed : undefined}
							articleSurface={tab.view === 'articles' ? 'home' : undefined}
						/>
					</div>
				{/each}
			</div>
			<p class="ed3__blog-all">
				<a class="ed3__text-link ed3-link" href={homeBlogViewAllHref}>{BLOG.viewAll}</a>
			</p>
		</Ed3HomeSection>

		<!--
			Projects is two sections, not one section with two sub-labels.

			The grid and the index list are different objects — six pieces of work
			shown at full width against sixty-odd rows of one line each — and a 14px
			label inside the section read as a caption rather than as a division. So
			each half gets the page's own marker: the name at the display step,
			the ruled band across the frame, exactly like
			Experience or Skills. The page is scanned by those markers, and "Other
			Projects" is now something you can scan to.

			What did *not* split is the instrumentation. \`data-analytics-section\` and
			\`data-prediction-section\` stay on this first block alone, still called
			\`projects\`: both are keyed by an id that lives in \`analytics/types.ts\`
			(scroll-depth reach) and \`prediction/types.ts\`, a second element carrying
			the same id would double every viewport enter/leave, and "did they reach
			projects" is still one question. \`ed3-projects\` stays the heading id for
			the same reason — \`SCROLL_DEPTH_SECTIONS\` points at it by name.
		-->
		<Ed3HomeSection section={SECTIONS.featuredProjects} articleSurface="projects">
			<Ed3ProjectWorkGrid entries={featuredWorkEntries} />
		</Ed3HomeSection>

		<Ed3HomeSection
			section={SECTIONS.otherProjects}
			marker={otherProjectsSection}
			articleSurface="projects"
		>
			<Ed3IndexList
				entries={PROJECT_ENTRIES}
				label={PROJECTS.otherListLabel}
				initialVisibleCount={5}
				expandSingular={PROJECTS.expandSingular}
				expandPlural={PROJECTS.expandPlural}
			/>
		</Ed3HomeSection>

		<Ed3HomeSection section={SECTIONS.education}>
			<Ed3TicketRevealSection entries={UNIVERSITIES} />
			<div class="ed3__education-classes">
				<Ed3ClassesMarqueeSection entries={FAVORITE_CLASSES} />
			</div>
		</Ed3HomeSection>

		<Ed3HomeSection section={SECTIONS.skills}>
			<!-- The capability block: numbered name, rule, detail, and a hatched
			     band between every two rows. See \`Ed3SkillsGrid\`. -->
			<Ed3SkillsGrid entries={SKILL_ENTRIES} label={SKILLS_LIST_LABEL} />
		</Ed3HomeSection>

		<Ed3HomeSection section={SECTIONS.ethicalHacking}>
			<p class="ed3__lede">{ETHICAL_HACKING.lede}</p>
			<div class="ed3__hacking-layout">
				<div class="ed3__hacking-main">
					<ul class="ed3__tldr ed3__tldr--stack" aria-label={ETHICAL_HACKING.listLabel}>
						{#each ETHICAL_HACKING.points as point (point.id)}
							<li class="ed3__tldr-item">
								<span class="ed3__tldr-bullet" aria-hidden="true"></span>
								<span class="ed3__tldr-copy">
									<span class="ed3__tldr-text">{point.text}</span>
								</span>
							</li>
						{/each}
					</ul>
				</div>
				<Ed3DisclosureReply />
			</div>
		</Ed3HomeSection>

		<Ed3HomeSection section={SECTIONS.competitions}>
			<Ed3IndexList
				entries={COMPETITION_ENTRIES}
				label={COMPETITIONS_LIST_LABEL}
				predictionLinkClick="competition_links_clicked"
				predictionAccordion="competition"
			/>
		</Ed3HomeSection>

		<Ed3HomeSection section={SECTIONS.testimonials}>
			<Ed3Recommendations />
		</Ed3HomeSection>

		<Ed3HomeSection section={portfolioEvoSection}>
			{#snippet control()}
				<Ed3SectionTabs
					label={PORTFOLIO_EVOLUTION.tabsLabel}
					tabs={PORTFOLIO_EVOLUTION.tabs}
					bind:value={portfolioEvoCompare}
					onselect={(tab) => {
						if (!IS_PROD) return;
						trackUiOnce(
							\`home_portfolio_evo:\${tab.view}\`,
							'portfolio_interact',
							\`Switched portfolio evolution to \${tab.label}\`
						);
					}}
				/>
			{/snippet}
			<p class="ed3__lede">{PORTFOLIO_EVOLUTION.lede}</p>
			<Ed3PortfolioEvolution compare={portfolioEvoCompare} {active} stats={data.evolutionStats} />
		</Ed3HomeSection>

		<!-- Spotify: the shelf of playlists, and "Control my Music" beside it. The
		     live track sits centred under whichever shelf is showing, no wider than
		     its plank — the names circle the records, so the space under the
		     board is free for the one live fact.

		     \`when\` is the section's second condition: switched on, it still needs
		     playlists to have loaded before there is anything to show. -->
		<Ed3HomeSection section={SECTIONS.playlists} when={data.playlists.length > 0}>
			{#snippet control()}
				<!--
				  Silent tabs: switching here moves the shelf, and the rack's own sleeve
				  swap is the sound of that (\`setSolo\`). With the site's default press on
				  top of it, one tap made two noises 2ms apart — a click and a book.
				-->
				<span data-sfx="off">
					<Ed3SectionTabs
						label={SPOTIFY_SECTION.tabsLabel}
						tabs={SPOTIFY_SECTION.tabs}
						bind:value={spotifyView}
						onselect={(tab) => {
							if (!IS_PROD) return;
							trackUiOnce(
								\`home_spotify:\${tab.view}\`,
								'portfolio_interact',
								\`Switched Spotify to \${tab.label}\`
							);
						}}
					/>
				</span>
			{/snippet}
			<!-- One shelf for both tabs: on Control my Music the rest of the rack
			     steps off the board and the communal record stands alone. -->
			<Ed3PlaylistShelf
				playlists={spotifyShelf}
				soloId={spotifyCommunal?.id ?? null}
				solo={spotifyView === 'control' && spotifyCommunal !== null}
				bind:plankWidth={spotifyPlankWidth}
			/>
			<!-- One now-playing line for both tabs: it stays mounted (and its
			     stream stays open) across a switch, and is held to the width of
			     whichever plank is above it.

			     \`glideHeight\`: the caption is one line until the stream answers
			     and two after it, so the section — and the whole page under it —
			     used to jump 22px the moment the song arrived. The section's own
			     glide will not catch this: it is too small for its floor and too
			     early for its arming delay, both of which are right for a box
			     that only moves when the reader asks it to. This one moves on
			     its own, so it watches for a single line and from the start. -->
			<div
				class="ed3__spotify-now"
				use:glideHeight={{ minPx: 6, armMs: 0 }}
				style:width={spotifyPlankWidth ? \`\${spotifyPlankWidth.toFixed(1)}px\` : undefined}
			>
				<Ed3SpotifyNowPlayingMarquee variant="stacked" bind:payload={spotifyNowPlaying} />
			</div>
			<!--
			  Always mounted, but only taking room on the Control tab: a drawer that
			  opens its height as the tab is chosen and closes it on the way back.
			  Mounted up front because mounting it mid-switch was jank — a component
			  mount on top of the shelf's busiest frames. The height is stepped in
			  whole pixels (see the effect on \`spotifyView\`), and the buttons fade
			  in as the record opens.
			-->
			<div
				bind:this={spotifyActionsEl}
				class="ed3__spotify-actions"
				class:ed3__spotify-actions--shown={spotifyView === 'control'}
				inert={spotifyView !== 'control'}
				aria-hidden={spotifyView !== 'control'}
			>
				<div class="ed3__spotify-actions-inner">
					<Ed3SpotifyControl
						nowPlaying={spotifyNowPlaying}
						playlist={spotifyCommunal}
						onplaylist={(next) => {
							spotifyCommunal = next;
						}}
					/>
				</div>
			</div>
		</Ed3HomeSection>

		<Ed3HomeSection section={SECTIONS.misc}>
			<ul class="ed3__music" aria-label={MISC.listLabel}>
				<!-- TEMPORARILY OFF — the "Who You Are" LGBM predictor row. Uncomment this
				     and the \`VisitorPredictor\` import at the top of the file together. -->
				<!--
				<li class="ed3__music-item">
					<span class="ed3__music-key">{MISC.predictor.key}</span>
					<div class="ed3__music-body">
						<VisitorPredictor />
					</div>
				</li>
				-->
				<li class="ed3__music-item">
					<!-- The key carries the jump. It used to be a "Jump to one" link closing
					     the copy, which left the row naming the thing and then naming the way
					     in — the key is already the way in, so it is the control now and the
					     copy is only what is on the other side of it.

					     Still a \`<span>\` around the button: the key column's baseline and
					     wrapping are set on the span, and a bare button as the grid item
					     would stretch the column and centre its own text. -->
					<span class="ed3__music-key">
						<button
							type="button"
							class="no-magnet ed3-link ed3__music-jump"
							data-analytics-ignore
							data-prediction-click="orbit_jump_now_clicks"
							onclick={viewSomeoneAwesome}
							aria-label={MISC.orbit.actionLabel}>{MISC.orbit.key}{MISC.orbit.keyArrow}</button
						>
					</span>
					<div class="ed3__music-body">
						<p class="ed3__music-copy" use:justifyCopyOnScroll={{ durationMs: 860, delay: 90 }}>
							{MISC.orbit.copy}
						</p>
					</div>
				</li>
			</ul>
		</Ed3HomeSection>
	</div>

	<div class="ed3__kid-finale">
		<div class="ed3__kid-finale__copy">
			<Ed3HomeSection section={SECTIONS.asAKid}>
				<p class="ed3__lede">
					{#each ED3_AS_A_KID.bodyParts as part}
						{#if 'activity' in part && part.activity}
							<span
								class="ed3__kid-flair"
								class:ed3__kid-flair--lit={kidHighlightActivity === part.activity}>{part.text}</span
							>
						{:else}
							{part.text}
						{/if}
					{/each}
				</p>
				<div class="ed3__kid-stage">
					{#if active}
						<Ed3AsAKidSphere bind:highlightActivity={kidHighlightActivity} />
					{/if}
				</div>
			</Ed3HomeSection>

			<!--
			  The last section before the footer, and the only one that asks for
			  anything. It sits inside the kid finale's column rather than back up
			  in \`.ed3__shell\` because that column is what the footer is measured
			  against — a contact form floating a screen above the footer's own
			  channels reads as two ways to reach the same person, offered twice.
			-->
			<Ed3ReceiptSection {active} />
		</div>

		<!-- The footer's own marker: the three channels are the plain way to reach
		     me, offered right under the one that prints a receipt at you. -->
		<Ed3Footer discordMemberCount={data.discordMemberCount} marker={FOOTER_MARKER} />
	</div>
</div>

<style>
	/* Tokens + shared base rules live in \`$lib/styles/ed3-shell.css\` (imported above).
	   Only page-specific tokens not covered there are declared here. */
	.ed3 {
		/* svh avoids mobile URL-bar vh jumps that resize the glass + shove the page. */
		--ed3-glass-h: clamp(38rem, 80svh, 56rem);
		/* Live viewers map — shorter than the polaroid glass so the section isn’t a full-viewport slab. */
		--ed3-analytics-h: clamp(16rem, 38svh, 22rem);
		--type-link-underline-rest-color: var(--ed3-meta);
		--type-link-underline-hover-color: var(--ed3-body);
		position: relative;
		isolation: isolate;
		letter-spacing: normal;
		-moz-osx-font-smoothing: grayscale;
		/* clip: abspos kid cards hanging past the footer must NOT grow page scroll. */
		overflow: clip;
	}

	/* Takes no room and paints nothing: it exists only so the gutter rail's
	   first tick has an element to resolve against. Block and zero-height so an
	   empty inline can never open a line box at the top of the frame. */
	.ed3__top-anchor {
		display: block;
		height: 0;
		/* "Me" is the top of the page, not a heading that wants breathing room
		   above it. A whole viewport of scroll margin makes the jump clamp to 0
		   however far down the frame itself starts — a dev banner today, whatever
		   sits above it tomorrow. The native \`#me\` landing agrees for free. */
		scroll-margin-top: 100vh;
	}

	.ed3__shell {
		position: relative;
		z-index: 1;
	}

	/* Side gutter media may paint past the column; keep y clipped. */
	.ed3__kid-stage {
		position: relative;
		width: 100%;
		margin-top: var(--ed3-space-4);
	}

	/* Kill hover fills on text links that lack the shared \`.ed3-link\` class — keep icon
	   magnets + circle CTAs (\`.ed3-link\` itself is handled sitewide by ed3-shell.css). */
	.ed3 :global(a.wpm-sec__link:hover),
	.ed3 :global(a.wpm-sec__link:focus-visible),
	.ed3 :global(a.wpm-sec__link:active),
	.ed3 :global(a.ed3-acc__link:hover),
	.ed3 :global(a.ed3-acc__link:focus-visible) {
		background-color: transparent !important;
	}

	.ed3__hero {
		position: relative;
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--ed3-space-block);
		margin-bottom: var(--ed3-space-block);
		background: transparent;
		overflow: visible;
	}

	/* Arrivals rise into place — the direction the list grows. */
	@keyframes ed3-hud-event-in {
		from {
			opacity: 0;
			transform: translateY(0.6rem);
		}
	}

	.ed3,
	:global(.ed3__chrome),
	:global(.site-footer-wrapper) {
		transition: opacity var(--dur-medium) var(--ease-out);
	}

	.ed3__hero-portrait {
		position: relative;
		width: min(11rem, 38vw);
		/* The baked crop — see scripts/build/halftone-portrait.ts. */
		aspect-ratio: 475 / 465;
		margin: 0;
	}

	.ed3__hero-portrait :global(.dither-image) {
		width: 100%;
		height: 100%;
	}

	/*
	  ── The display step, sixth call site ─────────────────────────────────────
	  Name / role / city, set exactly like \`/blog\`'s switcher: 30px / 500 /
	  −0.035em / 1.2, three names on one line with the one you are reading in
	  ink and the rest a step back. See \`--type-size-heading\` in typography.css
	  for the rule that step has to pass — the display size goes to *the name
	  of what you are looking at*, one per page. On \`/\` that was the section
	  markers, which name the page's parts; this names the page.

	  It was 14px grey, which is what a caption looks like: the first line of
	  the site read as a label on the portrait rather than as whose site this
	  is. Nothing above the markers competes with it, and the markers are the
	  same size, so the page opens and sections at one register.

	  The row already wraps — at this size it breaks between the flex items,
	  never inside a name, so a narrow column gives "Matthew Trent (🇨🇦→🇺🇸) /"
	  and then the other two, which is how the byline is read aloud anyway.
	*/
	.ed3__byline {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		/* The switcher's gap, for the same reason: at 30px the letterforms
		   carry the separation and 8px around a slash is a hole. */
		gap: var(--ed3-space-1) 0.375rem;
		margin: 0;
		font-size: var(--type-size-heading);
		font-weight: var(--font-weight-medium);
		line-height: var(--type-line-height-heading);
		letter-spacing: var(--type-tracking-heading);
		color: var(--ed3-meta);
	}

	/* The name is the one in ink; role and city are the other two things this
	   line could say, exactly as the two tabs you are not on. */
	.ed3__byline-name {
		color: var(--ed3-ink);
	}

	.ed3__byline-strong {
		color: var(--ed3-meta);
	}

	.ed3__byline-glyphs {
		cursor: default;
		white-space: nowrap;
		/* Not a control: no tap flash, no callout, no selection over a swap. */
		-webkit-tap-highlight-color: transparent;
		-webkit-touch-callout: none;
		user-select: none;
	}

	/*
	  Fixed box so the swap never reflows the byline: flags are wider than most
	  emoji. 1.15em, not the 1.35 this held at 14px — the slack is in \`em\`, so
	  the display step multiplied it into a visible hole on each side of both
	  flags and the parenthetical read as "( 🇨🇦 → 🇺🇸 )". The strut is a flag,
	  the widest thing that can land here, so the box only needs enough over it
	  to keep a stray glyph off the arrow.
	*/
	.ed3__byline-glyph {
		display: inline-block;
		position: relative;
		width: 1.15em;
		text-align: center;
		vertical-align: baseline;
	}

	/* Invisible flag holds the box open and sets the baseline; the faces float over it. */
	.ed3__byline-glyph-strut {
		visibility: hidden;
	}

	/*
	  Stacked so the outgoing and incoming faces genuinely overlap mid-swap.
	  Every face stays mounted; \`glyphRoll\` writes its visibility, opacity and
	  rise inline. No \`will-change\`: it held nine permanent layers here, and
	  Safari draws text in a layer with its own snapping and greyscale AA, so the
	  swap letters never quite matched the letters beside them.
	*/
	.ed3__byline-glyph-face {
		position: absolute;
		inset: 0;
		display: block;
	}

	/* Faces that start hidden, for the server render; \`glyphRoll\` owns it after. */
	.ed3__byline-face--alt {
		visibility: hidden;
	}

	.ed3__byline-role {
		cursor: default;
		white-space: pre;
		-webkit-tap-highlight-color: transparent;
		-webkit-touch-callout: none;
		user-select: none;
	}

	/*
	  Same fixed-box trick as the flags, per letter: the invisible original holds
	  the width, so a wider symbol (∈, α) spills over its neighbours for the swap
	  instead of pushing "/ SF" along.
	*/
	.ed3__byline-letter {
		display: inline-block;
		position: relative;
		vertical-align: baseline;
	}

	.ed3__byline-letter-strut {
		visibility: hidden;
	}

	/*
	  The letter keeps the heading's tracking, so the plain face lands on exactly
	  the pixels of the strut it covers — with \`letter-spacing: 0\` and
	  \`text-align: center\` it sat half a tracking off, and the resting role read
	  as unevenly spaced. Flex centres a wider symbol over both neighbours, where
	  \`text-align\` start-aligns anything that overflows.
	*/
	.ed3__byline-letter-face {
		position: absolute;
		inset: 0;
		display: flex;
		justify-content: center;
	}

	/* Punctuation between names, not a fourth name — regular weight, a step
	   lighter than the grey it divides. Same as the switcher's slash. */
	.ed3__byline-slash {
		color: var(--ed3-meta);
		font-weight: var(--font-weight-normal);
		user-select: none;
		opacity: 0.45;
	}

	/* Leading is deliberately absent: both are running prose and take
	   \`--ed3-leading-prose\` from the \`:is()\` rule in \`ed3-shell.css\`. Restating
	   \`--ed3-leading\` here ties that rule on specificity, so which leading the
	   hero gets comes down to stylesheet order — bundled one way in the build,
	   the other way by Vite's dev injection, which is what made the block snap
	   down a second into a dev load. Same reason \`.wk__desc\` sets none. */
	.ed3__obsessed,
	.ed3__lede {
		margin: 0;
		max-width: var(--ed3-measure);
		font-size: var(--ed3-size);
		color: var(--ed3-body);
	}

	/*
	  Air under the section marker before the copy starts.

	  The marker's own bottom margin is the block step (12px), which is the right
	  rhythm between blocks *inside* a section but too tight directly under the
	  heading — especially where the heading is a row with tabs beside it, so the
	  label and the first line of prose ran together.

	  This is the *total*, not an addition: adjacent vertical margins collapse to the
	  larger of the two, so setting a second block step here changed nothing at all.
	  It has to exceed the marker's own 12px to have any effect.
	*/
	.ed3__kid-flair {
		color: inherit;
		transition: color var(--dur-fast) ease;
	}

	.ed3__kid-flair--lit {
		color: var(--ed3-accent);
	}

	@media (prefers-reduced-motion: reduce) {
		.ed3__kid-flair {
			transition: none;
		}
	}

	.ed3__tldr {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: var(--ed3-space-2) var(--ed3-space-4);
		width: 100%;
		margin: var(--ed3-space-1) 0 0;
		padding: 0;
		list-style: none;
	}

	.ed3__tldr--stack {
		grid-template-columns: 1fr;
		margin: 0;
		padding: 0;
	}

	/*
	  The clip used to hang in the page gutter. The wide frame has no gutter, so
	  it rides between the copy and the reply column instead — same peek, same
	  tilt, just inside the section.
	*/
	.ed3__hacking-layout {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 15.5rem);
		align-items: start;
		gap: var(--ed3-space-block) var(--ed3-space-4);
		width: 100%;
		/* Match section-title → content rhythm. */
		margin-top: var(--ed3-space-3);
	}

	.ed3__hacking-main {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		min-width: 0;
	}

	.ed3__tldr-item {
		display: flex;
		align-items: flex-start;
		gap: var(--ed3-space-2);
		min-width: 0;
	}

	.ed3__tldr-bullet {
		flex: 0 0 auto;
		width: 0.72rem;
		height: 0.72rem;
		margin-top: 0.25rem;
		background: var(--ed3-ink);
		border-radius: var(--ed3-radius-round);
	}

	.ed3__tldr-copy {
		flex: 1 1 auto;
		min-width: 0;
	}

	/* Prose leading, from \`ed3-shell.css\` — see \`.ed3__obsessed\` above. */
	.ed3__tldr-text {
		min-width: 0;
		font-size: var(--ed3-size);
		color: var(--ed3-ink);
	}

	.ed3__tldr-text--link {
		/* Underline sweep via global \`.ed3-link\` — keep inline for per-line clone. */
		color: var(--ed3-ink);
	}

	.ed3__lede {
		margin-bottom: var(--ed3-space-block);
		font-size: var(--ed3-size);
	}

	/* The book carries its own instrument row and the air under it, so this is the
	   remainder of a block step rather than a full one. */

	/* The two halves of the education section: ticket grid, then the classes band.
	   A section step rather than a block step — the band is full-bleed and needs
	   clearance from the card grid to read as a separate register. */
	.ed3__education-classes {
		margin-top: var(--ed3-space-section);
	}

	/*
	  The live track as the Playlists heading's right-hand control. Same slot the
	  blog tabs and the projects filter use, so it takes the same treatment: meta
	  ink, body weight, hard against the right rail.

	  The right rail is the row's job now, not this rule's: \`margin-left: auto\`
	  came off when \`.ed3__section-heading\` moved to \`justify-content:
	  space-between\`. An auto margin belongs to the item and survives a wrap, so
	  on a phone — where this row does wrap — it left the track flush right on a
	  line of its own under a left-aligned "Playlists", which is what the tabs
	  were doing too before they lost the same margin.

	  It shrinks rather than grows — the row variant already ellipsises a long
	  track name, and half the frame is as much of the rule as a piece of live
	  trivia should be allowed to take from the label.
	*/
	/* Under the shelf, no wider than its plank (width set inline). */
	.ed3__spotify-now {
		max-width: 100%;
		margin: 1rem auto 0;
	}

	/* A 0fr ↔ 1fr drawer, like the accordion panels. Its buttons fade in as the
	   record swings open and out at once when the tab changes. */
	.ed3__spotify-actions {
		display: grid;
		grid-template-rows: 0fr;
		overflow-anchor: none;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 180ms ease-out,
			visibility 0s linear 180ms;
	}

	.ed3__spotify-actions--shown {
		/* Pinned to the pixel grid once an open completes — see \`animate-track\`. */
		grid-template-rows: var(--track-rest, 1fr);
		opacity: 1;
		visibility: visible;
		transition:
			opacity var(--dur-fast, 140ms) ease-out,
			visibility 0s linear 0s;
	}

	.ed3__spotify-actions-inner {
		min-height: 0;
		overflow: hidden;
	}

	@media (prefers-reduced-motion: reduce) {
		.ed3__spotify-actions,
		.ed3__spotify-actions--shown {
			transition: none;
		}
	}

	/* Inside the now-playing line, not in the heading row: the bars are a 0.9rem
	   box beside the track name, and on the name's baseline rather than the
	   middle of its line they stand on the type instead of floating in it. */
	.ed3__music {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.ed3__music-item {
		display: grid;
		grid-template-columns: minmax(7.5rem, 11.5rem) minmax(0, 1fr);
		gap: var(--ed3-space-3) var(--ed3-space-4);
		align-items: baseline;
		padding: var(--ed3-space-row) 0;
	}

	/* The body's only child is the justified \`<p>\`, whose rows are themselves
	   blocks, so grid baseline alignment finds no first line box to sit on and
	   drops the row key to the bottom of the block. Key and copy share font-size
	   and leading, so start-alignment lands the key on the copy's first line —
	   where baseline alignment was meant to put it. */
	.ed3__music-item:has(.ed3__music-copy) {
		align-items: start;
	}

	.ed3__music-key {
		font-size: var(--ed3-size);
		line-height: var(--ed3-leading);
		color: var(--ed3-ink);
	}

	/* A key that is also a control stays a key: ink, not the link colour the
	   shell paints every \`button.ed3-link\` — the underline is the only thing
	   that marks it, the same as the controls in the body column beside it.
	   \`!important\` and the two classes are both needed to outrank
	   \`.ed3 button.ed3-link { color: var(--type-link-color) !important }\`. */
	.ed3__music-key .ed3__music-jump {
		color: var(--ed3-ink) !important;
	}

	.ed3__music-body {
		min-width: 0;
		font-size: var(--ed3-size);
		line-height: var(--ed3-leading);
		color: var(--ed3-meta);
	}

	/* The now-playing selectors that used to be listed here went with the row —
	   the live track reads as a clause in the playlists lede now, not as an
	   entry in this table. */
	.ed3__music-body :global(a),
	.ed3__music-body :global(button.ed3-link),
	.ed3__music-body :global(.ed3-misc-radio__main),
	.ed3__music-body :global(.ed3-misc-radio__skip) {
		color: var(--ed3-ink) !important;
	}

	/* Justified-on-scroll copy (\`justifyCopyOnScroll\`): the action replaces the
	   paragraph's text with one nowrap \`<span>\` per line and animates each line's
	   word-spacing out to the column width. Rows must therefore be blocks that
	   never re-wrap — if they wrap, the spread overflows the column. */
	.ed3__music-copy {
		margin: 0;
		/* A bare \`p { color: var(--color-text) }\` reset in the shell outranks the
		   grey inherited from \`.ed3__music-body\`, so the row has to say it again —
		   the table's copy is meta and only its control is ink. */
		color: var(--ed3-meta);
		text-align: left;
		text-wrap: wrap;
		hyphens: manual;
	}

	.ed3__music-copy :global(.justify-copy-line) {
		display: block;
		width: 100%;
		white-space: nowrap;
		contain: layout style;
	}

	/* Last line stays ragged — the \`text-align-last: left\` rule for justified copy. */
	.ed3__music-copy :global(.justify-copy-line--last) {
		word-spacing: normal;
	}

	/* The jump control: a button that has to set like the text around it — the
	   row key it now is, and the inline link it used to be in the copy. */
	.ed3__music-jump {
		display: inline !important;
		max-width: 100%;
		margin: 0;
		padding: 0;
		border: none;
		background: transparent !important;
		font: inherit;
		font-size: inherit;
		line-height: inherit;
		color: var(--ed3-ink) !important;
		cursor: pointer;
		text-align: left;
		box-shadow: none !important;
		vertical-align: baseline;
	}

	.ed3__music-jump:hover,
	.ed3__music-jump:focus-visible,
	.ed3__music-jump:active {
		background: transparent !important;
		box-shadow: none !important;
	}

	:global(html body a.ed3-spotify-now__title),
	:global(html body a.ed3-spotify-now__title:link),
	:global(html body a.ed3-spotify-now__title:visited),
	:global(html body a.ed3-spotify-now__title:active) {
		display: block !important;
		width: max-content;
		max-width: 100%;
		overflow: hidden;
		color: var(--ed3-ink) !important;
	}

	.ed3__music-body :global(.ed3-spotify-now) {
		width: fit-content;
		max-width: 100%;
	}

	.ed3__music-body :global(.ed3-spotify-now__line) {
		display: flex;
		align-items: baseline;
		flex: 0 1 auto;
		min-width: 0;
		max-width: 100%;
		overflow: hidden;
	}

	.ed3__music-body :global(.ed3-spotify-now__track) {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.ed3__music-body :global(.ed3-spotify-now__ago) {
		flex: 0 0 auto;
		white-space: nowrap;
		pointer-events: none;
	}

	.ed3__music-body :global(.ed3-spotify-now__bar) {
		background: var(--ed3-ink);
	}

	/*
	  Section header = title with the hairline directly beneath it. The rule belongs
	  to the section it opens, not to the gap between sections.
	*/
	/* Box, dashed rule, rail crosses and the label type all live in ed3-shell.css
	   so the home sections and \`.wpm-sec\` share one definition. */

	/*
	  The three lists, stacked one on top of another.

	  The shown pane is the only one in flow, so the section is exactly as tall as
	  what you are reading and switching tabs still resizes it. The other two are
	  taken out of flow rather than out of the document: they keep a real box, so
	  their thumbnails load and their canvases paint long before the tab is
	  clicked, which is the whole point of keeping them.

	  \`opacity\` and not \`display: none\` for the same reason — a display-none
	  subtree has no layout, so \`loading="lazy"\` never fires inside it and the
	  switch would be back to fetching three images on the click.

	  And \`opacity\` rather than \`visibility\`, which was the obvious choice and
	  does not work here: \`DitherImage\` writes \`visibility\` straight onto its own
	  canvas element as it paints, and a descendant's \`visibility: visible\` beats
	  an ancestor's \`hidden\`. The hidden panes' prints came back and stacked on top
	  of the shown list. Opacity can't be undone from below.

	  \`inert\` + \`aria-hidden\` on the panes themselves are what keep the two hidden
	  lists out of the tab order and off the accessibility tree — an
	  opacity-0 subtree is still both.
	*/
	/* "Stats / Catch 'em All" and its ": Countries", on one baseline at the row's end. */
	.ed3__numbers-control {
		display: inline-flex;
		flex-wrap: wrap;
		align-items: baseline;
		justify-content: flex-end;
		min-width: 0;
	}

	.ed3__blog-panes {
		position: relative;
	}

	.ed3__blog-pane {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		opacity: 0;
		pointer-events: none;
	}

	.ed3__blog-pane--shown {
		position: static;
		opacity: 1;
		pointer-events: auto;
	}

	.ed3__kid-finale {
		position: relative;
		z-index: 1;
		overflow: visible;
	}

	.ed3__kid-finale__copy {
		box-sizing: border-box;
		width: 100%;
		max-width: var(--ed3-max);
		margin-inline: auto;
		padding-inline: var(--ed3-pad-text);
	}

	@media (max-width: 560px) {
		.ed3__tldr {
			grid-template-columns: 1fr;
		}

		.ed3__hacking-layout {
			grid-template-columns: 1fr;
			/* Stacked, the reply sits under the last bullet: the frame pad of air,
			   so the thread reads as its own thing rather than a fourth point. A
			   block step (12px) was too little — the first bubble sat on the last
			   bullet's heels and read as a continuation of the list. */
			row-gap: var(--ed3-step-32);
		}

		.ed3__music-item {
			grid-template-columns: 1fr;
			gap: var(--ed3-space-1);
		}
	}
</style>
`;export{t as default};
