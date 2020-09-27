const mockIsTimestampExpiredNowAndWhenItIs = jest.fn();

jest.mock('./is-timestamp-expired-now-and-when-it-is.function', () => ({
	isTimestampExpiredNowAndWhenItIs: mockIsTimestampExpiredNowAndWhenItIs,
}));

import { isUnixTimestampExpiredNowAndWhenItIs } from './is-unix-timestamp-expired-now-and-when-it-is.function';

describe('isUnixTimestampExpiredNowAndWhenItIs', () => {
	it('should just call the other function with seconds converted to milliseconds', () => {
		const timestamp = 1;
		isUnixTimestampExpiredNowAndWhenItIs(timestamp);
		expect(mockIsTimestampExpiredNowAndWhenItIs).toHaveBeenCalledWith(1000);
	});
});
