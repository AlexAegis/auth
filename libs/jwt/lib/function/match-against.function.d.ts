export declare const matchRule: (rule: string | RegExp, against?: string | null | undefined) => boolean;
/**
 *
 * @param inverse easy negating when composing
 */
export declare const matchAgainst: (against?: string | null | undefined, inverse?: boolean) => (rule: string | RegExp) => boolean;
