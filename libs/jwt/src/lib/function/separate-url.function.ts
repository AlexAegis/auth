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
 * Returns the url split into parts
 */
export function separateUrl(url: string): SeparatedUrl {
	const urlMatch = url.match(/^((.*):\/\/)?([^/].*?)?(\/(.*))?$/);
	return {
		protocol: urlMatch?.[2] as UrlProtocol,
		domain: urlMatch?.[3] as UrlDomain,
		path: urlMatch?.[5] as UrlPath,
	};
}
