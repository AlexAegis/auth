export const isString = (stringLike: unknown): stringLike is string =>
	typeof stringLike === 'string';
