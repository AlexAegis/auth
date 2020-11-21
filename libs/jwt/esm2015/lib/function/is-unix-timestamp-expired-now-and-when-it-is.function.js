import { isTimestampExpiredNowAndWhenItIs } from './is-timestamp-expired-now-and-when-it-is.function';
/**
 * It returns an observable which emits instantly a boolean describing if the
 * timestamp is expired or not. If not, it will emit a second time when it
 * will expire.
 *
 * @param unixTimestamp seconds from the unix epoch 1970-01-01T00:00:00Z
 * if not supplied it will always be expired
 */
export const isUnixTimestampExpiredNowAndWhenItIs = (unixTimestamp) => isTimestampExpiredNowAndWhenItIs(Math.floor(unixTimestamp * 1000));
//# sourceMappingURL=is-unix-timestamp-expired-now-and-when-it-is.function.js.map