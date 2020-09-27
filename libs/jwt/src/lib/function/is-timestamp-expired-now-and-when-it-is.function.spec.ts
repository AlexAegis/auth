import { Observer } from 'rxjs';
import { isTimestampExpiredNowAndWhenItIs } from './is-timestamp-expired-now-and-when-it-is.function';

describe('isTimestampExpiredNowAndWhenItIs', () => {
	const mockObserver: Observer<unknown> = {
		next: jest.fn(),
		error: jest.fn(),
		complete: jest.fn(),
	};

	it('should just return true and complete immediately when the timestamp is already passed', () => {
		isTimestampExpiredNowAndWhenItIs(1).subscribe(mockObserver);

		expect(mockObserver.next).toBeCalledTimes(1);
		expect(mockObserver.next).toBeCalledWith(true);
		expect(mockObserver.error).toBeCalledTimes(0);
		expect(mockObserver.complete).toBeCalledTimes(1);
	});

	it('should just return false if it is not expired and then again when it will be', () => {
		const now = new Date().getTime();

		isTimestampExpiredNowAndWhenItIs(now + 10).subscribe(mockObserver);

		setTimeout(() => {
			expect(mockObserver.next).toBeCalledTimes(2);
			expect(mockObserver.next).toHaveBeenNthCalledWith(1, false);
			expect(mockObserver.next).toHaveBeenNthCalledWith(2, true);
			expect(mockObserver.error).toBeCalledTimes(0);
			expect(mockObserver.complete).toBeCalledTimes(1);
		}, 15);
	});
});
