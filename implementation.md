# Harness Presentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 15-slide SvelteKit presentation app with the Crucible theme, embedded video/screenshot containers, keyboard navigation, and static build output portable to any machine.

**Architecture:** Standalone SvelteKit project at `presentation/` (not part of the harness workspace). Single-page app: one `+page.svelte` renders the current slide from a navigation store. Each slide is its own Svelte component composed from reusable layout and UI components. Static adapter produces a self-contained build.

**Tech Stack:** SvelteKit + adapter-static, TypeScript, Svelte 5 (runes), CSS custom properties (Crucible theme), vitest (navigation store tests only)

**References:**

- Design spec: `presentation/design.md`
- Theme spec: `presentation/crucible.md`

---

## File Structure

```
presentation/
├── src/
│   ├── app.html                        # HTML shell
│   ├── app.css                         # Crucible global theme
│   ├── lib/
│   │   ├── navigation.svelte.ts        # Slide index store + keyboard handler
│   │   ├── Slide.svelte                # Base slide container with transitions
│   │   ├── ProgressBar.svelte          # Bottom amber progress bar
│   │   ├── Card.svelte                 # Content card (default, accent, highlight)
│   │   ├── Badge.svelte                # Status badge/tag
│   │   ├── CodeBlock.svelte            # Code display with token colors
│   │   ├── VideoPlayer.svelte          # Video container with glow on play
│   │   ├── Screenshot.svelte           # Screenshot frame
│   │   ├── BeforeAfter.svelte          # Side-by-side with arrow
│   │   ├── TierDiagram.svelte          # Module architecture visualization
│   │   ├── FlowDiagram.svelte          # State machine horizontal flow
│   │   ├── Timeline.svelte             # Roadmap horizontal progression
│   │   └── slides/
│   │       ├── S01Title.svelte
│   │       ├── S02Problem.svelte
│   │       ├── S03Hook.svelte
│   │       ├── S04Intake.svelte
│   │       ├── S05Dispatch.svelte
│   │       ├── S06Question.svelte
│   │       ├── S07Pipeline.svelte
│   │       ├── S08Review.svelte
│   │       ├── S09Architecture.svelte
│   │       ├── S10StateMachine.svelte
│   │       ├── S11Guardrails.svelte
│   │       ├── S12Profiles.svelte
│   │       ├── S13Roadmap.svelte
│   │       ├── S14TheAsk.svelte
│   │       └── S15GameReveal.svelte
│   └── routes/
│       ├── +layout.svelte              # Keyboard listener + progress bar
│       └── +page.svelte                # Renders current slide
├── static/
│   ├── videos/                         # User drops mp4 recordings here
│   │   └── .gitkeep
│   └── screenshots/                    # User drops png/webp here
│       └── .gitkeep
├── tests/
│   └── navigation.test.ts             # Navigation store unit tests
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
├── crucible.md                         # (already exists)
└── design.md                           # (already exists)
```

---

### Task 1: Scaffold SvelteKit Project

**Files:**

- Create: `presentation/package.json`
- Create: `presentation/svelte.config.js`
- Create: `presentation/vite.config.ts`
- Create: `presentation/tsconfig.json`
- Create: `presentation/src/app.html`
- Create: `presentation/src/routes/+layout.svelte`
- Create: `presentation/src/routes/+page.svelte`
- Create: `presentation/static/videos/.gitkeep`
- Create: `presentation/static/screenshots/.gitkeep`

- [ ] **Step 1: Create package.json**

```json
{
	"name": "harness-presentation",
	"version": "1.0.0",
	"private": true,
	"type": "module",
	"scripts": {
		"dev": "vite dev",
		"build": "vite build",
		"preview": "vite preview",
		"test": "vitest run"
	},
	"devDependencies": {
		"@sveltejs/adapter-static": "^3.0.0",
		"@sveltejs/kit": "^2.0.0",
		"@sveltejs/vite-plugin-svelte": "^4.0.0",
		"svelte": "^5.0.0",
		"typescript": "^5.0.0",
		"vite": "^6.0.0",
		"vitest": "^3.0.0"
	}
}
```

- [ ] **Step 2: Create svelte.config.js**

```js
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: true,
		}),
	},
};

export default config;
```

- [ ] **Step 3: Create vite.config.ts**

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
});
```

- [ ] **Step 4: Create tsconfig.json**

```json
{
	"extends": "./.svelte-kit/tsconfig.json",
	"compilerOptions": {
		"allowJs": true,
		"checkJs": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"resolveJsonModule": true,
		"skipLibCheck": true,
		"sourceMap": true,
		"strict": true,
		"moduleResolution": "bundler"
	}
}
```

- [ ] **Step 5: Create src/app.html**

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link
			href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
			rel="stylesheet"
		/>
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

- [ ] **Step 6: Create placeholder routes**

`src/routes/+layout.svelte`:

```svelte
<script>
	import '../app.css';
	let { children } = $props();
</script>

{@render children()}
```

`src/routes/+page.svelte`:

```svelte
<h1>Presentation loading...</h1>
```

- [ ] **Step 7: Create static asset directories**

```bash
mkdir -p presentation/static/videos presentation/static/screenshots
touch presentation/static/videos/.gitkeep presentation/static/screenshots/.gitkeep
```

- [ ] **Step 8: Install dependencies and verify dev server starts**

```bash
cd presentation && npm install && npm run dev -- --port 4173
```

Expected: SvelteKit dev server starts on port 4173, shows "Presentation loading..." in browser.

- [ ] **Step 9: Commit**

```bash
git add presentation/
git commit -m "+ (presentation) scaffold SvelteKit project with adapter-static"
```

---

### Task 2: Crucible Global Theme

**Files:**

- Create: `presentation/src/app.css`

- [ ] **Step 1: Write the Crucible CSS with all variables, font assignments, and base styles**

```css
/* ── Crucible Theme ──────────────────────────────────────────────────────── */
/* Where Foundry is the operator console, Crucible is the presentation stage */

/* ── Custom Properties ───────────────────────────────────────────────────── */
:root {
	/* Surface */
	--cr-bg: #0c0a08;
	--cr-surface: #171310;
	--cr-surface-alt: #221e19;
	--cr-surface-hot: #2d2720;

	/* Text */
	--cr-text: #f0e8d8;
	--cr-text-mid: #b8ad9c;
	--cr-text-dim: #787064;

	/* Accent */
	--cr-amber: #e8a230;
	--cr-amber-glow: #f0b848;
	--cr-amber-dim: #a07828;
	--cr-copper: #c8713a;
	--cr-ember: #b54a3a;
	--cr-moss: #5a8a5a;

	/* Structural */
	--cr-rule: #2a2520;
	--cr-rule-bright: #3d362e;

	/* Fonts */
	--font-display: 'Syne', sans-serif;
	--font-body: 'Manrope', sans-serif;
	--font-mono: 'JetBrains Mono', monospace;
}

/* ── Reset ───────────────────────────────────────────────────────────────── */
*,
*::before,
*::after {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

html,
body {
	width: 100%;
	height: 100%;
	overflow: hidden;
	background: var(--cr-bg);
	color: var(--cr-text);
	font-family: var(--font-body);
	font-size: 16px;
	line-height: 1.5;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}

/* ── Utility Classes ─────────────────────────────────────────────────────── */
.section-label {
	font-family: var(--font-display);
	font-size: 0.75rem;
	font-weight: 600;
	letter-spacing: 0.15em;
	text-transform: uppercase;
	color: var(--cr-amber);
	margin-bottom: 8px;
}

.slide-title {
	font-family: var(--font-display);
	font-size: 3rem;
	font-weight: 700;
	letter-spacing: -0.02em;
	color: var(--cr-text);
	line-height: 1.15;
	margin-bottom: 12px;
}

.slide-subtitle {
	font-family: var(--font-body);
	font-size: 1.25rem;
	font-weight: 400;
	color: var(--cr-text-mid);
	margin-bottom: 24px;
}

.body-text {
	font-family: var(--font-body);
	font-size: 1.125rem;
	font-weight: 400;
	color: var(--cr-text-mid);
	line-height: 1.7;
}

/* ── Layout Grids ────────────────────────────────────────────────────────── */
.split-2 {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 32px;
}

.split-3 {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 24px;
}

.split-4 {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	gap: 20px;
}

.grid-2x3 {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
}

.split-wide {
	display: grid;
	grid-template-columns: 1.5fr 1fr;
	gap: 40px;
}
```

- [ ] **Step 2: Verify theme loads in dev server**

Refresh `http://localhost:4173`. Page should have dark warm background, cream-colored "Presentation loading..." text in Manrope font.

- [ ] **Step 3: Commit**

```bash
git add presentation/src/app.css
git commit -m "+ (presentation) crucible global theme"
```

---

### Task 3: Navigation Store

**Files:**

- Create: `presentation/src/lib/navigation.svelte.ts`
- Create: `presentation/tests/navigation.test.ts`

- [ ] **Step 1: Write the failing tests**

`presentation/tests/navigation.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createNavigation } from '../src/lib/navigation.svelte.ts';

describe('navigation', () => {
	let nav: ReturnType<typeof createNavigation>;

	beforeEach(() => {
		nav = createNavigation(15);
	});

	it('starts at slide 0', () => {
		expect(nav.current).toBe(0);
	});

	it('advances to next slide', () => {
		nav.next();
		expect(nav.current).toBe(1);
	});

	it('goes to previous slide', () => {
		nav.next();
		nav.next();
		nav.prev();
		expect(nav.current).toBe(1);
	});

	it('does not go below 0', () => {
		nav.prev();
		expect(nav.current).toBe(0);
	});

	it('does not exceed total - 1', () => {
		for (let i = 0; i < 20; i++) nav.next();
		expect(nav.current).toBe(14);
	});

	it('goTo jumps to specific slide', () => {
		nav.goTo(7);
		expect(nav.current).toBe(7);
	});

	it('goTo clamps out-of-range values', () => {
		nav.goTo(99);
		expect(nav.current).toBe(14);
		nav.goTo(-5);
		expect(nav.current).toBe(0);
	});

	it('reports progress as fraction', () => {
		expect(nav.progress).toBe(0);
		nav.goTo(7);
		expect(nav.progress).toBeCloseTo(7 / 14);
		nav.goTo(14);
		expect(nav.progress).toBe(1);
	});
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd presentation && npx vitest run
```

Expected: FAIL — module `navigation.svelte.ts` does not exist.

- [ ] **Step 3: Implement the navigation store**

`presentation/src/lib/navigation.svelte.ts`:

```ts
export function createNavigation(total: number) {
	let current = $state(0);

	function clamp(n: number): number {
		return Math.max(0, Math.min(total - 1, n));
	}

	return {
		get current() {
			return current;
		},
		get total() {
			return total;
		},
		get progress() {
			return total <= 1 ? 0 : current / (total - 1);
		},
		next() {
			current = clamp(current + 1);
		},
		prev() {
			current = clamp(current - 1);
		},
		goTo(n: number) {
			current = clamp(n);
		},
	};
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd presentation && npx vitest run
```

Expected: all 8 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add presentation/src/lib/navigation.svelte.ts presentation/tests/navigation.test.ts
git commit -m "+ (presentation) navigation store with tests"
```

---

### Task 4: Slide Component + ProgressBar + Layout

**Files:**

- Create: `presentation/src/lib/Slide.svelte`
- Create: `presentation/src/lib/ProgressBar.svelte`
- Modify: `presentation/src/routes/+layout.svelte`

- [ ] **Step 1: Create the base Slide component**

`presentation/src/lib/Slide.svelte`:

```svelte
<script lang="ts">
	import { type Snippet } from 'svelte';

	interface Props {
		centered?: boolean;
		noNumber?: boolean;
		number?: number;
		total?: number;
		children: Snippet;
	}

	let { centered = false, noNumber = false, number = 0, total = 0, children }: Props = $props();
</script>

<div class="slide" class:slide--centered={centered}>
	<div class="slide-content">
		{@render children()}
	</div>
	{#if !noNumber && number > 0}
		<div class="slide-number">
			{String(number).padStart(2, '0')} / {String(total).padStart(2, '0')}
		</div>
	{/if}
</div>

<style>
	.slide {
		width: 100vw;
		height: 100vh;
		padding: 64px 80px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		overflow: hidden;
		position: relative;
		background:
			radial-gradient(ellipse 80% 60% at 50% 40%, rgba(23, 19, 16, 0.6) 0%, transparent 100%),
			var(--cr-bg);
	}

	.slide--centered {
		align-items: center;
		text-align: center;
	}

	.slide-content {
		width: 100%;
		max-width: 100%;
		animation: slide-enter 0.4s ease-out both;
	}

	.slide-content > :global(:nth-child(1)) { animation-delay: 0ms; }
	.slide-content > :global(:nth-child(2)) { animation-delay: 80ms; }
	.slide-content > :global(:nth-child(3)) { animation-delay: 160ms; }
	.slide-content > :global(:nth-child(4)) { animation-delay: 240ms; }
	.slide-content > :global(:nth-child(5)) { animation-delay: 320ms; }
	.slide-content > :global(:nth-child(6)) { animation-delay: 400ms; }

	.slide-content > :global(*) {
		animation: child-enter 0.4s ease-out both;
	}

	@keyframes child-enter {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes slide-enter {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.slide-number {
		position: absolute;
		bottom: 24px;
		right: 40px;
		font-family: var(--font-body);
		font-weight: 300;
		font-size: 0.75rem;
		letter-spacing: 0.05em;
		color: var(--cr-text-dim);
	}
</style>
```

- [ ] **Step 2: Create the ProgressBar component**

`presentation/src/lib/ProgressBar.svelte`:

```svelte
<script lang="ts">
	interface Props {
		progress: number;
	}

	let { progress }: Props = $props();
</script>

<div class="progress-bar">
	<div class="progress-fill" style="width: {progress * 100}%"></div>
</div>

<style>
	.progress-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--cr-rule);
		z-index: 100;
	}

	.progress-fill {
		height: 100%;
		background: var(--cr-amber);
		transition: width 0.3s ease;
	}
</style>
```

- [ ] **Step 3: Wire up the layout with keyboard navigation**

`presentation/src/routes/+layout.svelte`:

```svelte
<script lang="ts">
	import '../app.css';
	import { createNavigation } from '$lib/navigation.svelte.ts';
	import ProgressBar from '$lib/ProgressBar.svelte';
	import { setContext } from 'svelte';

	let { children } = $props();

	const nav = createNavigation(15);
	setContext('nav', nav);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight' || e.key === ' ') {
			e.preventDefault();
			nav.next();
		} else if (e.key === 'ArrowLeft') {
			e.preventDefault();
			nav.prev();
		} else if (e.key === 'f') {
			document.documentElement.requestFullscreen?.();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{@render children()}
<ProgressBar progress={nav.progress} />
```

- [ ] **Step 4: Verify in dev server**

Update `+page.svelte` temporarily to test:

```svelte
<script>
	import { getContext } from 'svelte';
	import Slide from '$lib/Slide.svelte';
	const nav = getContext('nav');
</script>

<Slide number={nav.current + 1} total={nav.total}>
	<p class="section-label">TESTING</p>
	<h1 class="slide-title">Slide {nav.current + 1}</h1>
	<p class="slide-subtitle">Press arrow keys to navigate</p>
</Slide>
```

Open `http://localhost:4173`. Should show "Slide 1" with Crucible styling, amber progress bar at bottom. Arrow keys should change the slide number. Title should fade-up on entry.

- [ ] **Step 5: Commit**

```bash
git add presentation/src/lib/Slide.svelte presentation/src/lib/ProgressBar.svelte presentation/src/routes/+layout.svelte presentation/src/routes/+page.svelte
git commit -m "+ (presentation) slide component, progress bar, keyboard navigation"
```

---

### Task 5: Card, Badge, CodeBlock Components

**Files:**

- Create: `presentation/src/lib/Card.svelte`
- Create: `presentation/src/lib/Badge.svelte`
- Create: `presentation/src/lib/CodeBlock.svelte`

- [ ] **Step 1: Create Card component**

`presentation/src/lib/Card.svelte`:

```svelte
<script lang="ts">
	import { type Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'accent' | 'highlight';
		children: Snippet;
	}

	let { variant = 'default', children }: Props = $props();
</script>

<div class="card card--{variant}">
	{@render children()}
</div>

<style>
	.card {
		background: var(--cr-surface);
		border: 1px solid var(--cr-rule);
		border-radius: 6px;
		padding: 20px 24px;
	}

	.card--accent {
		border-left: 3px solid var(--cr-amber);
	}

	.card--highlight {
		background: var(--cr-surface-alt);
		border-color: var(--cr-amber-dim);
	}

	.card :global(h3) {
		font-family: var(--font-display);
		font-size: 1.25rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: var(--cr-text);
		margin-bottom: 6px;
	}

	.card :global(p) {
		font-family: var(--font-body);
		font-size: 0.9375rem;
		color: var(--cr-text-mid);
		line-height: 1.6;
	}

	.card :global(.card-label) {
		font-family: var(--font-display);
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--cr-amber);
		margin-bottom: 6px;
	}
</style>
```

- [ ] **Step 2: Create Badge component**

`presentation/src/lib/Badge.svelte`:

```svelte
<script lang="ts">
	interface Props {
		variant?: 'shipped' | 'next' | 'planned' | 'vision' | 'auto' | 'agent' | 'human';
		children: import('svelte').Snippet;
	}

	let { variant = 'shipped', children }: Props = $props();
</script>

<span class="badge badge--{variant}">
	{@render children()}
</span>

<style>
	.badge {
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding: 3px 10px;
		border-radius: 3px;
		display: inline-block;
	}

	.badge--shipped { background: var(--cr-moss);     color: var(--cr-bg); }
	.badge--next    { background: var(--cr-amber);     color: var(--cr-bg); }
	.badge--planned { background: var(--cr-text-dim);  color: var(--cr-bg); }
	.badge--vision  { background: var(--cr-copper);    color: var(--cr-bg); }
	.badge--auto    { background: var(--cr-moss);      color: var(--cr-bg); }
	.badge--agent   { background: var(--cr-copper);    color: var(--cr-bg); }
	.badge--human   { background: var(--cr-amber);     color: var(--cr-bg); }
</style>
```

- [ ] **Step 3: Create CodeBlock component**

`presentation/src/lib/CodeBlock.svelte`:

```svelte
<script lang="ts">
	interface Props {
		children: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<pre class="code-block">{@render children()}</pre>

<style>
	.code-block {
		background: var(--cr-surface-alt);
		border: 1px solid var(--cr-rule);
		border-radius: 4px;
		padding: 20px 24px;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		line-height: 1.7;
		color: var(--cr-text-mid);
		overflow-x: auto;
		white-space: pre;
	}

	.code-block :global(.key)     { color: var(--cr-amber); }
	.code-block :global(.str)     { color: var(--cr-moss); }
	.code-block :global(.num)     { color: var(--cr-copper); }
	.code-block :global(.comment) { color: var(--cr-text-dim); }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add presentation/src/lib/Card.svelte presentation/src/lib/Badge.svelte presentation/src/lib/CodeBlock.svelte
git commit -m "+ (presentation) card, badge, code block components"
```

---

### Task 6: VideoPlayer, Screenshot, BeforeAfter Components

**Files:**

- Create: `presentation/src/lib/VideoPlayer.svelte`
- Create: `presentation/src/lib/Screenshot.svelte`
- Create: `presentation/src/lib/BeforeAfter.svelte`

- [ ] **Step 1: Create VideoPlayer with glow-on-play**

`presentation/src/lib/VideoPlayer.svelte`:

```svelte
<script lang="ts">
	interface Props {
		src: string;
		caption?: string;
	}

	let { src, caption }: Props = $props();
	let playing = $state(false);
	let videoEl: HTMLVideoElement | undefined = $state();

	function toggle() {
		if (!videoEl) return;
		if (videoEl.paused) {
			videoEl.play();
			playing = true;
		} else {
			videoEl.pause();
			playing = false;
		}
	}

	function onEnded() {
		playing = false;
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="video-container" class:playing onclick={toggle}>
	<video bind:this={videoEl} {src} onended={onEnded} preload="metadata">
		<track kind="captions" />
	</video>
	{#if !playing}
		<div class="play-overlay">
			<div class="play-icon">&#9654;</div>
		</div>
	{/if}
	{#if caption}
		<div class="video-caption">{caption}</div>
	{/if}
</div>

<style>
	.video-container {
		border: 2px solid var(--cr-amber-dim);
		border-radius: 8px;
		overflow: hidden;
		position: relative;
		background: var(--cr-bg);
		cursor: pointer;
		transition: border-color 0.3s ease, box-shadow 0.5s ease;
	}

	.video-container.playing {
		border-color: var(--cr-amber);
		box-shadow: 0 0 30px rgba(232, 162, 48, 0.12);
	}

	video {
		width: 100%;
		display: block;
	}

	.play-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(12, 10, 8, 0.4);
	}

	.play-icon {
		font-size: 2.5rem;
		color: var(--cr-amber);
		filter: drop-shadow(0 0 12px rgba(232, 162, 48, 0.3));
	}

	.video-caption {
		padding: 8px 16px;
		font-family: var(--font-body);
		font-size: 0.8rem;
		color: var(--cr-text-dim);
		border-top: 1px solid var(--cr-rule);
	}
</style>
```

- [ ] **Step 2: Create Screenshot component**

`presentation/src/lib/Screenshot.svelte`:

```svelte
<script lang="ts">
	interface Props {
		src: string;
		alt?: string;
	}

	let { src, alt = '' }: Props = $props();
</script>

<div class="screenshot">
	<img {src} {alt} />
</div>

<style>
	.screenshot {
		border: 1px solid var(--cr-rule-bright);
		border-radius: 6px;
		overflow: hidden;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
	}

	img {
		width: 100%;
		display: block;
	}
</style>
```

- [ ] **Step 3: Create BeforeAfter component**

`presentation/src/lib/BeforeAfter.svelte`:

```svelte
<script lang="ts">
	import { type Snippet } from 'svelte';

	interface Props {
		before: Snippet;
		after: Snippet;
	}

	let { before, after }: Props = $props();
</script>

<div class="before-after">
	<div class="ba-panel">
		{@render before()}
	</div>
	<div class="ba-arrow">&#8594;</div>
	<div class="ba-panel">
		{@render after()}
	</div>
</div>

<style>
	.before-after {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		gap: 20px;
		align-items: center;
	}

	.ba-arrow {
		color: var(--cr-amber);
		font-size: 1.5rem;
	}

	.ba-panel {
		min-width: 0;
	}
</style>
```

- [ ] **Step 4: Commit**

```bash
git add presentation/src/lib/VideoPlayer.svelte presentation/src/lib/Screenshot.svelte presentation/src/lib/BeforeAfter.svelte
git commit -m "+ (presentation) video player, screenshot, before-after components"
```

---

### Task 7: TierDiagram, FlowDiagram, Timeline Components

**Files:**

- Create: `presentation/src/lib/TierDiagram.svelte`
- Create: `presentation/src/lib/FlowDiagram.svelte`
- Create: `presentation/src/lib/Timeline.svelte`

- [ ] **Step 1: Create TierDiagram for module architecture (Slide 9)**

`presentation/src/lib/TierDiagram.svelte`:

```svelte
<div class="tier">
	<div class="tier-level">
		<span class="tier-label">Tier 0 — Contracts</span>
		<div class="tier-row">
			<div class="tier-module tier-module--core">@harness/core</div>
		</div>
	</div>
	<div class="tier-connector"></div>
	<div class="tier-level">
		<span class="tier-label">Tier 1 — Independent Services</span>
		<div class="tier-row">
			<div class="tier-module">store</div>
			<div class="tier-module">workspace</div>
			<div class="tier-module">agent</div>
			<div class="tier-module">intake</div>
		</div>
	</div>
	<div class="tier-connector"></div>
	<div class="tier-level">
		<span class="tier-label">Tier 2 — Orchestration</span>
		<div class="tier-row">
			<div class="tier-module tier-module--daemon">@harness/daemon</div>
		</div>
	</div>
	<div class="tier-connector"></div>
	<div class="tier-level">
		<span class="tier-label">Tier 3 — Interface</span>
		<div class="tier-row">
			<div class="tier-module">@harness/dashboard</div>
		</div>
	</div>
</div>

<style>
	.tier {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
	}

	.tier-level {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}

	.tier-label {
		font-family: var(--font-display);
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.12em;
		color: var(--cr-text-dim);
	}

	.tier-row {
		display: flex;
		gap: 16px;
		justify-content: center;
	}

	.tier-module {
		font-family: var(--font-mono);
		font-size: 0.85rem;
		padding: 10px 20px;
		background: var(--cr-surface);
		border: 1px solid var(--cr-rule);
		border-radius: 4px;
		color: var(--cr-text-mid);
	}

	.tier-module--core {
		border-color: var(--cr-amber);
		color: var(--cr-amber);
	}

	.tier-module--daemon {
		border-color: var(--cr-copper);
		color: var(--cr-copper);
	}

	.tier-connector {
		width: 2px;
		height: 16px;
		background: var(--cr-rule-bright);
		margin: 4px auto;
	}
</style>
```

- [ ] **Step 2: Create FlowDiagram for state machine (Slide 10)**

`presentation/src/lib/FlowDiagram.svelte`:

```svelte
<script lang="ts">
	interface FlowNode {
		label: string;
		color: string;
	}
	interface FlowEdge {
		label: string;
	}

	interface Props {
		nodes: FlowNode[];
		edges: FlowEdge[];
	}

	let { nodes, edges }: Props = $props();
</script>

<div class="flow">
	{#each nodes as node, i}
		<div class="flow-node" style="background: {node.color}; color: var(--cr-bg);">
			{node.label}
		</div>
		{#if i < edges.length}
			<div class="flow-edge">{edges[i].label}</div>
		{/if}
	{/each}
</div>

<style>
	.flow {
		display: flex;
		align-items: center;
		gap: 8px;
		flex-wrap: wrap;
		justify-content: center;
	}

	.flow-node {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		font-weight: 600;
		padding: 8px 16px;
		border-radius: 4px;
	}

	.flow-edge {
		font-family: var(--font-body);
		font-size: 0.7rem;
		color: var(--cr-text-dim);
	}
</style>
```

- [ ] **Step 3: Create Timeline for roadmap (Slide 13)**

`presentation/src/lib/Timeline.svelte`:

```svelte
<script lang="ts">
	import { type Snippet } from 'svelte';

	interface TimelineItem {
		version: string;
		status: 'shipped' | 'next' | 'planned' | 'vision';
		title: string;
		description: string;
	}

	interface Props {
		items: TimelineItem[];
		footer?: Snippet;
	}

	let { items, footer }: Props = $props();

	const borderColors: Record<string, string> = {
		shipped: 'var(--cr-moss)',
		next: 'var(--cr-amber)',
		planned: 'var(--cr-text-dim)',
		vision: 'var(--cr-copper)'
	};

	const statusLabels: Record<string, string> = {
		shipped: 'SHIPPED',
		next: 'NEXT',
		planned: 'PLANNED',
		vision: 'VISION'
	};
</script>

<div class="timeline">
	{#each items as item}
		<div class="timeline-item" style="border-left-color: {borderColors[item.status]}">
			<div class="timeline-header">
				<span class="timeline-version" style="background: {borderColors[item.status]}; color: var(--cr-bg);">
					{item.version}
				</span>
				<span class="timeline-status" style="color: {borderColors[item.status]}">
					{statusLabels[item.status]}
				</span>
			</div>
			<div class="timeline-title">{item.title}</div>
			<div class="timeline-desc">{item.description}</div>
		</div>
	{/each}
</div>
{#if footer}
	<div class="timeline-footer">
		{@render footer()}
	</div>
{/if}

<style>
	.timeline {
		display: flex;
		gap: 0;
		align-items: stretch;
	}

	.timeline-item {
		flex: 1;
		padding: 16px 20px;
		border-left: 3px solid var(--cr-rule);
	}

	.timeline-header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 8px;
	}

	.timeline-version {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		font-weight: 600;
		padding: 2px 8px;
		border-radius: 2px;
	}

	.timeline-status {
		font-size: 0.7rem;
	}

	.timeline-title {
		font-family: var(--font-display);
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--cr-text);
		margin-bottom: 4px;
	}

	.timeline-desc {
		font-size: 0.7rem;
		color: var(--cr-text-mid);
		line-height: 1.5;
	}

	.timeline-footer {
		margin-top: 16px;
		background: var(--cr-surface);
		border: 1px solid var(--cr-rule);
		border-radius: 4px;
		padding: 10px 14px;
	}
</style>
```

- [ ] **Step 4: Commit**

```bash
git add presentation/src/lib/TierDiagram.svelte presentation/src/lib/FlowDiagram.svelte presentation/src/lib/Timeline.svelte
git commit -m "+ (presentation) tier diagram, flow diagram, timeline components"
```

---

### Task 8: Section 1 Slides (1–3)

**Files:**

- Create: `presentation/src/lib/slides/S01Title.svelte`
- Create: `presentation/src/lib/slides/S02Problem.svelte`
- Create: `presentation/src/lib/slides/S03Hook.svelte`

- [ ] **Step 1: Create title slide**

`presentation/src/lib/slides/S01Title.svelte`:

```svelte
<script>
	import Slide from '$lib/Slide.svelte';
</script>

<Slide centered noNumber>
	<div class="title-block">
		<h1 class="title">Harness</h1>
		<div class="rule"></div>
		<p class="tagline">Always-On AI Agent Orchestration</p>
		<p class="meta">Daniel Liu &middot; 2026 &middot; Prototype Presentation</p>
	</div>
</Slide>

<style>
	.title-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0;
	}

	.title {
		font-family: var(--font-display);
		font-size: 4rem;
		font-weight: 800;
		color: var(--cr-text);
		letter-spacing: -0.02em;
	}

	.rule {
		width: 120px;
		height: 2px;
		background: var(--cr-amber);
		margin: 16px 0;
	}

	.tagline {
		font-family: var(--font-body);
		font-size: 1.25rem;
		font-weight: 400;
		color: var(--cr-text-mid);
		margin-bottom: 32px;
	}

	.meta {
		font-family: var(--font-body);
		font-size: 0.875rem;
		font-weight: 300;
		color: var(--cr-text-dim);
	}
</style>
```

- [ ] **Step 2: Create problem slide**

`presentation/src/lib/slides/S02Problem.svelte`:

```svelte
<script>
	import Slide from '$lib/Slide.svelte';
	import Card from '$lib/Card.svelte';
</script>

<Slide number={2} total={15}>
	<h1 class="slide-title">AI coding agents are powerful.<br />But who manages them?</h1>

	<div class="split-4" style="margin-top: 32px; margin-bottom: 24px;">
		<Card>
			<p class="card-label">Task Management</p>
			<p>What needs to be done? In what order? Who decides?</p>
		</Card>
		<Card>
			<p class="card-label">Workspace Isolation</p>
			<p>Each agent needs its own branch, its own sandbox.</p>
		</Card>
		<Card>
			<p class="card-label">Reliability</p>
			<p>What about failures, retries, cost overruns, stalled agents?</p>
		</Card>
		<Card>
			<p class="card-label">Human Review</p>
			<p>How do results surface for review and approval?</p>
		</Card>
	</div>

	<p class="footer">Harness is the infrastructure layer that answers these questions.</p>
</Slide>

<style>
	.footer {
		font-size: 0.9rem;
		color: var(--cr-text-dim);
		font-style: italic;
	}
</style>
```

- [ ] **Step 3: Create hook slide**

`presentation/src/lib/slides/S03Hook.svelte`:

```svelte
<script>
	import Slide from '$lib/Slide.svelte';
	import Card from '$lib/Card.svelte';
</script>

<Slide number={3} total={15}>
	<h1 class="slide-title">"Let's build a video game<br />from scratch."</h1>
	<p class="body-text" style="margin-bottom: 24px;">
		I'm going to show you how Harness takes a game specification, decomposes
		it into tasks, dispatches AI agents to build it, reviews the code
		automatically — and produces a working game. No human writes a line of code.
	</p>
	<Card variant="accent">
		<p class="card-label">What you'll see</p>
		<p>Intake &rarr; Dispatch &rarr; Agent Execution &rarr; Self-Review &rarr; Human Approval &rarr; Working Game</p>
	</Card>
</Slide>
```

- [ ] **Step 4: Commit**

```bash
git add presentation/src/lib/slides/S01Title.svelte presentation/src/lib/slides/S02Problem.svelte presentation/src/lib/slides/S03Hook.svelte
git commit -m "+ (presentation) section 1 slides: title, problem, hook"
```

---

### Task 9: Section 2 Slides (4–8)

**Files:**

- Create: `presentation/src/lib/slides/S04Intake.svelte`
- Create: `presentation/src/lib/slides/S05Dispatch.svelte`
- Create: `presentation/src/lib/slides/S06Question.svelte`
- Create: `presentation/src/lib/slides/S07Pipeline.svelte`
- Create: `presentation/src/lib/slides/S08Review.svelte`

- [ ] **Step 1: Create intake slide with before/after screenshots**

`presentation/src/lib/slides/S04Intake.svelte`:

```svelte
<script>
	import Slide from '$lib/Slide.svelte';
	import BeforeAfter from '$lib/BeforeAfter.svelte';
	import Screenshot from '$lib/Screenshot.svelte';
</script>

<Slide number={4} total={15}>
	<p class="section-label">Demo</p>
	<h1 class="slide-title">Feed it a game specification</h1>
	<p class="slide-subtitle">Harness's intake module decomposes raw requirements into structured tasks with priorities.</p>

	<BeforeAfter>
		{#snippet before()}
			<div class="label-above">Raw Spec</div>
			<Screenshot src="/screenshots/intake-before.png" alt="Raw game spec markdown" />
		{/snippet}
		{#snippet after()}
			<div class="label-above">Structured Tasks</div>
			<Screenshot src="/screenshots/intake-after.png" alt="Decomposed tasks in dashboard" />
		{/snippet}
	</BeforeAfter>
</Slide>

<style>
	.label-above {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		font-weight: 500;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--cr-amber);
		margin-bottom: 8px;
	}
</style>
```

- [ ] **Step 2: Create dispatch slide with video**

`presentation/src/lib/slides/S05Dispatch.svelte`:

```svelte
<script>
	import Slide from '$lib/Slide.svelte';
	import VideoPlayer from '$lib/VideoPlayer.svelte';
</script>

<Slide number={5} total={15}>
	<p class="section-label">Demo</p>
	<h1 class="slide-title">Harness takes over</h1>
	<p class="slide-subtitle">Task moves to ready — daemon claims it, provisions a git worktree, dispatches the agent, events stream in real-time.</p>

	<VideoPlayer src="/videos/full-lifecycle.mp4" caption="Full lifecycle: task creation → dispatch → agent working → handoff → review → approve → merge" />
</Slide>
```

- [ ] **Step 3: Create question slide**

`presentation/src/lib/slides/S06Question.svelte`:

```svelte
<script>
	import Slide from '$lib/Slide.svelte';
	import Screenshot from '$lib/Screenshot.svelte';
</script>

<Slide number={6} total={15}>
	<p class="section-label">Guardrails</p>
	<h1 class="slide-title">Agents keep humans in the loop</h1>

	<div class="split-2" style="margin-top: 24px;">
		<Screenshot src="/screenshots/agent-question.png" alt="Agent question UI with multiple-choice options" />
		<div class="explanation">
			<p class="body-text">
				When the agent is uncertain, it <strong>pauses execution</strong> and asks the operator.
			</p>
			<p class="body-text" style="margin-top: 12px;">
				The question surfaces in the dashboard via SSE. Operator answers, agent resumes.
			</p>
			<p class="dim" style="margin-top: 12px;">
				Timeout fallback: agent proceeds autonomously after 5 minutes.
			</p>
		</div>
	</div>
</Slide>

<style>
	.explanation {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	strong {
		color: var(--cr-text);
	}

	.dim {
		font-size: 0.9rem;
		color: var(--cr-text-dim);
	}
</style>
```

- [ ] **Step 4: Create pipeline slide with video**

`presentation/src/lib/slides/S07Pipeline.svelte`:

```svelte
<script>
	import Slide from '$lib/Slide.svelte';
	import VideoPlayer from '$lib/VideoPlayer.svelte';
</script>

<Slide number={7} total={15}>
	<p class="section-label">Demo</p>
	<h1 class="slide-title">Agents review their own work</h1>
	<p class="slide-subtitle">Generator writes code → evaluator reviews the diff → rejects with feedback → generator retries → evaluator approves. All automatic.</p>

	<VideoPlayer src="/videos/gen-eval-pipeline.mp4" caption="Gen/eval pipeline: generator → evaluator rejects → generator retries → evaluator approves" />
</Slide>
```

- [ ] **Step 5: Create review tiers slide**

`presentation/src/lib/slides/S08Review.svelte`:

```svelte
<script>
	import Slide from '$lib/Slide.svelte';
	import Card from '$lib/Card.svelte';
	import Badge from '$lib/Badge.svelte';
</script>

<Slide number={8} total={15}>
	<p class="section-label">Review</p>
	<h1 class="slide-title">Three tiers of review</h1>

	<div class="split-2" style="margin-top: 24px;">
		<Card>
			<p class="card-label">Handoff Artifact</p>
			<div class="artifact-fields">
				<div class="field"><span class="key">Summary:</span> Implemented Snake game...</div>
				<div class="field"><span class="key">Files changed:</span> 4 files</div>
				<div class="field"><span class="key">Tests:</span> 12 passed, 0 failed</div>
				<div class="field"><span class="key">Commit:</span> a1b2c3d4</div>
				<div class="field"><span class="key">Cost:</span> $0.42</div>
			</div>
		</Card>

		<div class="tiers">
			<div class="tier-option">
				<Badge variant="auto">AUTO</Badge>
				<span>Auto-approve — skip review, merge immediately</span>
			</div>
			<div class="tier-option">
				<Badge variant="agent">AGENT</Badge>
				<span>Reviewer agent reviews the diff, approves or rejects</span>
			</div>
			<div class="tier-option tier-option--active">
				<Badge variant="human">HUMAN</Badge>
				<span>Operator inspects handoff, approves or requests changes</span>
			</div>
			<p class="tier-note">Mutually exclusive. Configurable per task. Reject from any tier → agent retries with feedback.</p>
		</div>
	</div>
</Slide>

<style>
	.artifact-fields {
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--cr-text-mid);
		line-height: 1.8;
	}

	.key {
		color: var(--cr-text);
		font-weight: 500;
	}

	.tiers {
		display: flex;
		flex-direction: column;
		gap: 12px;
		justify-content: center;
	}

	.tier-option {
		display: flex;
		align-items: center;
		gap: 12px;
		background: var(--cr-surface);
		border: 1px solid var(--cr-rule);
		border-radius: 4px;
		padding: 12px 16px;
		font-size: 0.85rem;
		color: var(--cr-text-mid);
	}

	.tier-option--active {
		border-color: var(--cr-amber-dim);
		color: var(--cr-text);
	}

	.tier-note {
		font-size: 0.75rem;
		color: var(--cr-text-dim);
		margin-top: 4px;
	}
</style>
```

- [ ] **Step 6: Commit**

```bash
git add presentation/src/lib/slides/S04Intake.svelte presentation/src/lib/slides/S05Dispatch.svelte presentation/src/lib/slides/S06Question.svelte presentation/src/lib/slides/S07Pipeline.svelte presentation/src/lib/slides/S08Review.svelte
git commit -m "+ (presentation) section 2 slides: intake, dispatch, question, pipeline, review"
```

---

### Task 10: Section 3 Slides (9–12)

**Files:**

- Create: `presentation/src/lib/slides/S09Architecture.svelte`
- Create: `presentation/src/lib/slides/S10StateMachine.svelte`
- Create: `presentation/src/lib/slides/S11Guardrails.svelte`
- Create: `presentation/src/lib/slides/S12Profiles.svelte`

- [ ] **Step 1: Create architecture slide**

`presentation/src/lib/slides/S09Architecture.svelte`:

```svelte
<script>
	import Slide from '$lib/Slide.svelte';
	import Card from '$lib/Card.svelte';
	import TierDiagram from '$lib/TierDiagram.svelte';
</script>

<Slide number={9} total={15}>
	<p class="section-label">Architecture</p>
	<h1 class="slide-title">Seven modules, tiered dependencies, clean contracts</h1>

	<div style="margin: 24px 0;">
		<TierDiagram />
	</div>

	<div class="split-3">
		<Card>
			<p class="card-label">Zero implementation in core</p>
			<p>Only types, interfaces, and the state machine. No SQLite, no SDK, no HTTP.</p>
		</Card>
		<Card>
			<p class="card-label">Interface-driven</p>
			<p>Modules depend on contracts, never internals. Store implements TaskStore. Agent implements AgentRuntimeAdapter.</p>
		</Card>
		<Card>
			<p class="card-label">662 tests, real databases</p>
			<p>Store tests hit real in-memory SQLite. Agent tests inject mock query factories. Each module testable in isolation.</p>
		</Card>
	</div>
</Slide>
```

- [ ] **Step 2: Create state machine slide**

`presentation/src/lib/slides/S10StateMachine.svelte`:

```svelte
<script>
	import Slide from '$lib/Slide.svelte';
	import Card from '$lib/Card.svelte';
	import FlowDiagram from '$lib/FlowDiagram.svelte';

	const nodes = [
		{ label: 'backlog', color: '#787064' },
		{ label: 'ready', color: '#e8a230' },
		{ label: 'queued', color: '#8b7e4a' },
		{ label: 'running', color: '#c8713a' },
		{ label: 'review', color: '#c17a3a' },
		{ label: 'done', color: '#5a8a5a' }
	];

	const edges = [
		{ label: '→ human' },
		{ label: '→ daemon' },
		{ label: '→ daemon' },
		{ label: '→ daemon' },
		{ label: '→ human' }
	];
</script>

<Slide number={10} total={15}>
	<p class="section-label">Architecture</p>
	<h1 class="slide-title">Every state transition has an owner. No exceptions.</h1>

	<div style="margin: 28px 0;">
		<FlowDiagram {nodes} {edges} />
	</div>

	<div class="split-3">
		<Card>
			<p class="card-label" style="color: var(--cr-moss);">Human-owned</p>
			<p>backlog → ready<br />review → done / ready / failed<br />any → canceled</p>
		</Card>
		<Card>
			<p class="card-label" style="color: var(--cr-copper);">Daemon-owned</p>
			<p>ready → queued<br />queued → running / failed<br />running → review / failed / queued</p>
		</Card>
		<Card>
			<p class="card-label">Enforcement</p>
			<p>Single <code>validateTransition()</code> function — every module goes through it. The daemon <em>cannot</em> approve its own work.</p>
		</Card>
	</div>
</Slide>

<style>
	code {
		font-family: var(--font-mono);
		color: var(--cr-text);
		font-size: 0.85rem;
	}

	em {
		font-style: italic;
		color: var(--cr-text);
	}
</style>
```

- [ ] **Step 3: Create guardrails slide**

`presentation/src/lib/slides/S11Guardrails.svelte`:

```svelte
<script>
	import Slide from '$lib/Slide.svelte';
	import Card from '$lib/Card.svelte';
</script>

<Slide number={11} total={15}>
	<p class="section-label">Guardrails</p>
	<h1 class="slide-title">Built for 24/7 operation</h1>
	<p class="slide-subtitle">What stops it from going off the rails?</p>

	<div class="grid-2x3">
		<Card>
			<p class="card-label">Cost Controls</p>
			<p>Daily budget cap with mid-run enforcement. Agent cancelled if it pushes past the limit.</p>
		</Card>
		<Card>
			<p class="card-label">Stall + Timeout Detection</p>
			<p>No events for 5 min → cancelled. Running over 1 hour → cancelled. No runaway processes.</p>
		</Card>
		<Card>
			<p class="card-label">Quality Gates</p>
			<p>Shell commands (tests, linting) must pass before agent finishes. Fails → agent keeps working.</p>
		</Card>
		<Card>
			<p class="card-label">Command Restrictions</p>
			<p>Deny/allow regex on Bash. Block dangerous commands. Fine-grained sandbox control.</p>
		</Card>
		<Card>
			<p class="card-label">Crash Recovery</p>
			<p>Daemon restart reconciles orphaned tasks. Single-instance lock prevents conflicts. Work is never lost.</p>
		</Card>
		<Card>
			<p class="card-label">Rate Limit Awareness</p>
			<p>API rate limits pause dispatch automatically. Concurrency halved on warnings. Resumes when safe.</p>
		</Card>
	</div>
</Slide>
```

- [ ] **Step 4: Create profiles slide**

`presentation/src/lib/slides/S12Profiles.svelte`:

```svelte
<script>
	import Slide from '$lib/Slide.svelte';
	import CodeBlock from '$lib/CodeBlock.svelte';
</script>

<Slide number={12} total={15}>
	<p class="section-label">Customization</p>
	<h1 class="slide-title">Specialized agents for specialized work</h1>

	<div class="split-2" style="margin-top: 24px;">
		<CodeBlock>
<span class="comment">// harness.config.json</span>
&#123;
  <span class="key">"agents"</span>: &#123;
    <span class="key">"default"</span>: &#123; model: <span class="str">"sonnet"</span>, budget: <span class="num">5.0</span> &#125;,
    <span class="key">"quick"</span>:   &#123; model: <span class="str">"haiku"</span>,  budget: <span class="num">0.50</span> &#125;,
    <span class="key">"heavy"</span>:   &#123; model: <span class="str">"opus"</span>,   budget: <span class="num">20.0</span>,
      evaluator: &#123; ... &#125;,
      qualityChecks: [<span class="str">"npm test"</span>]
    &#125;
  &#125;
&#125;
		</CodeBlock>

		<div class="points">
			<div class="point">
				<strong>Named profiles</strong>
				<p>Different models, budgets, permissions per task type. Profiles inherit from default and override.</p>
			</div>
			<div class="point">
				<strong>Per-repo context</strong>
				<p>Agents load the target repo's CLAUDE.md, skills, and settings. Each codebase teaches agents its conventions.</p>
			</div>
			<div class="point">
				<strong>Subagents</strong>
				<p>Profiles declare sub-agents with their own tools, prompts, and model overrides for decomposed work.</p>
			</div>
			<div class="point">
				<strong>Sandbox tiers</strong>
				<p>SDK permissions, command restrictions, disallowed tools. Configurable isolation per profile.</p>
			</div>
		</div>
	</div>
</Slide>

<style>
	.points {
		display: flex;
		flex-direction: column;
		gap: 16px;
		justify-content: center;
	}

	.point strong {
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		color: var(--cr-text);
		display: block;
		margin-bottom: 2px;
	}

	.point p {
		font-size: 0.9rem;
		color: var(--cr-text-mid);
		line-height: 1.5;
	}
</style>
```

- [ ] **Step 5: Commit**

```bash
git add presentation/src/lib/slides/S09Architecture.svelte presentation/src/lib/slides/S10StateMachine.svelte presentation/src/lib/slides/S11Guardrails.svelte presentation/src/lib/slides/S12Profiles.svelte
git commit -m "+ (presentation) section 3 slides: architecture, state machine, guardrails, profiles"
```

---

### Task 11: Section 4 Slides (13–15)

**Files:**

- Create: `presentation/src/lib/slides/S13Roadmap.svelte`
- Create: `presentation/src/lib/slides/S14TheAsk.svelte`
- Create: `presentation/src/lib/slides/S15GameReveal.svelte`

- [ ] **Step 1: Create roadmap slide**

`presentation/src/lib/slides/S13Roadmap.svelte`:

```svelte
<script>
	import Slide from '$lib/Slide.svelte';
	import Timeline from '$lib/Timeline.svelte';
	import Card from '$lib/Card.svelte';

	const items = [
		{
			version: 'v3.0',
			status: 'shipped' as const,
			title: 'Gen/Eval Pipeline',
			description: 'Multi-session orchestration. Agents review their own work. 662 tests.'
		},
		{
			version: 'v3.1',
			status: 'next' as const,
			title: 'MCP Server + Task Memory',
			description: 'Agents query their own state mid-run. Structured memory across sessions. Context-limit recovery.'
		},
		{
			version: 'v3.2–3.3',
			status: 'planned' as const,
			title: 'Teams + Autonomous Ops',
			description: 'Agent teams for parallel work. Cron scheduler. Memory consolidation. Run observer.'
		},
		{
			version: 'v3.4',
			status: 'planned' as const,
			title: 'Guardrails for Autonomy',
			description: 'Task dependencies. Sprint contract negotiation. Docker isolation tiers.'
		},
		{
			version: 'v4',
			status: 'vision' as const,
			title: 'Agent-as-Operator',
			description: 'AI manages the task queue. Humans set goals, agents steer and execute. Jira/Linear integration.'
		}
	];
</script>

<Slide number={13} total={15}>
	<p class="section-label">Roadmap</p>
	<h1 class="slide-title">Infrastructure is built. Here's what's next.</h1>

	<div style="margin-top: 24px;">
		<Timeline {items}>
			{#snippet footer()}
				<p class="enterprise-label">Enterprise Extensions</p>
				<p class="enterprise-items">Jira/Linear connectors &middot; Docker agent isolation &middot; Per-repo targeting &middot; Streaming input for human-in-the-loop &middot; Analytics dashboard</p>
			{/snippet}
		</Timeline>
	</div>
</Slide>

<style>
	.enterprise-label {
		font-family: var(--font-display);
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--cr-amber);
		margin-bottom: 4px;
	}

	.enterprise-items {
		font-size: 0.7rem;
		color: var(--cr-text-mid);
	}
</style>
```

- [ ] **Step 2: Create "the ask" slide**

`presentation/src/lib/slides/S14TheAsk.svelte`:

```svelte
<script>
	import Slide from '$lib/Slide.svelte';
	import Card from '$lib/Card.svelte';
</script>

<Slide number={14} total={15}>
	<p class="section-label">Path Forward</p>
	<h1 class="slide-title">When Claude Code arrives, we're ready.</h1>

	<div class="split-2" style="margin-top: 32px;">
		<Card>
			<p class="card-label">What exists today</p>
			<ul class="checklist">
				<li>Full orchestration lifecycle — intake to merge</li>
				<li>Gen/eval pipeline with autonomous self-review</li>
				<li>Operational guardrails — cost, timeouts, quality gates</li>
				<li>Configurable agent profiles and sandboxing</li>
				<li>Clean modular architecture — 7 modules, 662 tests</li>
				<li>Detailed roadmap through v4</li>
			</ul>
		</Card>
		<Card variant="highlight">
			<p class="card-label">What a team unlocks</p>
			<ul class="checklist">
				<li>Jira/Linear integration for automatic task intake</li>
				<li>Docker isolation for enterprise compliance</li>
				<li>Multi-repo support across org codebases</li>
				<li>Agent-as-operator for fully autonomous dispatch</li>
				<li>Per-codebase agent specialization at scale</li>
				<li>Production hardening and deployment infrastructure</li>
			</ul>
		</Card>
	</div>
</Slide>

<style>
	.checklist {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.checklist li {
		font-size: 0.9rem;
		color: var(--cr-text-mid);
		line-height: 1.8;
		padding-left: 16px;
		position: relative;
	}

	.checklist li::before {
		content: '—';
		position: absolute;
		left: 0;
		color: var(--cr-amber-dim);
	}
</style>
```

- [ ] **Step 3: Create game reveal / closing slide**

`presentation/src/lib/slides/S15GameReveal.svelte`:

```svelte
<script>
	import Slide from '$lib/Slide.svelte';
	import VideoPlayer from '$lib/VideoPlayer.svelte';
</script>

<Slide centered noNumber>
	<h1 class="reveal-title">Remember the game?</h1>
	<p class="reveal-sub">No human wrote a line of code.</p>

	<div class="video-wrap">
		<VideoPlayer src="/videos/game-demo.mp4" />
	</div>

	<p class="closing">Thank you. Questions?</p>
</Slide>

<style>
	.reveal-title {
		font-family: var(--font-display);
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--cr-text);
		margin-bottom: 8px;
	}

	.reveal-sub {
		font-family: var(--font-body);
		font-size: 1.125rem;
		color: var(--cr-text-mid);
		margin-bottom: 32px;
	}

	.video-wrap {
		width: 100%;
		max-width: 640px;
		margin-bottom: 32px;
	}

	.closing {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--cr-amber);
	}
</style>
```

- [ ] **Step 4: Commit**

```bash
git add presentation/src/lib/slides/S13Roadmap.svelte presentation/src/lib/slides/S14TheAsk.svelte presentation/src/lib/slides/S15GameReveal.svelte
git commit -m "+ (presentation) section 4 slides: roadmap, the ask, game reveal"
```

---

### Task 12: Wire All Slides + Final Integration

**Files:**

- Modify: `presentation/src/routes/+page.svelte`
- Modify: `presentation/src/routes/+layout.svelte`

- [ ] **Step 1: Wire all slides into +page.svelte**

`presentation/src/routes/+page.svelte`:

```svelte
<script>
	import { getContext } from 'svelte';

	import S01Title from '$lib/slides/S01Title.svelte';
	import S02Problem from '$lib/slides/S02Problem.svelte';
	import S03Hook from '$lib/slides/S03Hook.svelte';
	import S04Intake from '$lib/slides/S04Intake.svelte';
	import S05Dispatch from '$lib/slides/S05Dispatch.svelte';
	import S06Question from '$lib/slides/S06Question.svelte';
	import S07Pipeline from '$lib/slides/S07Pipeline.svelte';
	import S08Review from '$lib/slides/S08Review.svelte';
	import S09Architecture from '$lib/slides/S09Architecture.svelte';
	import S10StateMachine from '$lib/slides/S10StateMachine.svelte';
	import S11Guardrails from '$lib/slides/S11Guardrails.svelte';
	import S12Profiles from '$lib/slides/S12Profiles.svelte';
	import S13Roadmap from '$lib/slides/S13Roadmap.svelte';
	import S14TheAsk from '$lib/slides/S14TheAsk.svelte';
	import S15GameReveal from '$lib/slides/S15GameReveal.svelte';

	const nav = getContext('nav');

	const slides = [
		S01Title, S02Problem, S03Hook,
		S04Intake, S05Dispatch, S06Question, S07Pipeline, S08Review,
		S09Architecture, S10StateMachine, S11Guardrails, S12Profiles,
		S13Roadmap, S14TheAsk, S15GameReveal
	];
</script>

<svelte:head>
	<title>Harness — Presentation</title>
</svelte:head>

{#key nav.current}
	<div class="slide-wrapper">
		<svelte:component this={slides[nav.current]} />
	</div>
{/key}

<style>
	.slide-wrapper {
		animation: fade-in 0.3s ease;
	}

	@keyframes fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}
</style>
```

- [ ] **Step 2: Run the dev server and test full navigation**

```bash
cd presentation && npm run dev -- --port 4173
```

Open `http://localhost:4173`. Verify:

- Slide 1 (title) shows centered with Syne font, amber rule, no slide number
- Arrow keys navigate through all 15 slides
- Slide numbers appear on slides 2–14, absent on 1 and 15
- Progress bar fills from left to right
- Staggered fade-up animation on each slide entry
- Video containers show play overlay (videos won't play until mp4 files are added)
- Screenshots show broken image placeholders (expected until assets are added)
- 'f' key triggers fullscreen request

- [ ] **Step 3: Verify static build**

```bash
cd presentation && npm run build
```

Expected: build completes with output in `presentation/build/`. Verify `build/index.html` exists.

```bash
cd presentation && npm run preview -- --port 4174
```

Open `http://localhost:4174`. Verify the static build renders identically to dev mode.

- [ ] **Step 4: Commit**

```bash
git add presentation/src/routes/+page.svelte presentation/src/routes/+layout.svelte
git commit -m "> (presentation) wire all 15 slides, verify static build"
```

---

## Asset Checklist (User Action)

These are not implementation tasks — they require running Harness and capturing output. Drop files into the corresponding `static/` directories:

| File                    | Location              | How to capture                                                                 |
| ----------------------- | --------------------- | ------------------------------------------------------------------------------ |
| `intake-before.png`     | `static/screenshots/` | Screenshot the Import page with a game spec loaded                             |
| `intake-after.png`      | `static/screenshots/` | Screenshot the Import page showing decomposed tasks                            |
| `agent-question.png`    | `static/screenshots/` | Screenshot a question event in the task detail page                            |
| `full-lifecycle.mp4`    | `static/videos/`      | Screen-record: create task → dispatch → agent works → review → approve → merge |
| `gen-eval-pipeline.mp4` | `static/videos/`      | Screen-record: pipeline with evaluator rejection and generator retry           |
| `game-demo.mp4`         | `static/videos/`      | Screen-record: 10 seconds of the finished game running in a browser            |

**Compress videos:**

```bash
ffmpeg -i raw-recording.mp4 -vcodec libx264 -crf 28 -preset fast -vf scale=1920:1080 -an output.mp4
```

Target: each video under 10 MB. Adjust `-crf` (higher = smaller/lower quality) if needed.
