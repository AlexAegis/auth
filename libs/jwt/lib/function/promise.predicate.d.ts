/**
 * Returns true if the object is truthy and has a `then` and a `catch` function.
 * Using `instanceof` would not be sufficient as Promises can be contructed
 * in many ways, and it's just a specification.
 */
export declare function isPromise<T>(promiseLike: unknown): promiseLike is Promise<T>;
