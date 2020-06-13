import { Base64 } from 'js-base64';

export type Base64String = string;
export type JsonString = string;

/**
 *
 * @param str json encoded in Base64
 */
export const decodeJsonLikeBase64 = <T = Record<string, unknown>>(str: Base64String): T | null => {
	try {
		return JSON.parse(Base64.decode(str));
	} catch (error) {
		console.error('Invalid Jsonlike Base64 string', error);
		return null;
	}
};
