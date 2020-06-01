export function isPromise<T>(promiseLike: unknown): promiseLike is Promise<T> {
	return promiseLike && typeof (promiseLike as Promise<T>).then === 'function';
}
