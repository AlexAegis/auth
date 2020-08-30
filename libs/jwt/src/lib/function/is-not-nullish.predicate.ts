export function isNotNullish<T>(t: T | undefined | null): t is T {
	return t !== undefined && t !== null;
}
