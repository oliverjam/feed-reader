import Database from "better-sqlite3";
import { DB_PATH } from "$env/static/private";
import { readFileSync } from "node:fs";

export let db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");

let schema = readFileSync("src/lib/model/schema.sql", "utf-8");
db.exec(schema);

/**
 * @param {TemplateStringsArray} strings
 * @param  {unknown[]} args
 * @returns
 */
export function sql(strings, ...args) {
	let query = strings.map((s, i) => s + (args[i] || "")).join("");
	return db.prepare(query);
}
