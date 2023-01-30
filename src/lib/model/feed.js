import { db, sql } from "./db.js";

let select_etag = db.prepare(/*sql*/ `
  select etag from feeds where url = ?
`);

/**
 * @param {string} url
 * @returns {string=}
 */
export function etag(url) {
	return select_etag.get(url)?.etag;
}

let select_feeds = db.prepare(/*sql*/ `
  select id, url, title, updated from feeds
`);

/**
 * @returns {{
 *  id: number,
 *  url: string,
 *  title: string,
 *  updated: string,
 *  unread: number
 * }[]}
 */
export function list() {
	let feeds = select_feeds.all();
	for (let feed of feeds) {
		feed.unread = count_unread.get(feed.id)?.count;
	}
	return feeds;
}

let select_feed = db.prepare(/*sql*/ `
  select title, url from feeds where id = ?
`);

/**
 * @param {number} id
 * @returns {{title: string, url: string}=}
 */
export function get(id) {
	return select_feed.get(id);
}

let select_items = db.prepare(/*sql*/ `
  select id, url, title, read, star, pubDate
  from items
  where feed = coalesce(:id, feed)
  and read = coalesce(:read, read)
  order by read, pubDate desc
`);

/**
 * @param {{ id?: number; read?: 0 | 1 }} where
 * @returns {{
 *  id: number,
 *  url: string,
 *  title: string,
 *  read: 0 | 1,
 *  star: 0 | 1,
 *  pubDate: string,
 * }[]}
 */

export function items({ id, read } = {}) {
	return select_items.all({ id, read });
}

let remove_items = db.prepare(/*sql*/ `
  delete from items where feed = ?
`);

let remove_feed = db.prepare(/*sql*/ `
  delete from feeds where id = ?
`);

/**
 * @param {string} id
 */
export function remove(id) {
	remove_items.run(id);
	remove_feed.run(id);
}

let count_unread = sql`
  select count(*) as count from items
  where feed = coalesce(?, feed)
  and read = 0
`;
/**
 * @param {number?} id
 * @returns {number}
 */
export function unread(id = null) {
	return count_unread.get(id)?.count;
}

let select_item = db.prepare(/*sql*/ `
  select
    items.title,
    feeds.title as feed_title,
    items.pubDate,
    items.url,
    items.description
  from items
  join feeds on items.feed = feeds.id
  where items.id = ?
`);

/**
@param {string} id
@returns {{
  title: string,
  feed_title: string,
  pubDate: string,
  url: string,
  description: string,
  read: 0 | 1,
  star: 0 | 1
}}
*/
export function item(id) {
	return select_item.get(id);
}

let insert_item = db.prepare(/*sql*/ `
  insert into items (url, title, feed, pubDate, description)
  values (:url, :title, :feed, :pubDate, :description)
`);

/**
@typedef {{
  id?: string,
  title?: string,
  link?: string,
  description?: string,
  pubDate?: Date,
}} FeedItem
*/

/**
@typedef {{
  type: string,
  id?: string,
  title?: string,
  link?: string,
  description?: string,
  updated?: Date,
  author?: string,
  items: FeedItem[],
}} Feed
*/

let insert_feed = db.prepare(/*sql*/ `
  insert into feeds (url, title, updated, etag, raw)
  values (:url, :title, :updated, :etag, :raw)
  on conflict (url) do update set
    title = :title,
    updated = :updated,
    etag = :etag,
    raw = :raw
  returning id
`);

/**
 * @param {string} url
 * @param {Feed} Feed
 * @param {string} raw
 * @param {string?} etag
 */
export function save(url, { items, title, updated }, raw, etag = null) {
	let feed = insert_feed.get({
		title,
		updated: updated?.toISOString(),
		raw,
		url,
		etag
	});
	for (let { id, title, link, description, pubDate } of items) {
		insert_item.run({
			url: id,
			title,
			link,
			description,
			pubDate: pubDate?.toISOString(),
			feed: feed.id
		});
	}
	return feed.id;
}
