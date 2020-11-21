/**
 * Returns true if the object is truthy and has a `then` and a `catch` function.
 * Using `instanceof` would not be sufficient as Promises can be contructed
 * in many ways, and it's just a specification.
 */
export const isPromise = <T>(promiseLike: unknown): promiseLike is Promise<T> =>
	promiseLike &&
	typeof (promiseLike as Promise<T>).then === 'function' &&
	typeof (promiseLike as Promise<T>).catch === 'function';
