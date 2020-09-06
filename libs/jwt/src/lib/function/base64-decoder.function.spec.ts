import { decodeJsonLikeBase64 } from './base64-decoder.function';

describe('decodeJsonLikeBase64', () => {
	it('can decode an object', () => {
		const result = decodeJsonLikeBase64<{ hello: 'world' }>('eyJoZWxsbyI6ICJ3b3JsZCJ9');
		expect(result?.hello).toEqual('world');
	});

	it('can not decode garbage, logs the error and returns null', () => {
		console.error = jest.fn();
		const result = decodeJsonLikeBase64<unknown>('foo');
		expect(console.error).toHaveBeenCalledTimes(1);
		expect(result).toBeNull();
	});
});
