import { parseFeed } from "htmlparser2";
import { save } from "$lib/model/feed.js";

/**
 * @param {string} url
 * @param {string=} prev_etag
 */
export async function scrape(url, prev_etag) {
	let req = new Request(url);
	if (prev_etag) {
		// etag header has to be double-quoted
		req.headers.set("if-none-match", `"${prev_etag}"`);
	}
	let res = await fetch(req);
	if (res.ok) {
		if (res.status === 304) {
			// feed is unchanged
			return;
		}
		let etag = res.headers.get("etag");
		let type = res.headers.get("content-type");
		switch (type) {
			case "application/atom+xml":
			case "application/xml":
			case "text/xml": {
				let raw = await res.text();
				let feed = parseFeed(raw);
				if (feed) {
					return save(url, feed, raw, etag);
				} else {
					throw new Error("Invalid feed");
				}
				// if (!data.feed) {
				//   throw new Error("Invalid feed");
				// }
				// let feed = feed_schema.parse(data.feed);
				// let entries = entries_schema.parse(data.feed);
				// await save({ ...feed, url, etag, raw }, entries);
			}
			case "application/feed+json":
			case "application/json": {
				// let data = await res.json();
				throw new Error("JSON not supported yet");
			}
			default:
				throw new Error(`Content-type: ${type} is not supported`);
		}
	}
}
