export declare const matchRule: (rule: string | RegExp, against?: string | null) => boolean;
/**
 *
 * @param inverse easy negating when composing
 */
export declare const matchAgainst: (against?: string | null, inverse?: boolean) => (rule: string | RegExp) => boolean;
