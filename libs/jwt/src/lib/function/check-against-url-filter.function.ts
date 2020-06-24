import { UrlFilter } from '../model';
import { matchAgainst } from './match-against.function';

export function checkAgainstUrlFilter(
	urlFilter: UrlFilter,
	domain?: string,
	path?: string
): boolean {
	const domainWhitelistRulesPass = urlFilter.domainWhitelist?.some(matchAgainst(domain)) ?? true;

	const domainBlacklistRulesPass = !urlFilter.domainBlacklist?.some(matchAgainst(domain)) ?? true;

	const pathWhitelistRulesPass = urlFilter.pathWhitelist?.some(matchAgainst(path)) ?? true;

	const pathBlacklistRulesPass = !urlFilter.pathBlacklist?.some(matchAgainst(path)) ?? true;

	return (
		domainWhitelistRulesPass &&
		domainBlacklistRulesPass &&
		pathWhitelistRulesPass &&
		pathBlacklistRulesPass
	);
}
