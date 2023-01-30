import { error } from "@sveltejs/kit";
import * as $feed from "$lib/model/feed.js";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params }) {
	let id = params.feed_id;
	let title = "";
	let items = [];
	if (id === "unread") {
		title = "Unread";
		items = $feed.items({ read: 0 });
	} else {
		let feed = $feed.get(+id);
		if (!feed) {
			throw error(404, "missing");
		}
		title = feed.title;
		items = $feed.items({ id: +id });
		if (!items) {
			throw error(404, "missing");
		}
	}
	let unread = 0;
	for (let item of items) {
		if (item.read === 0) unread += 1;
	}
	return { feed: { id, title, unread }, items };
}
