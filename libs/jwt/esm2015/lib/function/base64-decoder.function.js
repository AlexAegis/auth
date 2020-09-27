import { Base64 } from 'js-base64';
/**
 *
 * @param str json encoded in Base64
 */
export const decodeJsonLikeBase64 = (str) => {
    try {
        return JSON.parse(Base64.decode(str));
    }
    catch (error) {
        console.error('Invalid Jsonlike Base64 string', error);
        return null;
    }
};
//# sourceMappingURL=base64-decoder.function.js.map