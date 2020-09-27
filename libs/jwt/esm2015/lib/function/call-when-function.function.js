import { isFunction } from './function.predicate';
export function callWhenFunction(functionLike) {
    let result;
    if (isFunction(functionLike)) {
        result = functionLike();
    }
    else {
        result = functionLike;
    }
    return result;
}
//# sourceMappingURL=call-when-function.function.js.map