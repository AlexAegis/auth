import { isString } from './string.predicate';
export const matchRule = (rule, against) => {
    if (isString(rule)) {
        return rule === against;
    }
    else if (against) {
        return rule.test(against);
    }
    else {
        return false;
    }
};
/**
 *
 * @param inverse easy negating when composing
 */
export const matchAgainst = (against, inverse = false) => (rule) => inverse ? !matchRule(rule, against) : matchRule(rule, against);
//# sourceMappingURL=match-against.function.js.map