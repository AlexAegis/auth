/**
 * Matches the filter against an error response. Non-existend rulesets
 * automatically pass. **Empty whitelist rulesets never pass.** Empty blacklist
 * rulesets always pass.
 */
export function checkAgainstHttpErrorFilter(httpErrorFilter, error) {
    var _a, _b, _c;
    const statusMatcher = (code) => code === error.status;
    const errorCodeWhitelistRulesPass = (_b = (_a = httpErrorFilter.errorCodeWhitelist) === null || _a === void 0 ? void 0 : _a.some(statusMatcher)) !== null && _b !== void 0 ? _b : true;
    const errorCodeBlacklistRulesPass = !((_c = httpErrorFilter.errorCodeBlacklist) === null || _c === void 0 ? void 0 : _c.some(statusMatcher));
    return errorCodeWhitelistRulesPass && errorCodeBlacklistRulesPass;
}
//# sourceMappingURL=check-against-http-error-filter.function.js.map