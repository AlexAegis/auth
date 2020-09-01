import { HttpErrorResponse } from '@angular/common/http';
import { HttpErrorFilter } from '../model/auth-core-configuration.interface';

/**
 * Matches the filter against an error response. Non-existend rulesets
 * automatically pass. **Empty whitelist rulesets never pass.** Empty blacklist
 * rulesets always pass.
 */
export function checkAgainstHttpErrorFilter(
	httpErrorFilter: HttpErrorFilter,
	error: HttpErrorResponse
): boolean {
	const statusMatcher = (code: number) => code === error.status;

	let errorCodeWhitelistRulesPass = true;
	if (httpErrorFilter.errorCodeWhitelist) {
		errorCodeWhitelistRulesPass = httpErrorFilter.errorCodeWhitelist.some(statusMatcher);
	}

	let errorCodeBlacklistRulesPass = true;
	if (httpErrorFilter.errorCodeBlacklist) {
		errorCodeBlacklistRulesPass = !httpErrorFilter.errorCodeBlacklist.some(statusMatcher);
	}

	return errorCodeWhitelistRulesPass && errorCodeBlacklistRulesPass;
}
