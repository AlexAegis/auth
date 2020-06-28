import { UrlFilter } from '../model';
import { matchAgainst } from './match-against.function';
import { SeparatedUrl } from './separate-url.function';

export function checkAgainstUrlFilter(
	urlFilter: UrlFilter,
	{ domain, path, protocol }: SeparatedUrl
): boolean {
	const protocolWhitelistRulesPass =
		urlFilter.protocolWhitelist?.some(matchAgainst(protocol)) ?? true;

	const protocolBlacklistRulesPass =
		!urlFilter.protocolBlacklist?.some(matchAgainst(protocol)) ?? true;

	const domainWhitelistRulesPass = urlFilter.domainWhitelist?.some(matchAgainst(domain)) ?? true;

	const domainBlacklistRulesPass = !urlFilter.domainBlacklist?.some(matchAgainst(domain)) ?? true;

	const pathWhitelistRulesPass = urlFilter.pathWhitelist?.some(matchAgainst(path)) ?? true;

	const pathBlacklistRulesPass = !urlFilter.pathBlacklist?.some(matchAgainst(path)) ?? true;

	return (
		protocolWhitelistRulesPass &&
		protocolBlacklistRulesPass &&
		domainWhitelistRulesPass &&
		domainBlacklistRulesPass &&
		pathWhitelistRulesPass &&
		pathBlacklistRulesPass
	);
}
