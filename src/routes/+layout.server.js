import * as feed from "$lib/model/feed.js";

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
	let feeds = feed.list();
	let unread = feed.unread();
	return { feeds, unread };
}
