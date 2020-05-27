import { Base64 } from 'js-base64';

export type Base64String = string;
export type JsonString = string;

export const decodeJsonLikeBase64 = <T = Record<string, unknown>>(str: Base64String): T =>
	JSON.parse(Base64.decode(str));
