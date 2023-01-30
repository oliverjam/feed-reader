<script>
	import { page } from "$app/stores";

	/** @type {number | string}*/
	export let id;
	/** @type {boolean}*/
	let current = $page.data.feed.id == id;
</script>

<li class:current>
	<a href="/{id}"><slot /></a>
	{#if typeof id === "number"}
		<form class="inline" method="POST" action="/?/remove">
			<button name="id" value={id} aria-label="Remove feed"> &times; </button>
		</form>
	{/if}
</li>

<style>
	form {
		display: inline;
	}
	li {
		border-radius: var(--radius-lg);
		display: grid;
		grid-template-areas: auto;
		padding: 0.25rem 1.5rem;
		font-size: 0.875rem;
		font-weight: 500;
	}

	li.current {
		border-block-end: 2px solid var(--border);
		background-color: var(--primary);
	}

	li > * {
		grid-area: 1 / -1 / 1 / -1;
	}

	a:hover {
		text-decoration: underline;
	}

	form {
		justify-self: end;
	}

	button {
		opacity: 0;
		border: 0;
		aspect-ratio: 1;
		display: inline-grid;
		place-content: center;
		border-radius: 4px;
		background: var(--bg-mid);
		transition: opacity 0.2s;
	}

	li:hover button,
	button:focus {
		opacity: 1;
	}

	a {
		color: inherit;
		text-decoration: none;
	}
</style>
