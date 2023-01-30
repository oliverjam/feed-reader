import { fail, redirect } from "@sveltejs/kit";
import * as feed from "$lib/model/feed.js";
import { scrape } from "$lib/scraper.js";

/** @type {import('./$types').Actions} */
export const actions = {
	save: async ({ request }) => {
		console.log("POST to save URL");
		let body = await request.formData();
		let url = body.get("url");
		console.log(`URL is ${url}`);
		if (!url || typeof url !== "string") {
			return fail(400, { url, missing: true });
		}
		let etag = feed.etag(url);
		if (etag) {
			// we already have this feed so no need to re-scrape
			let referer = request.headers.get("referer");
			throw redirect(303, referer || "/");
		}
		// we don't have this feed so scrape and save to DB
		let id = await scrape(url);
		throw redirect(303, `/${id}`);
	},
	remove: async ({ request }) => {
		let body = await request.formData();
		let id = body.get("id");
		if (!id || typeof id !== "string") {
			return fail(400, { id, missing: true });
		}
		feed.remove(id);
		let referer = request.headers.get("referer");
		throw redirect(303, referer || "/");
	}
};
