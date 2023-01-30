import { error } from "@sveltejs/kit";
import * as feed from "$lib/model/feed.js";

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	let id = params.item_id;
	let item = feed.item(id);
	if (!item) {
		throw error(404, "missing");
	}
	return { item, id };
}
