import { Base64 } from 'js-base64';
import { Base64String, decodeJsonLikeBase64 } from './base64-decoder.function';

export type JwtTokenString = string;
export type UnixTime = number;

export interface JwtTokenHeader {
	alg: string; // Algorithm used to encode the signature
	typ: string; // Type of token
}

export interface JwtTokenPayload {
	nonce?: string;
	/**
	 * Audience
	 *
	 * validated against a client ID
	 */
	aud?: string;
	/**
	 * Issuer
	 */
	iss?: string;
	/**
	 * Issued at
	 */
	iat: UnixTime;
	/**
	 * Expires at
	 */
	exp?: UnixTime;
	/**
	 * Subject
	 */
	sub?: string;
	/**
	 * Claims
	 */
	[key: string]: unknown;
}

/**
 * Common token pair
 */
export interface JwtTokenPair {
	accessToken: JwtTokenString;
	refreshToken: JwtTokenString;
}

export class JwtToken {
	private constructor(
		public header: JwtTokenHeader,
		public payload: JwtTokenPayload,
		public signature: string
	) {}
	public static JWT_TOKEN_SEPARATOR = '.';

	public static from(token: JwtTokenString): JwtToken | null {
		const convertedSegments = JwtToken.splitTokenString(token);
		if (!convertedSegments) return null;

		const header = decodeJsonLikeBase64<JwtTokenHeader>(convertedSegments[0]);
		const payload = decodeJsonLikeBase64<JwtTokenPayload>(convertedSegments[1]);
		const signature = Base64.decode(convertedSegments[2]); // Not used, only for validation
		if (!header || !payload || !signature) return null;

		return new JwtToken(header, payload, signature);
	}

	public static splitTokenString = (
		token: JwtTokenString,
		separator: string = JwtToken.JWT_TOKEN_SEPARATOR
	): [Base64String, Base64String, Base64String] | null => {
		const spl = token.split(separator);
		if (spl.length !== 3) {
			return null;
		}
		return spl as [Base64String, Base64String, Base64String];
	};
}
