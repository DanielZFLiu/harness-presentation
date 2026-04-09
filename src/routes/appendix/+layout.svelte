<script>
	let { children } = $props();
</script>

<div class="appendix-shell">
	<nav class="appendix-nav">
		<a href="/appendix" class="nav-brand">Appendix</a>
		<a href="/" class="nav-back">← Back to presentation</a>
	</nav>
	<main class="appendix-main">
		{@render children()}
	</main>
</div>

<style>
	.appendix-shell {
		min-height: 100vh;
		background: var(--cr-bg);
		color: var(--cr-text);
	}

	.appendix-nav {
		position: sticky;
		top: 0;
		z-index: 50;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px 40px;
		background: var(--cr-surface);
		border-bottom: 1px solid var(--cr-rule);
	}

	.nav-brand {
		font-family: var(--font-display);
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--cr-amber);
		text-decoration: none;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.nav-back {
		font-family: var(--font-body);
		font-size: 0.85rem;
		color: var(--cr-text-dim);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.nav-back:hover {
		color: var(--cr-amber);
	}

	.appendix-main {
		max-width: 960px;
		margin: 0 auto;
		padding: 48px 40px 96px;
	}
</style>
