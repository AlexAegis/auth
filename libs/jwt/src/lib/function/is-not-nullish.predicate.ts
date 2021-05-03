export const isNotNullish = <T>(t: T | undefined | null): t is T => t !== undefined && t !== null;
