export declare type Base64String = string;
export declare type JsonString = string;
/**
 *
 * @param str json encoded in Base64
 */
export declare const decodeJsonLikeBase64: <T = Record<string, unknown>>(str: Base64String) => T | null;
