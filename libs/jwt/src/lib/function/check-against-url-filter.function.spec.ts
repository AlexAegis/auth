import { checkAgainstUrlFilter } from './check-against-url-filter.function';
import { SeparatedUrl } from './separate-url.function';

describe('checkAgainstUrlFilter', () => {
	const FOO = 'foo';
	const BAR = 'bar';
	const FOO_REGEX = /foo.*/;
	const BAR_REGEX = /bar.*/;

	const fullFooUrl: SeparatedUrl = {
		domain: FOO,
		protocol: FOO,
		path: FOO,
	};

	it('can pass without any rules', () =>
		expect(checkAgainstUrlFilter({}, fullFooUrl)).toBeTruthy());

	it('can detect blacklisted domain as invalid with partial url', () =>
		expect(
			checkAgainstUrlFilter(
				{
					domainBlacklist: [FOO],
				},
				{
					domain: FOO,
				}
			)
		).toBeFalsy());

	it('can detect regex blacklisted domain for full url', () =>
		expect(
			checkAgainstUrlFilter(
				{
					domainBlacklist: [FOO_REGEX],
				},
				fullFooUrl
			)
		).toBeFalsy());

	it('can still pass when regex blacklisted path is for another url', () =>
		expect(
			checkAgainstUrlFilter(
				{
					pathBlacklist: [BAR_REGEX],
				},
				{
					domain: FOO,
					path: FOO,
				}
			)
		).toBeTruthy());

	it('can still pass when regex blacklisted path when there is no path', () =>
		expect(
			checkAgainstUrlFilter(
				{
					pathBlacklist: [BAR_REGEX],
				},
				{
					domain: FOO,
				}
			)
		).toBeTruthy());

	it('can detect regex blacklisted domain for full url even if it is also whitelisted', () =>
		expect(
			checkAgainstUrlFilter(
				{
					domainBlacklist: [FOO_REGEX],
					domainWhitelist: [FOO],
				},
				fullFooUrl
			)
		).toBeFalsy());

	it('can detect that the url is not whitelisted', () =>
		expect(
			checkAgainstUrlFilter(
				{
					domainWhitelist: [BAR],
				},
				fullFooUrl
			)
		).toBeFalsy());

	it('can be always falsy when a whitelist ruleset is empty', () =>
		expect(
			checkAgainstUrlFilter(
				{
					protocolWhitelist: [],
				},
				fullFooUrl
			)
		).toBeFalsy());

	it('can be always falsy when a whitelist ruleset is empty even if there is no such segment', () =>
		expect(
			checkAgainstUrlFilter(
				{
					pathWhitelist: [],
				},
				{
					domain: FOO,
				}
			)
		).toBeFalsy());

	it('can be still be truthy when a blacklist ruleset is empty', () =>
		expect(
			checkAgainstUrlFilter(
				{
					domainBlacklist: [],
				},
				{
					domain: FOO,
				}
			)
		).toBeTruthy());

	it('can detect a full match', () =>
		expect(
			checkAgainstUrlFilter(
				{
					protocolWhitelist: [FOO],
					protocolBlacklist: [BAR],
					domainWhitelist: [FOO],
					domainBlacklist: [BAR],
					pathWhitelist: [FOO],
					pathBlacklist: [BAR],
				},
				fullFooUrl
			)
		).toBeTruthy());
});
