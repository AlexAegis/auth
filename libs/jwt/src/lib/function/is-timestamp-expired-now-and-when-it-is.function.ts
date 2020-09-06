import { merge, Observable, of, timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';

/**
 * It returns an observable which emits instantly a boolean describing if the
 * timestamp is expired or not. If not, it will emit a second time when it
 * will expire.
 *
 * @param timestamp milliseconds
 */
export const isTimestampExpiredNowAndWhenItIs = (timestamp: number): Observable<boolean> => {
	// If already expired, just return that
	if (timestamp - new Date().getTime() < 0) {
		return of(true);
	} else {
		// If not, return that is not and a timer that will emit when it does
		return merge(of(false), timer(new Date(timestamp)).pipe(mapTo(true)));
	}
};
