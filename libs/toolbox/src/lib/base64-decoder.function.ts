import { Base64 } from 'js-base64';

export type Base64String = string;
export type JsonString = string;

/**
 * A thin typed wrapper over Base64.decode
 * @param str To be decoded
 */
export const decode = (str: Base64String): JsonString => Base64.decode(str);

export const decodeJsonLikeBase64 = <T = {}>(str: Base64String): T => JSON.parse(decode(str));
