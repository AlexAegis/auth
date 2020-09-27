import { Base64String } from '../function/base64-decoder.function';
export declare type JwtTokenString = string;
export declare type UnixTime = number;
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
export declare class JwtToken<Claims = Record<string | number, unknown>> {
    header: JwtTokenHeader;
    payload: JwtTokenPayload & Claims;
    signature: string;
    constructor(header: JwtTokenHeader, payload: JwtTokenPayload & Claims, signature: string);
    static JWT_TOKEN_SEPARATOR: string;
    static from<Claims = Record<string | number, unknown>>(token: JwtTokenString): JwtToken<Claims> | null;
    static stripScheme(jwtHeaderValue: string, scheme?: string): JwtTokenString;
    static splitTokenString(token: JwtTokenString, separator?: string): [Base64String, Base64String, Base64String] | null;
    isExpired(): boolean;
}
