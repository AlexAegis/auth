import { separateUrl } from './separate-url.function';

describe('separateUrl', () => {
	const PROTOCOL = 'http';
	const SIMPLE_DOMAIN = 'localhost';
	const COMPLEX_DOMAIN = 'www.foo.bar';
	const SHORT_PATH = 'path';
	const LONG_PATH = 'path/2';
	const EMPTY = '';

	it('can split up a simple full url', () => {
		const { protocol, domain, path } = separateUrl(
			`${PROTOCOL}://${SIMPLE_DOMAIN}/${SHORT_PATH}`
		);

		expect(protocol).toBe(PROTOCOL);
		expect(domain).toBe(SIMPLE_DOMAIN);
		expect(path).toBe(SHORT_PATH);
	});

	it('can split up a complex full url', () => {
		const { protocol, domain, path } = separateUrl(
			`${PROTOCOL}://${COMPLEX_DOMAIN}/${LONG_PATH}`
		);

		expect(protocol).toBe(PROTOCOL);
		expect(domain).toBe(COMPLEX_DOMAIN);
		expect(path).toBe(LONG_PATH);
	});

	it('can split up an url without a protocol', () => {
		const { protocol, domain, path } = separateUrl(`${SIMPLE_DOMAIN}/${SHORT_PATH}`);

		expect(protocol).toBeUndefined();
		expect(domain).toBe(SIMPLE_DOMAIN);
		expect(path).toBe(SHORT_PATH);
	});

	it('can split up an url without a protocol and a path', () => {
		const { protocol, domain, path } = separateUrl(`${SIMPLE_DOMAIN}`);

		expect(protocol).toBeUndefined();
		expect(domain).toBe(SIMPLE_DOMAIN);
		expect(path).toBeUndefined();
	});

	it('can split up an url without a path', () => {
		const { protocol, domain, path } = separateUrl(`${PROTOCOL}://${COMPLEX_DOMAIN}`);

		expect(protocol).toBe(PROTOCOL);
		expect(domain).toBe(COMPLEX_DOMAIN);
		expect(path).toBeUndefined();
	});

	it('can work with an empty url', () => {
		const { protocol, domain, path } = separateUrl(EMPTY);

		expect(protocol).toBeUndefined();
		expect(domain).toBeUndefined();
		expect(path).toBeUndefined();
	});

	it('can work with a non-existent url', () => {
		const { protocol, domain, path } = separateUrl(undefined);

		expect(protocol).toBeUndefined();
		expect(domain).toBeUndefined();
		expect(path).toBeUndefined();
	});

	it('can work with only a path', () => {
		const { protocol, domain, path } = separateUrl(`/${LONG_PATH}`);

		expect(protocol).toBeUndefined();
		expect(domain).toBeUndefined();
		expect(path).toBe(LONG_PATH);
	});
});
