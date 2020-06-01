export function isString(stringLike: unknown): stringLike is string {
	return typeof stringLike === 'string';
}
