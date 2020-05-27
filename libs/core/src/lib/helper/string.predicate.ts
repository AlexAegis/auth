export const isString = <(a?: string | null) => a is string>(
	((token) => token ?? typeof token === 'string')
);
