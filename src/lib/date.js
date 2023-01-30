/** @param {string} s*/
export function short(s) {
	return new Date(s).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "2-digit"
	});
}

/** @param {string} s*/
export function long(s) {
	return new Date(s).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric"
	});
}
