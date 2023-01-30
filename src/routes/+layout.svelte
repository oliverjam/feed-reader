<script>
	import "../app.css";
	import FeedItem from "$lib/components/feed-item.svelte";
	import Badge from "$lib/components/badge.svelte";

	/** @type {import('./$types').LayoutData} */
	export let data;
</script>

<div class="layout">
	<section>
		<form method="POST" action="/?/save">
			<input name="url" type="url" value={""} />
			<button aria-label="Save feed">&plus;</button>
			<!-- {#if form?.missing}<output>Please provide a URL</output>{/if}
				{#if form?.existing}<output>You've already saved that feed</output>{/if} -->
		</form>
		<ul>
			<FeedItem id="unread">
				Unread
				<Badge>{data.unread}</Badge>
			</FeedItem>
			{#if data.feeds.length}
				{#each data.feeds as feed}
					<FeedItem id={feed.id}>
						{feed.title}
						{#if feed.unread !== 0}<Badge>{feed.unread}</Badge>{/if}
					</FeedItem>
				{/each}
			{/if}
		</ul>
	</section>
	<slot />
</div>

<style>
	.layout {
		overflow: hidden;
		height: 100vh;
		display: grid;
		grid-template-columns:
			minmax(10rem, 2fr)
			minmax(14rem, 3fr)
			minmax(14rem, 7fr);
	}

	section {
		overscroll-behavior: none;
		scrollbar-color: hsl(0deg 10% 80%) var(--bg-mid);
		scrollbar-width: thin;
		padding: 1.5rem 0.5rem;
		background-color: var(--bg-low);
	}

	ul {
		padding-block: 1rem;
	}
</style>
