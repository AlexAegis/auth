import { decodeJsonLikeBase64 } from './base64-decoder.function';

describe('decode', () => {
	it('can decode an object', () => {
		// "{ "hello": "world" }"
		const result = decodeJsonLikeBase64<{ hello: 'world' }>('eyJoZWxsbyI6ICJ3b3JsZCJ9');

		expect(result?.hello).toEqual('world');
	});
});
