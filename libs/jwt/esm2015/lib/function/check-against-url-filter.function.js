import { matchAgainst } from './match-against.function';
/**
 * Matches the filter against a separated url. Non-existend rulesets
 * automatically pass. **Empty whitelist rulesets never pass.** Empty blacklist
 * rulesets always pass.
 */
export function checkAgainstUrlFilter(urlFilter, { domain, path, protocol }) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const protocolMatcher = matchAgainst(protocol);
    const domainMatcher = matchAgainst(domain);
    const pathMatcher = matchAgainst(path);
    const protocolWhitelistRulesPass = (_b = (_a = urlFilter.protocolWhitelist) === null || _a === void 0 ? void 0 : _a.some(protocolMatcher)) !== null && _b !== void 0 ? _b : true;
    const protocolBlacklistRulesPass = !((_c = urlFilter.protocolBlacklist) === null || _c === void 0 ? void 0 : _c.some(protocolMatcher));
    const domainWhitelistRulesPass = (_e = (_d = urlFilter.domainWhitelist) === null || _d === void 0 ? void 0 : _d.some(domainMatcher)) !== null && _e !== void 0 ? _e : true;
    const domainBlacklistRulesPass = !((_f = urlFilter.domainBlacklist) === null || _f === void 0 ? void 0 : _f.some(domainMatcher));
    const pathWhitelistRulesPass = (_h = (_g = urlFilter.pathWhitelist) === null || _g === void 0 ? void 0 : _g.some(pathMatcher)) !== null && _h !== void 0 ? _h : true;
    const pathBlacklistRulesPass = !((_j = urlFilter.pathBlacklist) === null || _j === void 0 ? void 0 : _j.some(pathMatcher));
    return (protocolWhitelistRulesPass &&
        protocolBlacklistRulesPass &&
        domainWhitelistRulesPass &&
        domainBlacklistRulesPass &&
        pathWhitelistRulesPass &&
        pathBlacklistRulesPass);
}
//# sourceMappingURL=check-against-url-filter.function.js.map