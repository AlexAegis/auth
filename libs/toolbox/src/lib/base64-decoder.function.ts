import { Base64 } from 'js-base64';
import { countInString } from './toolbox';

export type JwtToken = string;
export type Base64String = string;
export type JsonString = string;

export const JWT_TOKEN_SEPARATOR = '.';
/**
 * A thin typed wrapper over Base64.decode
 * @param str To be decoded
 */
export const decode = (str: Base64String): JsonString => Base64.decode(str);

export const decodeJson = <T = object>(str: Base64String): T => JSON.parse(decode(str));

export const validateToken = (token: JwtToken): number => countInString(token, JWT_TOKEN_SEPARATOR);

export const splitToken = (token: JwtToken): [Base64String, Base64String, Base64String] => {
	if (!validateToken(token)) {
		throw new Error('Invalid token!');
	}
	const spl = token.split('.');
	if (spl.length !== 3) {
		throw new Error('Invalid token!');
	}
	return spl as [Base64String, Base64String, Base64String];
};
