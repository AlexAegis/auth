export declare type UrlProtocol = string;
export declare type UrlDomain = string;
export declare type UrlPath = string;
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
export declare function separateUrl(url?: string): SeparatedUrl;
