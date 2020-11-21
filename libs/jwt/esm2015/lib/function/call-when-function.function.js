import { isFunction } from './function.predicate';
export const callWhenFunction = (functionLike) => {
    let result;
    if (isFunction(functionLike)) {
        result = functionLike();
    }
    else {
        result = functionLike;
    }
    return result;
};
//# sourceMappingURL=call-when-function.function.js.map