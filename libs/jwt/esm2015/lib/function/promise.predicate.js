/**
 * Returns true if the object is truthy and has a `then` and a `catch` function.
 * Using `instanceof` would not be sufficient as Promises can be contructed
 * in many ways, and it's just a specification.
 */
export const isPromise = (promiseLike) => !!promiseLike &&
    typeof promiseLike.then === 'function' &&
    typeof promiseLike.catch === 'function';
//# sourceMappingURL=promise.predicate.js.map