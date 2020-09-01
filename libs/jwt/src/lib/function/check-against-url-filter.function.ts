import { UrlFilter } from '../model/header-configuration.interface';
import { matchAgainst } from './match-against.function';
import { SeparatedUrl } from './separate-url.function';

/**
 * Matches the filter against a separated url. Non-existend rulesets
 * automatically pass. **Empty whitelist rulesets never pass.** Empty blacklist
 * rulesets always pass.
 */
export function checkAgainstUrlFilter(
	urlFilter: UrlFilter,
	{ domain, path, protocol }: SeparatedUrl
): boolean {
	const protocolMatcher = matchAgainst(protocol);
	const domainMatcher = matchAgainst(domain);
	const pathMatcher = matchAgainst(path);

	let protocolWhitelistRulesPass = true;
	if (urlFilter.protocolWhitelist) {
		protocolWhitelistRulesPass = urlFilter.protocolWhitelist.some(protocolMatcher);
	}

	let protocolBlacklistRulesPass = true;
	if (urlFilter.protocolBlacklist) {
		protocolBlacklistRulesPass = !urlFilter.protocolBlacklist.some(protocolMatcher);
	}

	let domainWhitelistRulesPass = true;
	if (urlFilter.domainWhitelist) {
		domainWhitelistRulesPass = urlFilter.domainWhitelist.some(domainMatcher);
	}

	let domainBlacklistRulesPass = true;
	if (urlFilter.domainBlacklist) {
		domainBlacklistRulesPass = !urlFilter.domainBlacklist.some(domainMatcher);
	}

	let pathWhitelistRulesPass = true;
	if (urlFilter.pathWhitelist) {
		pathWhitelistRulesPass = urlFilter.pathWhitelist.some(pathMatcher);
	}

	let pathBlacklistRulesPass = true;
	if (urlFilter.pathBlacklist) {
		pathBlacklistRulesPass = !urlFilter.pathBlacklist.some(pathMatcher);
	}

	return (
		protocolWhitelistRulesPass &&
		protocolBlacklistRulesPass &&
		domainWhitelistRulesPass &&
		domainBlacklistRulesPass &&
		pathWhitelistRulesPass &&
		pathBlacklistRulesPass
	);
}
