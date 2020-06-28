import { separateUrl } from './separate-url.function';

describe('separateUrl', () => {
	const PROTOCOL = 'http';
	const SIMPLE_DOMAIN = 'localhost';
	const COMPLEX_DOMAIN = 'www.foo.bar';
	const SHORT_PATH = 'path';
	const LONG_PATH = 'path/2';

	it('can split up a simple full url', () => {
		const { domain, path, protocol } = separateUrl(
			`${PROTOCOL}://${SIMPLE_DOMAIN}/${SHORT_PATH}`
		);

		expect(protocol).toBe(PROTOCOL);
		expect(domain).toBe(SIMPLE_DOMAIN);
		expect(path).toBe(SHORT_PATH);
	});

	it('can split up a complex full url', () => {
		const { domain, path, protocol } = separateUrl(
			`${PROTOCOL}://${COMPLEX_DOMAIN}/${LONG_PATH}`
		);

		expect(protocol).toBe(PROTOCOL);
		expect(domain).toBe(COMPLEX_DOMAIN);
		expect(path).toBe(LONG_PATH);
	});

	it('can split up an url without a protocol', () => {
		const { domain, path, protocol } = separateUrl(`${SIMPLE_DOMAIN}/${SHORT_PATH}`);

		expect(protocol).toBeFalsy();
		expect(domain).toBe(SIMPLE_DOMAIN);
		expect(path).toBe(SHORT_PATH);
	});

	it('can split up an url without a protocol and a path', () => {
		const { domain, path, protocol } = separateUrl(`${SIMPLE_DOMAIN}`);

		expect(protocol).toBeFalsy();
		expect(domain).toBe(SIMPLE_DOMAIN);
		expect(path).toBeFalsy();
	});

	it('can split up an url without a path', () => {
		const { domain, path, protocol } = separateUrl(`${PROTOCOL}://${COMPLEX_DOMAIN}`);

		expect(protocol).toBe(PROTOCOL);
		expect(domain).toBe(COMPLEX_DOMAIN);
		expect(path).toBeFalsy();
	});
});
