import { isString } from './string.predicate';

export const matchRule = (rule: string | RegExp, against?: string | null): boolean => {
	if (isString(rule)) return rule === against;
	else if (against) return rule.test(against);
	else return false;
};

/**
 *
 * @param inverse easy negating when composing
 */
export const matchAgainst = (against?: string | null, inverse = false) => (
	rule: string | RegExp
): boolean => (inverse ? !matchRule(rule, against) : matchRule(rule, against));
