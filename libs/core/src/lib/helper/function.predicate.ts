export function isFunction<Return>(funlike: unknown): funlike is () => Return {
	return typeof funlike === 'function';
}
