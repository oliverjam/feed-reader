<script>
	import { long } from "$lib/date.js";

	/** @type {import('./$types').PageData} */
	export let data;
</script>

<svelte:head>
	<title>{data.item.title}</title>
</svelte:head>
<section>
	<header>
		<p>{data.item.feed_title}</p>
		<a href={data.item.url} target="_blank" rel="noreferrer">
			<h1>{data.item.title}</h1>
		</a>
		<time datetime={data.item.pubDate}>
			{long(data.item.pubDate)}
		</time>
	</header>
	<main>{@html data.item.description}</main>
</section>

<style>
	section {
		overflow-y: auto;
		padding: 3rem;
	}

	p {
		border-block-end: 2px solid var(--border);
		padding-block-end: 1rem;
	}

	h1 {
		padding-block-start: 1rem;
		font-size: 2rem;
		line-height: 1;
	}

	a {
		color: inherit;
		text-decoration: none;
	}

	a:hover {
		text-decoration: underline;
	}

	time {
		display: block;
		margin-block-start: 0.75rem;
		font-size: 1.125rem;
	}

	main {
		margin-block-start: 2rem;
		line-height: 1.6;
		font-size: 1.125rem;
	}

	main :global(pre) {
		overflow: auto;
		padding: 1rem;
		font-size: 1rem;
		background-color: var(--bg-mid);
	}

	main > :global(* + *) {
		margin-top: var(--space-y, 1.5rem);
	}

	main > :global(:is(h1, h2, h3, h4, h5, h6)) {
		--space-y: 1.5em;
	}
</style>
