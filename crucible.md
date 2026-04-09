# Presentation Theme — "Crucible"

> Where Foundry is the operator console, Crucible is the presentation stage. Same lineage — warm, dark, amber — but theatrical instead of utilitarian. Every slide has the confidence of an architect showing their blueprints.

## Aesthetic Direction

**Concept: "Crucible"** — a vessel in which materials are melted at high temperature. The presentation shows what was forged. Dark, cinematic, warm. Generous negative space where Foundry is dense. Large type where Foundry is compact. Dramatic reveals where Foundry is static.

**Core principles:**

- **Cinematic, not operational** — Foundry packs information; Crucible lets it breathe. One idea per slide, expressed with confidence and scale.
- **Weight and presence** — heavy display type, strong left alignment, generous margins. Slides should feel anchored, not floating.
- **Warmth elevated** — Foundry's amber palette but hotter, more saturated for projector legibility. Molten amber instead of muted gold.
- **Craft over flash** — no gratuitous particle effects or 3D transforms. Staggered reveals, subtle glows, precise timing. The motion vocabulary of someone who knows restraint.

---

## Color Palette

Evolved from Foundry. Brighter accents for projector visibility, deeper blacks for contrast, same warm undertone.

```css
:root {
	/* ── Surface ─────────────────────────────────────────────────────────────── */
	--cr-bg: #0c0a08; /* slide background — near-black with warm undertone */
	--cr-surface: #171310; /* content panels, card backgrounds */
	--cr-surface-alt: #221e19; /* elevated panels, code blocks */
	--cr-surface-hot: #2d2720; /* active/hover states, highlighted regions */

	/* ── Text ────────────────────────────────────────────────────────────────── */
	--cr-text: #f0e8d8; /* primary text — warm cream, brighter than Foundry for projection */
	--cr-text-mid: #b8ad9c; /* secondary text — descriptions, labels */
	--cr-text-dim: #787064; /* tertiary — annotations, footnotes, slide numbers */

	/* ── Accent ──────────────────────────────────────────────────────────────── */
	--cr-amber: #e8a230; /* primary accent — molten amber, hotter than Foundry's #c4a46a */
	--cr-amber-glow: #f0b848; /* hover/emphasis state */
	--cr-amber-dim: #a07828; /* muted amber for borders, subtle marks */
	--cr-copper: #c8713a; /* secondary accent — deep copper */
	--cr-ember: #b54a3a; /* danger/error/failed — brick red, inherited from Foundry */
	--cr-moss: #5a8a5a; /* success/done — forest green, inherited from Foundry */

	/* ── Structural ──────────────────────────────────────────────────────────── */
	--cr-rule: #2a2520; /* dividers, borders */
	--cr-rule-bright: #3d362e; /* emphasized borders */
}
```

### Background texture

Subtle radial gradient from center, not flat black. Creates depth without distraction.

```css
.slide {
	background:
		radial-gradient(ellipse 80% 60% at 50% 40%, rgba(23, 19, 16, 0.6) 0%, transparent 100%),
		var(--cr-bg);
}
```

Optional: noise grain overlay at 2% opacity (same technique as Foundry) for tactile warmth on close-up screens. Omit if projector quality is unknown — grain can look muddy on low-res projectors.

---

## Typography

Two fonts. One commands attention, one delivers information.

```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
	--font-display: 'Syne', sans-serif;
	--font-body: 'Manrope', sans-serif;
	--font-mono: 'JetBrains Mono', monospace;
}
```

**Syne** — geometric, brutalist-influenced, variable weight. Distinctive at large sizes without being decorative. Used for slide titles and key statements. The kind of font that says "I chose this on purpose."

**Manrope** — geometric but warm. Excellent readability at body sizes. Rounds off Syne's sharp edges for comfortable reading. Used for descriptions, bullet points, labels.

**JetBrains Mono** — continuity with Foundry/dashboard. Used for code snippets, config examples, technical data. Signals "this is real code from a real system."

### Type Scale

Designed for projector readability at 1920x1080. All sizes assume fullscreen browser presentation.

| Role           | Font           | Weight  | Size             | Letter-spacing    | Usage                                    |
| -------------- | -------------- | ------- | ---------------- | ----------------- | ---------------------------------------- |
| Slide title    | Syne           | 700–800 | 3rem (48px)      | -0.02em           | One per slide, top-left anchored         |
| Slide subtitle | Manrope        | 400     | 1.25rem (20px)   | 0                 | Below title, muted color                 |
| Section label  | Syne           | 600     | 0.75rem (12px)   | 0.15em, uppercase | "SECTION 1", "ARCHITECTURE", above title |
| Body text      | Manrope        | 400     | 1.125rem (18px)  | 0                 | Descriptions, explanations               |
| Card heading   | Syne           | 600     | 1.25rem (20px)   | -0.01em           | Inside content cards                     |
| Card body      | Manrope        | 400     | 0.9375rem (15px) | 0                 | Card descriptions                        |
| Code / data    | JetBrains Mono | 400     | 0.875rem (14px)  | 0                 | Config snippets, monospace data          |
| Badge / tag    | JetBrains Mono | 500     | 0.6875rem (11px) | 0.08em, uppercase | Status badges, version tags              |
| Slide number   | Manrope        | 300     | 0.75rem (12px)   | 0.05em            | Bottom-right corner                      |

---

## Layout System

### Slide container

Full viewport. Fixed aspect ratio enforced via CSS for consistent rendering across screens.

```css
.slide {
	width: 100vw;
	height: 100vh;
	padding: 64px 80px; /* generous margins — content doesn't touch edges */
	display: flex;
	flex-direction: column;
	justify-content: center; /* vertically centered by default */
	overflow: hidden;
	position: relative;
}
```

### Content alignment

**Strong left alignment.** Titles anchor to the left. Content flows left-to-right. No centered title slides (that's the generic corporate default). The title slide is the one exception — centered for opening impact.

### Grid

Content within slides uses CSS grid. Common patterns:

```css
/* Two-column split (e.g., code + explanation) */
.split-2 {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 32px;
}

/* Three-column (e.g., three callout cards) */
.split-3 {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 24px;
}

/* 2x3 grid (e.g., guardrails) */
.grid-2x3 {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-rows: auto auto auto;
	gap: 16px;
}

/* Asymmetric split (e.g., diagram + description) */
.split-wide {
	display: grid;
	grid-template-columns: 1.5fr 1fr;
	gap: 40px;
}
```

### Slide number

Bottom-right corner. Dim text. Format: `03 / 15`. Omit on title slide and closing slide.

---

## Component Patterns

### Content card

Used for feature callouts, guardrail items, comparison columns.

```css
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
```

### Code block

For config snippets and technical examples. Slightly brighter background to separate from slide.

```css
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
}

.code-block .key {
	color: var(--cr-amber);
}
.code-block .str {
	color: var(--cr-moss);
}
.code-block .num {
	color: var(--cr-copper);
}
.code-block .comment {
	color: var(--cr-text-dim);
}
```

### Badge / tag

For status labels, version tags, role markers.

```css
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

.badge--shipped {
	background: var(--cr-moss);
	color: var(--cr-bg);
}
.badge--next {
	background: var(--cr-amber);
	color: var(--cr-bg);
}
.badge--planned {
	background: var(--cr-text-dim);
	color: var(--cr-bg);
}
.badge--vision {
	background: var(--cr-copper);
	color: var(--cr-bg);
}
```

### Video container

Embedded recordings. Amber border signals interactive/playable content. Subtle glow when playing.

```css
.video-container {
	border: 2px solid var(--cr-amber-dim);
	border-radius: 8px;
	overflow: hidden;
	position: relative;
	background: var(--cr-bg);
}

.video-container video {
	width: 100%;
	display: block;
}

.video-container.playing {
	border-color: var(--cr-amber);
	box-shadow: 0 0 30px rgba(232, 162, 48, 0.12);
}
```

### Screenshot container

Static images. No amber border (not interactive). Subtle frame.

```css
.screenshot {
	border: 1px solid var(--cr-rule-bright);
	border-radius: 6px;
	overflow: hidden;
	box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}

.screenshot img {
	width: 100%;
	display: block;
}
```

### Before/after pair

For intake screenshots. Side-by-side with an arrow between.

```css
.before-after {
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	gap: 20px;
	align-items: center;
}

.before-after .arrow {
	color: var(--cr-amber);
	font-size: 1.5rem;
}
```

### Flow diagram

For the state machine and data flow visualization. Horizontal chain of nodes with labeled edges.

```css
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
```

### Tier diagram

For the module architecture. Vertical stack with connection lines.

```css
.tier {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
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
}

.tier-module--core {
	border-color: var(--cr-amber);
}

.tier-module--daemon {
	border-color: var(--cr-copper);
}

.tier-connector {
	width: 2px;
	height: 16px;
	background: var(--cr-rule-bright);
	margin: 0 auto;
}
```

### Timeline (roadmap)

Horizontal progression from shipped to vision.

```css
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

.timeline-item--shipped {
	border-left-color: var(--cr-moss);
}
.timeline-item--next {
	border-left-color: var(--cr-amber);
}
.timeline-item--planned {
	border-left-color: var(--cr-text-dim);
}
.timeline-item--vision {
	border-left-color: var(--cr-copper);
}
```

---

## Animation

Restrained. Motion serves comprehension, not spectacle.

### Slide entrance

Content fades up on slide entry. Staggered by element for reading order.

```css
.slide-enter {
	opacity: 0;
	transform: translateY(12px);
}

.slide-enter-active {
	opacity: 1;
	transform: translateY(0);
	transition:
		opacity 0.4s ease-out,
		transform 0.4s ease-out;
}

/* Stagger children */
.slide-enter-active > :nth-child(1) {
	transition-delay: 0ms;
}
.slide-enter-active > :nth-child(2) {
	transition-delay: 80ms;
}
.slide-enter-active > :nth-child(3) {
	transition-delay: 160ms;
}
.slide-enter-active > :nth-child(4) {
	transition-delay: 240ms;
}
.slide-enter-active > :nth-child(5) {
	transition-delay: 320ms;
}
.slide-enter-active > :nth-child(6) {
	transition-delay: 400ms;
}
```

### Slide transition

Crossfade between slides. No sliding, no flipping — just a clean dissolve.

```css
.slide-transition-enter {
	opacity: 0;
}
.slide-transition-leave {
	opacity: 1;
}
.slide-transition-enter-active,
.slide-transition-leave-active {
	transition: opacity 0.3s ease;
}
```

### Video glow

Subtle amber glow when a video starts playing.

```css
.video-container.playing {
	animation: video-glow 0.5s ease-out forwards;
}

@keyframes video-glow {
	from {
		box-shadow: 0 0 0px rgba(232, 162, 48, 0);
	}
	to {
		box-shadow: 0 0 30px rgba(232, 162, 48, 0.12);
	}
}
```

### No other animations

No particle effects. No parallax. No typewriter text. No bouncing elements. The content is the spectacle — motion just gets it on screen gracefully.

---

## Slide Type Templates

### Title slide (Slide 1 only)

Centered. Large display type. No slide number.

```
[centered vertically and horizontally]

HARNESS                              ← Syne 800, 4rem, --cr-text
Always-On AI Agent Orchestration     ← Manrope 400, 1.25rem, --cr-text-mid

Name · Date · Prototype Presentation ← Manrope 300, 0.875rem, --cr-text-dim
```

Subtle decorative element: a thin horizontal amber rule (120px wide, 2px tall) between title and subtitle.

### Statement slide (Slide 3, 15)

One bold statement dominates. Supporting text beneath.

```
[left-aligned, vertically centered]

"Let's build a video game          ← Syne 800, 3rem, --cr-text
 from scratch."

Supporting explanation text         ← Manrope 400, 1.125rem, --cr-text-mid
below the statement.

[callout card at bottom]            ← .card--accent
```

### Demo slide (Slides 5, 7)

Video dominates. Brief text above.

```
[section-label]  DEMO
[title]          Harness takes over
[subtitle]       brief description

[video-container fills remaining space, ~65% of slide height]
```

### Diagram slide (Slides 9, 10)

Visual in the upper portion, supporting text below.

```
[section-label]  ARCHITECTURE
[title]          Seven modules, tiered dependencies

[diagram component — tier diagram or flow diagram]

[row of 2-3 callout cards at bottom]
```

### Grid slide (Slide 11)

Title + 2x3 grid of cards filling the space.

```
[section-label]  GUARDRAILS
[title]          Built for 24/7 operation

[grid-2x3 of .card components]
```

### Split slide (Slides 4, 8, 12, 14)

Two columns of content. Left can be a screenshot/code, right is text.

```
[section-label]  REVIEW
[title]          Three tiers of review

[split-2]
  [left:  screenshot, code block, or card stack]
  [right: description text, list, or card stack]
```

### Closing slide (Slide 15)

Centered. Video plays, then closing text. No slide number.

```
[centered vertically]

Remember the game?                   ← Syne 700, 2.5rem, --cr-text
No human wrote a line of code.       ← Manrope 400, 1.125rem, --cr-text-mid

[video-container — 10s game clip]

Thank you. Questions?                ← Syne 600, 1.5rem, --cr-amber
```

---

## Navigation

- **Arrow keys** (left/right) navigate between slides
- **Space** advances to next slide
- **Escape** toggles a slide overview/grid (optional, nice-to-have)
- **F** or **F11** toggles fullscreen
- **Click on video** plays/pauses embedded recording
- Visual indicator: thin amber progress bar at the very bottom of the viewport (2px tall, spans the percentage of slides completed)

---

## Portability Notes

- Static SvelteKit build (`adapter-static`). No server needed — just open `index.html`.
- Videos as mp4 files in a `static/` or `assets/` directory, referenced by `<video>` elements.
- Screenshots as optimized images (png or webp) in the same directory.
- Google Fonts loaded via CDN link. If offline presentation is required, self-host the font files.
- Target resolution: 1920x1080 (standard projector). All type sizes and spacing designed for this.
