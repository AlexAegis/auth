/**
 * Matches the filter against an error response. Non-existend rulesets
 * automatically pass. **Empty whitelist rulesets never pass.** Empty blacklist
 * rulesets always pass.
 */
export const checkAgainstHttpErrorFilter = (httpErrorFilter, error) => {
    const statusMatcher = (code) => code === error.status;
    const errorCodeWhitelistRulesPass = httpErrorFilter.errorCodeWhitelist?.some(statusMatcher) ?? true;
    const errorCodeBlacklistRulesPass = !httpErrorFilter.errorCodeBlacklist?.some(statusMatcher);
    return errorCodeWhitelistRulesPass && errorCodeBlacklistRulesPass;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stYWdhaW5zdC1odHRwLWVycm9yLWZpbHRlci5mdW5jdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2xpYnMvand0L3NyYy9saWIvZnVuY3Rpb24vY2hlY2stYWdhaW5zdC1odHRwLWVycm9yLWZpbHRlci5mdW5jdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQTs7OztHQUlHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sMkJBQTJCLEdBQUcsQ0FDMUMsZUFBZ0MsRUFDaEMsS0FBd0IsRUFDZCxFQUFFO0lBQ1osTUFBTSxhQUFhLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRSxDQUFDLElBQUksS0FBSyxLQUFLLENBQUMsTUFBTSxDQUFDO0lBQzlELE1BQU0sMkJBQTJCLEdBQ2hDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksSUFBSSxDQUFDO0lBRWpFLE1BQU0sMkJBQTJCLEdBQUcsQ0FBQyxlQUFlLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBRTdGLE9BQU8sMkJBQTJCLElBQUksMkJBQTJCLENBQUM7QUFDbkUsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cEVycm9yUmVzcG9uc2UgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBIdHRwRXJyb3JGaWx0ZXIgfSBmcm9tICcuLi9tb2RlbC9hdXRoLWNvcmUtY29uZmlndXJhdGlvbi5pbnRlcmZhY2UnO1xuXG4vKipcbiAqIE1hdGNoZXMgdGhlIGZpbHRlciBhZ2FpbnN0IGFuIGVycm9yIHJlc3BvbnNlLiBOb24tZXhpc3RlbmQgcnVsZXNldHNcbiAqIGF1dG9tYXRpY2FsbHkgcGFzcy4gKipFbXB0eSB3aGl0ZWxpc3QgcnVsZXNldHMgbmV2ZXIgcGFzcy4qKiBFbXB0eSBibGFja2xpc3RcbiAqIHJ1bGVzZXRzIGFsd2F5cyBwYXNzLlxuICovXG5leHBvcnQgY29uc3QgY2hlY2tBZ2FpbnN0SHR0cEVycm9yRmlsdGVyID0gKFxuXHRodHRwRXJyb3JGaWx0ZXI6IEh0dHBFcnJvckZpbHRlcixcblx0ZXJyb3I6IEh0dHBFcnJvclJlc3BvbnNlXG4pOiBib29sZWFuID0+IHtcblx0Y29uc3Qgc3RhdHVzTWF0Y2hlciA9IChjb2RlOiBudW1iZXIpID0+IGNvZGUgPT09IGVycm9yLnN0YXR1cztcblx0Y29uc3QgZXJyb3JDb2RlV2hpdGVsaXN0UnVsZXNQYXNzID1cblx0XHRodHRwRXJyb3JGaWx0ZXIuZXJyb3JDb2RlV2hpdGVsaXN0Py5zb21lKHN0YXR1c01hdGNoZXIpID8/IHRydWU7XG5cblx0Y29uc3QgZXJyb3JDb2RlQmxhY2tsaXN0UnVsZXNQYXNzID0gIWh0dHBFcnJvckZpbHRlci5lcnJvckNvZGVCbGFja2xpc3Q/LnNvbWUoc3RhdHVzTWF0Y2hlcik7XG5cblx0cmV0dXJuIGVycm9yQ29kZVdoaXRlbGlzdFJ1bGVzUGFzcyAmJiBlcnJvckNvZGVCbGFja2xpc3RSdWxlc1Bhc3M7XG59O1xuIl19