import { Base64 } from 'js-base64';
import { decodeJsonLikeBase64 } from '../function/base64-decoder.function';
import { isUnixTimestampExpired } from '../function/is-unix-timestamp-expired.function';
export class JwtToken {
    constructor(header, payload, signature) {
        this.header = header;
        this.payload = payload;
        this.signature = signature;
    }
    static from(token) {
        const convertedSegments = JwtToken.splitTokenString(token);
        if (!convertedSegments) {
            return null;
        }
        const header = decodeJsonLikeBase64(convertedSegments[0]);
        const payload = decodeJsonLikeBase64(convertedSegments[1]);
        const signature = Base64.decode(convertedSegments[2]); // Not used, only for validation
        if (!header || !payload || !signature) {
            return null;
        }
        return new JwtToken(header, payload, signature);
    }
    static stripScheme(jwtHeaderValue, scheme) {
        return jwtHeaderValue.substring((scheme !== null && scheme !== void 0 ? scheme : '').length);
    }
    static splitTokenString(token, separator = JwtToken.JWT_TOKEN_SEPARATOR) {
        const spl = token.split(separator);
        if (spl.length !== 3) {
            return null;
        }
        return spl;
    }
    isExpired() {
        return isUnixTimestampExpired(this.payload.exp);
    }
}
JwtToken.JWT_TOKEN_SEPARATOR = '.';
//# sourceMappingURL=jwt-token.class.js.map