import { Base64 } from 'js-base64';
import { Base64String, decodeJsonLikeBase64 } from '../function/base64-decoder.function';
import { isUnixTimestampExpired } from '../function/is-unix-timestamp-expired.function';

export type JwtTokenString = string;
export type UnixTime = number;

export interface JwtTokenHeader {
	/**
	 * Media type
	 */
	typ?: string;
	/**
	 * Content Type
	 */
	cty?: 'JWT' | string;
	/**
	 * Algorithm
	 */
	alg: string;
	/**
	 * Encryption
	 */
	enc?: string;
}

/**
 * Registered claim names defined in RFC 7519 are predefined here.
 */
export interface JwtTokenPayload {
	/**
	 * Issuer
	 */
	iss?: string;
	/**
	 * Subject
	 */
	sub?: string;
	/**
	 * Audience
	 */
	aud?: string;
	/**
	 * Expiration Time
	 */
	exp: UnixTime;
	/**
	 * Not Before
	 */
	nbf?: UnixTime;
	/**
	 * Issued at
	 */
	iat?: UnixTime;
	/**
	 * JWT ID
	 */
	jti?: string;
}

/**
 * Common token pair
 */
export interface JwtTokenPair {
	accessToken: JwtTokenString;
	refreshToken: JwtTokenString;
}

export class JwtToken<Claims = Record<string | number, unknown>> {
	public constructor(
		public header: JwtTokenHeader,
		public payload: JwtTokenPayload & Claims,
		public signature: string
	) {}
	public static JWT_TOKEN_SEPARATOR = '.';

	public static from<Claims = Record<string | number, unknown>>(
		token: JwtTokenString
	): JwtToken<Claims> | null {
		const convertedSegments = JwtToken.splitTokenString(token);
		if (!convertedSegments) return null;

		const header = decodeJsonLikeBase64<JwtTokenHeader>(convertedSegments[0]);
		const payload = decodeJsonLikeBase64<JwtTokenPayload & Claims>(convertedSegments[1]);
		const signature = Base64.decode(convertedSegments[2]); // Not used, only for validation
		if (!header || !payload || !signature) return null;

		return new JwtToken<Claims>(header, payload, signature);
	}

	public static stripScheme(jwtHeaderValue: string, scheme?: string): JwtTokenString {
		return jwtHeaderValue.substring((scheme ?? '').length);
	}

	public static splitTokenString(
		token: JwtTokenString,
		separator: string = JwtToken.JWT_TOKEN_SEPARATOR
	): [Base64String, Base64String, Base64String] | null {
		const spl = token.split(separator);
		if (spl.length !== 3) {
			return null;
		}
		return spl as [Base64String, Base64String, Base64String];
	}

	public isExpired(): boolean {
		return isUnixTimestampExpired(this.payload.exp);
	}
}
