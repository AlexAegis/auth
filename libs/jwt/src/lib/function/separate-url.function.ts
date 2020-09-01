export type UrlProtocol = string;
export type UrlDomain = string;
export type UrlPath = string;

/**
 * An url separated into optional parts, the separators are not included.
 * Separator between protocol and domain is `://`, and between domain
 * and path is `/`.
 */
export interface SeparatedUrl {
	/**
	 * @example `http`
	 */
	protocol?: UrlProtocol;

	/**
	 * @example `localhost`
	 */
	domain?: UrlDomain;

	/**
	 * @example `foo/bar`
	 */
	path?: UrlPath;
}

/**
 * Returns the url split into parts, without the separators.
 * Separator between protocol and domain is `://`, and between domain
 * and path is `/`.
 */
export function separateUrl(url?: string): SeparatedUrl {
	let urlMatch;
	if (url !== undefined) {
		urlMatch = url.match(/^((.*):\/\/)?([^/].*?)?(\/(.*))?$/);
	}
	if (!urlMatch) {
		return {
			protocol: undefined,
			domain: undefined,
			path: undefined,
		};
	}
	return {
		protocol: urlMatch[2] as UrlProtocol,
		domain: urlMatch[3] as UrlDomain,
		path: urlMatch[5] as UrlPath,
	};
}
