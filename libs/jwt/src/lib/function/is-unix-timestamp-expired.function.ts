/**
 *
 * @param unixTimestamp seconds from the unix epoch 1970-01-01T00:00:00Z
 * if not supplied it will always be expired
 */
export function isUnixTimestampExpired(unixTimestamp: number | null = -Infinity): boolean {
	return unixTimestamp ? unixTimestamp < Math.floor(new Date().getTime() / 1000) : true;
}
