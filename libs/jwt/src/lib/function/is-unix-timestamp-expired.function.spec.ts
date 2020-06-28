import { isUnixTimestampExpired } from './is-unix-timestamp-expired.function';

describe('isUnixTimestampExpired', () => {
	it('can detect undefined as expired', () => {
		const result = isUnixTimestampExpired(undefined);
		expect(result).toBeTruthy();
	});

	it('can detect a future value as non-expired', () => {
		const result = isUnixTimestampExpired(new Date().getTime() / 1000 + 10000);
		expect(result).toBeFalsy();
	});

	it('can detect a past value as expired', () => {
		const result = isUnixTimestampExpired(new Date().getTime() / 1000 - 10000);
		expect(result).toBeTruthy();
	});
});
