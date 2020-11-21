export const isFunction = <Return>(funlike: unknown): funlike is () => Return =>
	typeof funlike === 'function';
