/**
 *
 * @param epoch if not supplied it will always be expired
 */
export function isExpired(epoch = -Infinity): boolean {
	return epoch < Math.floor(new Date().getTime() / 1000);
}
