export type URLDomain = string;
export type URLPath = string;

/**
 * TODO: extract protocol too
 */
export function separateUrl(url: string): [URLDomain, URLPath] {
	const urlMatch = url.match(/^(.*:\/\/)?(.*?)(\/(.*))?$/);
	return [urlMatch?.[2] as URLDomain, urlMatch?.[4] as URLPath];
}
