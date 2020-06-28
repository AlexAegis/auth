export type UrlProtocol = string;
export type UrlDomain = string;
export type UrlPath = string;

export interface SeparatedUrl {
	protocol?: UrlProtocol;
	domain?: UrlDomain;
	path?: UrlPath;
}
/**
 * Returns the url split into parts
 */
export function separateUrl(url: string): SeparatedUrl {
	const urlMatch = url.match(/^((.*):\/\/)?(.*?)(\/(.*))?$/);
	return {
		protocol: urlMatch?.[2] as UrlProtocol,
		domain: urlMatch?.[3] as UrlDomain,
		path: urlMatch?.[5] as UrlPath,
	};
}
