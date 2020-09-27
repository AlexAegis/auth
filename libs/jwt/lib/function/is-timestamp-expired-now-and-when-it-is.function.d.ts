import { Observable } from 'rxjs';
/**
 * It returns an observable which emits instantly a boolean describing if the
 * timestamp is expired or not. If not, it will emit a second time when it
 * will expire.
 *
 * @param timestamp milliseconds
 */
export declare const isTimestampExpiredNowAndWhenItIs: (timestamp: number) => Observable<boolean>;
