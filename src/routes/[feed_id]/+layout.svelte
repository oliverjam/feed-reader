<script>
	import { page } from "$app/stores";
	import { short } from "$lib/date.js";

	/** @type {import('./$types').LayoutData} */
	export let data;
</script>

<svelte:head>
	<title>{data.feed.title}</title>
</svelte:head>
<section>
	<header>
		<h2>{data.feed.title}</h2>
		<small>{data.feed.unread} unread</small>
	</header>
	<ul>
		{#each data.items as item}
			{#if item.id}
				{@const current = +$page.params.item_id === item.id}
				<li class:current class:unread={item.read === 0}>
					<a
						aria-current={current ? "true" : null}
						href="/{data.feed.id}/{item.id}"
						title={item.title}
					>
						{item.title}
					</a>
					<time datetime={item.pubDate}>
						{short(item.pubDate)}
					</time>
				</li>
			{/if}
		{/each}
	</ul>
</section>
<slot />

<style>
	section {
		overflow-y: auto;
		overscroll-behavior: none;
		scrollbar-color: var(--scrollbar) var(--bg-mid);
		scrollbar-width: thin;
		border-inline: 2px solid var(--border);
		background-color: var(--bg-mid);
	}

	header {
		position: sticky;
		inset-block-start: 0;
		z-index: 10;
		border-block-end: 2px solid var(--border);
		padding: 0.5rem;
		padding-inline-start: 1.5rem;
		line-height: 1;
		background-color: var(--bg-low);
	}

	h2 {
		font-size: 1rem;
	}

	small {
		font-size: 0.75rem;
	}

	ul {
		padding: 0.5rem;
	}

	li {
		position: relative;
		border-radius: var(--radius-lg);
		padding: 0.5rem 1.5rem;
		font-size: 0.875rem;
	}

	li.current {
		background-color: var(--primary);
	}

	li.unread::before {
		content: "";
		position: absolute;
		display: inline-block;
		border-radius: 50%;
		width: 0.5rem;
		height: 0.5rem;
		inset-inline-start: 0.25rem;
		inset-block-start: 50%;
		transform: translateY(-50%);
		/* border-radius: 50%; */
		background-color: var(--primary);
	}

	a {
		display: block;
		font-weight: 500;
		color: inherit;
		text-decoration: none;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	a:hover {
		text-decoration: underline;
	}

	a::after {
		content: "";
		position: absolute;
		inset: 0;
	}

	time {
		font-size: 0.75rem;
	}
</style>
