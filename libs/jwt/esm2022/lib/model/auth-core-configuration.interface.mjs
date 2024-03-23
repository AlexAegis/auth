import { DEFAULT_HEADER_CONFIG, } from '../model/header-configuration.interface';
export const DEFAULT_JWT_HEADER = 'Authorization';
export const DEFAULT_JWT_SCHEME = 'Bearer ';
export const DEFAULT_JWT_CONFIG = {
    ...DEFAULT_HEADER_CONFIG,
    header: DEFAULT_JWT_HEADER,
    scheme: DEFAULT_JWT_SCHEME,
    handleWithCredentials: true,
};
export const DEFAULT_JWT_REFRESH_CONFIG_DEFAULT_AUTO_IN_GUARD = true;
export const DEFAULT_JWT_REFRESH_CONFIG = {
    method: 'POST',
    errorCodeWhitelist: [401],
    isAutoRefreshAllowedInLoginGuardByDefault: DEFAULT_JWT_REFRESH_CONFIG_DEFAULT_AUTO_IN_GUARD,
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC1jb3JlLWNvbmZpZ3VyYXRpb24uaW50ZXJmYWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbGlicy9qd3Qvc3JjL2xpYi9tb2RlbC9hdXRoLWNvcmUtY29uZmlndXJhdGlvbi5pbnRlcmZhY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUEsT0FBTyxFQUNOLHFCQUFxQixHQUdyQixNQUFNLHlDQUF5QyxDQUFDO0FBR2pELE1BQU0sQ0FBQyxNQUFNLGtCQUFrQixHQUFHLGVBQWUsQ0FBQztBQUNsRCxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRyxTQUFTLENBQUM7QUFFNUMsTUFBTSxDQUFDLE1BQU0sa0JBQWtCLEdBQThCO0lBQzVELEdBQUcscUJBQXFCO0lBQ3hCLE1BQU0sRUFBRSxrQkFBa0I7SUFDMUIsTUFBTSxFQUFFLGtCQUFrQjtJQUMxQixxQkFBcUIsRUFBRSxJQUFJO0NBQzNCLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxnREFBZ0QsR0FBRyxJQUFJLENBQUM7QUFFckUsTUFBTSxDQUFDLE1BQU0sMEJBQTBCLEdBQXVEO0lBQzdGLE1BQU0sRUFBRSxNQUFNO0lBQ2Qsa0JBQWtCLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDekIseUNBQXlDLEVBQUUsZ0RBQWdEO0NBQzNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwSGVhZGVycywgSHR0cFBhcmFtcyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IFBhcmFtcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBKd3RDYW5ub3RSZWZyZXNoRXJyb3IsIEp3dENvdWxkbnRSZWZyZXNoRXJyb3IsIEp3dEVycm9yIH0gZnJvbSAnLi4vZXJyb3JzL2p3dC1lcnJvci5jbGFzcyc7XG5pbXBvcnQge1xuXHRERUZBVUxUX0hFQURFUl9DT05GSUcsXG5cdEhlYWRlckNvbmZpZ3VyYXRpb24sXG5cdFVybEZpbHRlcixcbn0gZnJvbSAnLi4vbW9kZWwvaGVhZGVyLWNvbmZpZ3VyYXRpb24uaW50ZXJmYWNlJztcbmltcG9ydCB7IEh0dHBNZXRob2RUeXBlIH0gZnJvbSAnLi9odHRwLW1ldGhvZC5lbnVtJztcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSldUX0hFQURFUiA9ICdBdXRob3JpemF0aW9uJztcbmV4cG9ydCBjb25zdCBERUZBVUxUX0pXVF9TQ0hFTUUgPSAnQmVhcmVyICc7XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0pXVF9DT05GSUc6IFBhcnRpYWw8Snd0Q29uZmlndXJhdGlvbj4gPSB7XG5cdC4uLkRFRkFVTFRfSEVBREVSX0NPTkZJRyxcblx0aGVhZGVyOiBERUZBVUxUX0pXVF9IRUFERVIsXG5cdHNjaGVtZTogREVGQVVMVF9KV1RfU0NIRU1FLFxuXHRoYW5kbGVXaXRoQ3JlZGVudGlhbHM6IHRydWUsXG59O1xuXG5leHBvcnQgY29uc3QgREVGQVVMVF9KV1RfUkVGUkVTSF9DT05GSUdfREVGQVVMVF9BVVRPX0lOX0dVQVJEID0gdHJ1ZTtcblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfSldUX1JFRlJFU0hfQ09ORklHOiBQYXJ0aWFsPEp3dFJlZnJlc2hDb25maWd1cmF0aW9uPHVua25vd24sIHVua25vd24+PiA9IHtcblx0bWV0aG9kOiAnUE9TVCcsXG5cdGVycm9yQ29kZVdoaXRlbGlzdDogWzQwMV0sXG5cdGlzQXV0b1JlZnJlc2hBbGxvd2VkSW5Mb2dpbkd1YXJkQnlEZWZhdWx0OiBERUZBVUxUX0pXVF9SRUZSRVNIX0NPTkZJR19ERUZBVUxUX0FVVE9fSU5fR1VBUkQsXG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIEp3dFJlZnJlc2hSZXNwb25zZSB7XG5cdGFjY2Vzc1Rva2VuOiBzdHJpbmc7XG5cdHJlZnJlc2hUb2tlbj86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBIdHRwUmVxdWVzdEluaXQge1xuXHRoZWFkZXJzPzogSHR0cEhlYWRlcnM7XG5cdHJlcG9ydFByb2dyZXNzPzogYm9vbGVhbjtcblx0cGFyYW1zPzogSHR0cFBhcmFtcztcblx0cmVzcG9uc2VUeXBlPzogJ2FycmF5YnVmZmVyJyB8ICdibG9iJyB8ICdqc29uJyB8ICd0ZXh0Jztcblx0d2l0aENyZWRlbnRpYWxzPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBUT0RPOiBvcHRpb25hbCBnZW5lcmljIG1hdGNoZXIgZnVuY3Rpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBIdHRwRXJyb3JGaWx0ZXIge1xuXHQvKipcblx0ICogVGhlIGVycm9yIGNvZGVzIG9uIHdoaWNoIGFuIGFjdCBpcyBhbGxvd2VkIHRvIGhhcHBlbixcblx0ICogYW4gZW1wdHkgYXJyYXkgbWVhbnMgaXQgY2FuJ3QgYWN0IG9uIGFueXRoaW5nXG5cdCAqXG5cdCAqIEBkZWZhdWx0IFs0MDFdXG5cdCAqL1xuXHRlcnJvckNvZGVXaGl0ZWxpc3Q/OiBudW1iZXJbXTtcblxuXHQvKipcblx0ICogVGhlIGVycm9yIGNvZGVzIG9uIHdoaWNoIGFuIGFjdCBpcyBub3QgYWxsb3dlZCB0byBoYXBwZW4sXG5cdCAqIGFuIGVtcHR5IGFycmF5IChhbmQgaWYgdW5kZWZpbmVkKSBtZWFucyBpdCBjYW4gYWx3YXlzIHRyeSBhIHNpbmdsZVxuXHQgKiBhY3QgaW4gY2FzZSBvZiBhbiBlcnJvclxuXHQgKlxuXHQgKiBAZGVmYXVsdCB1bmRlZmluZWRcblx0ICovXG5cdGVycm9yQ29kZUJsYWNrbGlzdD86IG51bWJlcltdO1xufVxuXG4vKipcbiAqIEVuYWJsZXMgdGhlIFJlZnJlc2hJbnRlcmNlcHRvciB3aGljaCB3aWxsIGF1dG9tYXRpY2FsbHkgdHJpZXMgdG9cbiAqIHJlZnJlc2ggdGhlIGFjY2Vzc1Rva2VuIG9uIGV4cGlyYXRpb24gb3IgZmFpbHVyZSBvZiB0aGUgbmV4dCByZXF1ZXN0LlxuICpcbiAqIEJlY2F1c2UgaGFuZGxpbmcgcmVmcmVzaGVzIGlzIG5vdCBzdGFuZGFyZGl6ZWQsIGluc3RlYWQgb2YgYXNraW5nIGZvciB0aGVcbiAqIHJlZnJlc2ggdG9rZW4gZGlyZWN0bHkgSSBhc2sgeW91IHRvIHByb3ZpZGUgdGhlIHJlcXVlc3QgaXRzZWxmLCBob3dldmVyIHlvdVxuICogbGlrZSB0by4gSW4gdGhlc2UgY2FsbGJhY2tzIHlvdSBjYW4gYWNjZXNzIHlvdXIgcmVmcmVzaFRva2VuIHdoZXJldmVyIHlvdVxuICogc3RvcmUgaXQuXG4gKlxuICogWW91IGNhbiBzdGlsbCBjb25maWd1cmUgYSBgZ2V0UmVmcmVzaFRva2VuYCBwcm9wZXJ0eSBidXQgaXQncyBvcHRpb25hbCxcbiAqIG5vdCB1c2VkIGluIHRoZSBpbnRlcmNlcHRvciBhdCBhbGwsIGFuZCBpcyBvbmx5IHVzZWQgaW4gdGhlIGhlbHBlciBzZXJ2aWNlLlxuICogSWYgeW91IGRvIG5vdCB3aXRoIHRvIGludGVyYWN0IHdpdGggdGhlIHBhcnNlZCByZWZyZXNoVG9rZW4gKFVzdWFsbHkgeW91XG4gKiBkb24ndCBuZWVkIHRvKSB5b3UgY2FuIGxlYXZlIHRoYXQgb3V0LiBCdXQgaXQncyB0aGVyZSBpZiB5b3UgbWlnaHQgbmVlZCBpdC5cbiAqXG4gKiBUaGUgcmVhc29uIGl0J3MgY29uZmlndXJlZCB0aHJvdWdoIG11bHRpcGxlIHByb3BlcnRpZXMgaW5zdGVhZCBvZiBhIGNhbGxiYWNrXG4gKiB3aGVyZSBJIGxldCB5b3UgZG8gdGhlIHJlZnJlc2ggcmVxdWVzdCBob3dldmVyIHlvdSBzZWUgZml0IGlzIHRvIG1ha2Ugc3VyZSB0aGVcbiAqIHJlZnJlc2hVcmwgaXMga25vd24gdG8gYXZvaWQgcG90ZW50aW9uYWwgaW5maW5pdGUgcmVxdWVzdHMgd2hlbiBoaXR0aW5nIHRoZVxuICogcmVmcmVzaCBlbmRwb2ludC4gVGhpcyB3YXkgeW91IGRvbid0IGhhdmUgdG8gcmVtZW1iZXIgc2V0dGluZyB0aGlzIGludG8gdGhlXG4gKiB1cmwgZmlsdGVyIG1hbnVhbGx5LlxuICpcbiAqIEBleGFtcGxlIGNvbmZpZ3VyYXRpb24uXG4gKiBBdXRoQ29yZU1vZHVsZS5mb3JSb290PFRva2VuU3RvcmFnZVNlcnZpY2U+KHtcbiAqXHRcdHVzZUZhY3Rvcnk6IChzZXJ2aWNlOiBUb2tlblN0b3JhZ2VTZXJ2aWNlKSA9PiAoe1xuICpcdFx0XHRnZXRUb2tlbjogc2VydmljZS5hY2Nlc3NUb2tlbiRcbiAqXHRcdFx0YXV0b1JlZnJlc2hlcjoge1xuICogXHRcdFx0XHRlbmRwb2ludDogYCR7ZW52aXJvbm1lbnQuYXBpfS9hdXRoL3JlZnJlc2hgLFxuICogXHRcdFx0XHRzZXRUb2tlbjogKHJlc3BvbnNlKSA9PiBzZXJ2aWNlLmFjY2Vzc1Rva2VuJC5uZXh0KHJlc3BvbnNlLmFjY2Vzc1Rva2VuKVxuICogXHRcdFx0fVxuICpcdFx0fSksXG4gKlx0XHRkZXBzOiBbVG9rZW5TdG9yYWdlU2VydmljZV0sXG4gKiB9KVxuICpcbiAqIEBkZWZhdWx0IHVuZGVmaW5lZFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEp3dFJlZnJlc2hDb25maWd1cmF0aW9uPFJlZnJlc2hSZXF1ZXN0LCBSZWZyZXNoUmVzcG9uc2U+XG5cdGV4dGVuZHMgVXJsRmlsdGVyLFxuXHRcdEh0dHBFcnJvckZpbHRlciB7XG5cdC8qKlxuXHQgKiBBZnRlciBhIHN1Y2Nlc3NmdWwgcmVmcmVzaCwgdGhpcyBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZC5cblx0ICogWW91IG5lZWQgdG8gZGVmaW5lIGEgZnVuY3Rpb24gd2hpY2ggd2lsbCBzYXZlIHRoZSB0aGUgdG9rZW4gaW4gYSB3YXlcblx0ICogdGhhdCBpZiB0aGUgaW50ZXJjZXB0b3IgY2FsbHMgYGdldFRva2VuYCBhZ2FpbiwgaXQgd2lsbCBnZXQgdGhlIHRva2VuXG5cdCAqIHNhdmVkIHdpdGggdGhpcyBtZXRob2QuXG5cdCAqXG5cdCAqIE9uIGEgZmFpbGVkIHJlZnJlc2ggaXQgd2lsbCBzZXQgdGhlIGFjY2VzcyB0b2tlbiBhcyB1bmRlZmluZWQuXG5cdCAqXG5cdCAqIEBleGFtcGxlIHVzaW5nIGBsb2NhbFN0b3JhZ2VgXG5cdCAqIFx0XHRzZXRUb2tlbjogKHJlc3BvbnNlKSA9PiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnYWNjZXNzVG9rZW4nLCByZXNwb25zZS5hY2Nlc3NUb2tlbilcblx0ICogQGV4YW1wbGUgdXNpbmcgYSBzZXJ2aWNlLlxuXHQgKlxuXHQgKiBgYGB0eXBlc2NyaXB0XG5cdCAqIEF1dGhDb3JlTW9kdWxlLmZvclJvb3Q8VG9rZW5TdG9yYWdlU2VydmljZT4oe1xuXHQgKlx0XHR1c2VGYWN0b3J5OiAoc2VydmljZTogVG9rZW5TdG9yYWdlU2VydmljZSkgPT4gKHtcblx0ICpcdFx0XHRnZXRUb2tlbjogc2VydmljZS5hY2Nlc3NUb2tlbiRcblx0ICpcdFx0XHRhdXRvUmVmcmVzaGVyOiB7XG5cdCAqIFx0XHRcdFx0ZW5kcG9pbnQ6IGAke2Vudmlyb25tZW50LmFwaX0vYXV0aC9yZWZyZXNoYCxcblx0ICogXHRcdFx0XHRzZXRSZWZyZXNoVG9rZW46IChyZXNwb25zZSkgPT4gc2VydmljZS5hY2Nlc3NUb2tlbiQubmV4dChyZXNwb25zZS5hY2Nlc3NUb2tlbilcblx0ICogXHRcdFx0fVxuXHQgKlx0XHR9KSxcblx0ICpcdFx0ZGVwczogW1Rva2VuU3RvcmFnZVNlcnZpY2VdLFxuXHQgKiB9KVxuXHQgKiBgYGBcblx0ICpcblx0ICovXG5cdHNldFJlZnJlc2hlZFRva2VuczogKHJlc3BvbnNlOiBQYXJ0aWFsPEp3dFJlZnJlc2hSZXNwb25zZT4pID0+IHZvaWQ7XG5cblx0LyoqXG5cdCAqIFRoZSBtZXRob2QgZm9yIHRoZSByZXF1ZXN0LCB1c3VhbGx5IGl0J3MgYSBQT1NUIHNvIHRoYXQncyB0aGUgZGVmYXVsdFxuXHQgKlxuXHQgKiBAZGVmYXVsdCAnUE9TVCdcblx0ICovXG5cdG1ldGhvZD86IEh0dHBNZXRob2RUeXBlO1xuXG5cdC8qKlxuXHQgKiBUaGUgZW5kcG9pbnQgdGhhdCB3aWxsIGJlIHJlcXVlc3RlZCBmb3IgYSBuZXcgdG9rZW5cblx0ICovXG5cdHJlZnJlc2hVcmw6IHN0cmluZztcblxuXHQvKipcblx0ICogQSBjYWxsYmFjayBvciBvYnNlcnZhYmxlIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmV0cmlldmUgdGhlIGJvZHkgb2YgdGhlXG5cdCAqIHJlcXVlc3QuIElmIGl0J3MgbnVsbCBvciB1bmRlZmluZWQsIHRoZSByZWZyZXNoIHdvbid0IGJlIGV4ZWN1dGVkLiBUaGlzXG5cdCAqIGNhbiBiZSB1dGlsaXplZCB0byBub3QgZG8gYSByZWZyZXNoIG9uIGEgbG9nZ2VkIG91dCBzdGF0ZS5cblx0ICpcblx0ICogQGV4YW1wbGUgZ2V0VmFsdWU6ICgpID0+IGxvY2Fsc3RvcmFnZS5nZXQoJ2ZvbycpXG5cdCAqIEBleGFtcGxlIGdldFZhbHVlOiBteVRva2VuU2VydmljZS5mb28kXG5cdCAqL1xuXHRjcmVhdGVSZWZyZXNoUmVxdWVzdEJvZHk6XG5cdFx0fCBPYnNlcnZhYmxlPFJlZnJlc2hSZXF1ZXN0IHwgbnVsbCB8IHVuZGVmaW5lZD5cblx0XHR8ICgoKSA9PlxuXHRcdFx0XHR8IFJlZnJlc2hSZXF1ZXN0XG5cdFx0XHRcdHwgbnVsbFxuXHRcdFx0XHR8IHVuZGVmaW5lZFxuXHRcdFx0XHR8IFByb21pc2U8UmVmcmVzaFJlcXVlc3QgfCBudWxsIHwgdW5kZWZpbmVkPlxuXHRcdFx0XHR8IE9ic2VydmFibGU8UmVmcmVzaFJlcXVlc3QgfCBudWxsIHwgdW5kZWZpbmVkPik7XG5cblx0LyoqXG5cdCAqIEEgY2FsbGJhY2sgdGhhdCBzaG91bGQgcmV0dXJuIHRoZSBkZWZhdWx0cyBvbiB0aGUgcmVxdWVzdFxuXHQgKi9cblx0cmVmcmVzaFJlcXVlc3RJbml0aWFscz86ICgoKSA9PiBIdHRwUmVxdWVzdEluaXQgfCB1bmRlZmluZWQpIHwgSHR0cFJlcXVlc3RJbml0O1xuXG5cdC8qKlxuXHQgKiBUaGlzIGZ1bmN0aW9uIGhhdmUgdG8gdHJhbnNmb3JtIHRoZSByZXN1bHQgb2YgeW91ciByZWZyZXNoIGVuZHBvaW50XG5cdCAqIGludG8gYSBkaWdlc3RhYmxlIGZvcm0uIEl0IHdpbGwgYmUgY2FsbGVkIGFmdGVyIHN1Y2Nlc3NmdWwgcmVmcmVzaGVzLlxuXHQgKi9cblx0dHJhbnNmb3JtUmVmcmVzaFJlc3BvbnNlOiAocmVzcG9uc2U6IFJlZnJlc2hSZXNwb25zZSkgPT4gSnd0UmVmcmVzaFJlc3BvbnNlO1xuXG5cdC8qKlxuXHQgKiBUaGlzIGNhbGxiYWNrIGlzIGNhbGxlZCB3aGVuIGEgcmVmcmVzaCBlaXRoZXIgZmFpbGVkIG9yIGNhbm5vdCBiZSBkb25lLlxuXHQgKiBUaGlzIG1hcmtzIHRoZSBwb2ludCB3aGVyZSBib3RoIHRva2VucyBhcmUgaW52YWxpZCBhbmQgdGhlIHVzZXIgbmVlZHMgdG9cblx0ICogcmVsb2cuIEJlY2F1c2UgdGhpcyBpcyB1c3VhbGx5IGRvbmUgdGhyb3VnaCBhIGxvZ2luIHBhZ2UsIGFzaWRlIGZyb20gYVxuXHQgKiByZWd1bGFyIGNhbGxiYWNrLCBhIHN0cmluZyBjYW4gYWxzbyBiZSBzdXBwbGllZCB3aGljaCB3aWxsIGFjdCBhcyB0aGVcblx0ICogdGFyZ2V0IG9mIG5hdmlnYXRpb24uIENoZWNrIGBvbkZhaWx1cmVSZWRpcmVjdFBhcmFtZXRlcnNgIGlmIHlvdSB3aXNoXG5cdCAqIHRvIHN1cHBseSBxdWVyeSBwYXJhbWV0ZXJzLiBGb3IgbW9yZSBhZHZhbmNlZCB1c2FnZSwgY29uc2lkZXJcblx0ICogaW1wbGVtZW50aW5nIGl0IGFzIGEgY3VzdG9tIGZ1bmN0aW9uLCB0aGUgZXJyb3Igb2JqZWN0IGlzIGF2YWlsYWJsZVxuXHQgKiB0aGVyZSB0b28hXG5cdCAqL1xuXHRvbkZhaWx1cmU/OiBzdHJpbmcgfCAoKGVycm9yOiBKd3RDb3VsZG50UmVmcmVzaEVycm9yIHwgSnd0Q2Fubm90UmVmcmVzaEVycm9yKSA9PiB2b2lkKTtcblxuXHRvbkZhaWx1cmVSZWRpcmVjdFBhcmFtZXRlcnM/OlxuXHRcdHwgKChlcnJvcjogSnd0Q291bGRudFJlZnJlc2hFcnJvciB8IEp3dENhbm5vdFJlZnJlc2hFcnJvcikgPT4gSHR0cFBhcmFtcyB8IFBhcmFtcylcblx0XHR8IEh0dHBQYXJhbXNcblx0XHR8IFBhcmFtcztcblxuXHQvKipcblx0ICogT3B0aW9uYWwhXG5cdCAqXG5cdCAqIFRoZSByZWZyZXNoIG1lY2hhbmljIG9ubHkgdXNlcyB0aGlzIHRvIGRldGVybWluZSBpZiBpdCdzIGV4cGlyZWQgb3Igbm90XG5cdCAqIGFuZCBzbyBwb3RlbnRpb25hbGx5IHNhdmluZyBhIHJlcXVlc3QgdGhhdCB3b3VsZCBmYWlsIGFueXdheS4gSXQgaXNcblx0ICogYWxzbyB1c2VkIGluIHRoZSBoZWxwZXIgc2VydmljZSBpZiB5b3Ugd2l0aCB0byBpbnRlcmFjdCB3aXRoIHRoZVxuXHQgKiBwYXJzZWQgcmVmcmVzaFRva2VuIHRocm91Z2h0IHRoZSBoZWxwZXIgb2JzZXJ2YWJsZXMuIElmIHlvdSBkbyBub3Rcblx0ICogbmVlZCBlaXRoZXIgb2YgdGhlc2UsIHlvdSBkb24ndCBoYXZlIHRvIGltcGxlbWVudCB0aGlzLlxuXHQgKlxuXHQgKiBBIGNhbGxiYWNrIG9yIG9ic2VydmFibGUgdGhhdCBjYW4gYmUgdXNlZCB0byByZXRyaWV2ZSB0aGUgcmVmcmVzaCB0b2tlblxuXHQgKiBOb3QgdXNlZCBpbiB0aGUgaW50ZXJjZXB0b3IhXG5cdCAqXG5cdCAqIEBleGFtcGxlIGdldFZhbHVlOiAoKSA9PiBsb2NhbHN0b3JhZ2UuZ2V0KCdmb28nKVxuXHQgKiBAZXhhbXBsZSBnZXRWYWx1ZTogbXlUb2tlblNlcnZpY2UuZm9vJFxuXHQgKi9cblx0Z2V0UmVmcmVzaFRva2VuPzpcblx0XHR8IE9ic2VydmFibGU8c3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZD5cblx0XHR8ICgoKSA9PlxuXHRcdFx0XHR8IHN0cmluZ1xuXHRcdFx0XHR8IG51bGxcblx0XHRcdFx0fCB1bmRlZmluZWRcblx0XHRcdFx0fCBQcm9taXNlPHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ+XG5cdFx0XHRcdHwgT2JzZXJ2YWJsZTxzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkPik7XG5cblx0LyoqXG5cdCAqIFdoZW4gdXNpbmcgdGhlIExvZ2luR3VhcmQgdGhpcyBzZXR0aW5nIHdpbGwgZGV0ZXJtaW5lIHRoZSBkZWZhdWx0XG5cdCAqIHZhbHVlLiBTbyBpbnN0ZWFkIG9mIGRpc2FibGluZyB0aGUgYXV0b1JlZnJlc2ggYmVoYXZpb3Igb24gZXZlcnlcblx0ICogcm91dGUgd2l0aCB0aGUgZGF0YSBvcHRpb24sIG9yIHdyaXRpbmcgeW91ciBvd24gZ3VhcmQgKFdoaWNoIHdvdWxkXG5cdCAqIGJlIHJlYWxseSBzaW1wbGUpIGp1c3Qgc2V0IHRoaXMgdG8gZmFsc2UuIFlvdSBjYW4gc3RpbGwgb3ZlcnJpZGUgaXRcblx0ICogdXNpbmcgcm91dGUgZGF0YS5cblx0ICpcblx0ICogU2VlIHRoZSBMb2dpbkd1YXJkRGF0YSBoZWxwZXIgaW50ZXJmYWNlIHRvIHNlZSB3aGF0IGl0IGNhbiB1dGlsaXplLlxuXHQgKlxuXHQgKiBAZGVmYXVsdCB0cnVlXG5cdCAqL1xuXHRpc0F1dG9SZWZyZXNoQWxsb3dlZEluTG9naW5HdWFyZEJ5RGVmYXVsdD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogVGhpcyBpcyBhIGhlbHBlciBpbnRlcmZhY2UgYmVjYXVzZSB0aGV5IGxvb2sgdGhlIHNhbWUgb24gYm90aFxuICogYEp3dENvbmZpZ3VyYXRpb25gIGFuZCBgSnd0UmVmcmVzaENvbmZpZ3VyYXRpb25gLiBUaGV5IGFyZSByZS1kZWZpbmVkXG4gKiBvbiB0aGVtIHRvIHByb3ZpZGUgYmV0dGVyIGRvY3VtZW50YXRpb24uXG4gKlxuICogSW4gdGhlIGNhc2Ugd2hlcmUgeW91IHdpc2ggdG8gaW1wbGVtZW50IHRoZW0gYm90aCBpbiBhIHNlcGFyYXRlIG9iamVjdFxuICogdGhlbiBzcHJlYWQgaXQgYmFjayB0byBib3RoIHRvIHJlZHVjZSBjb2RlLWR1cGxpY2F0aW9uLCB0aGlzIHR5cGUgY2FuXG4gKiBiZSB1dGlsaXplZC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBKd3RFcnJvckhhbmRsaW5nIHtcblx0LyoqXG5cdCAqIElmIGl0J3MgYSBzdHJpbmcsIGluc3RlYWQgb2YgY2FsbGluZyBpdCwgYSByZWRpcmVjdGlvbiB3aWxsIGhhcHBlbixcblx0ICogd2l0aCBgb25GYWlsdXJlUmVkaXJlY3RQYXJhbWV0ZXJzYCBhcyBpdCdzIHF1ZXJ5UGFyYW1zLlxuXHQgKi9cblx0b25GYWlsdXJlPzpcblx0XHR8IHN0cmluZ1xuXHRcdHwgKChqd3RFcnJvcjogSnd0RXJyb3IgfCBKd3RDb3VsZG50UmVmcmVzaEVycm9yIHwgSnd0Q2Fubm90UmVmcmVzaEVycm9yKSA9PiB2b2lkKTtcblxuXHQvKipcblx0ICogVGhpcyBvcHRpb24gaXMgb25seSB1c2VkIHdoZW4gdGhlIGBvbkZhaWx1cmVgIG9wdGlvbiBpcyBhIHN0cmluZ1xuXHQgKiBzbyBpdCdzIGhhbmRsZWQgYXMgYSByZWRpcmVjdC4gV2hlbiB0aGlzIGhhcHBlbnMsIHlvdSBjYW4gZGVmaW5lXG5cdCAqIHRoZSBxdWVyeXBhcmFtcyB0byBiZSB1c2VkIHdpdGggdGhpcyByZWRpcmVjdC5cblx0ICpcblx0ICogV2hlbiBpbXBsZW1lbnRlZCBhcyBhIGZ1bmN0aW9uLCB0aGUgSnd0RXJyb3Igd2lsbCBiZSBmb3J3YXJkZWQgdG8gaXQuXG5cdCAqIEFsbCBKd3RFcnJvcnMgaGF2ZSB0aGUgYG9yaWdpbmFsUmVxdWVzdGAgYXZhaWxhYmxlIGluIHRoZW0sIHNvIGl0J3Ncblx0ICogdHJpdmlhbCB0byBhY3F1aXJlIHRoZSBmYWlsZWQgdXJsLlxuXHQgKi9cblx0b25GYWlsdXJlUmVkaXJlY3RQYXJhbWV0ZXJzPzpcblx0XHR8ICgoXG5cdFx0XHRcdGVycm9yOiBKd3RFcnJvciB8IEp3dENvdWxkbnRSZWZyZXNoRXJyb3IgfCBKd3RDYW5ub3RSZWZyZXNoRXJyb3IsXG5cdFx0ICApID0+IEh0dHBQYXJhbXMgfCBQYXJhbXMpXG5cdFx0fCBIdHRwUGFyYW1zXG5cdFx0fCBQYXJhbXM7XG59XG5cbi8qKlxuICogVG9rZW4gaW5qZWN0aW9uIGNvbmZpZ3VyYXRpb25cbiAqXG4gKiBUaGUgb3B0aW9uYWwgZ2VuZXJpYyBkZWZpbmVkIHRoZSByZWZyZXNoIGVuZHBvaW50cyBSZXNwb25zZSB0eXBlLiBJZiB5b3VcbiAqIGFyZSBub3QgdXNpbmcgdGhhdCBmZWF0dXJlIHRoZXJlJ3Mgbm8gbmVlZCB0byBkZWZpbmUgaXQuXG4gKlxuICogRXhhbXBsZSBjb25maWd1cmF0aW9uOlxuICogYGBgdHlwZXNjcmlwdFxuICogQXV0aENvcmVNb2R1bGUuZm9yUm9vdDxUb2tlblN0b3JhZ2VTZXJ2aWNlPih7XG4gKlx0XHR1c2VGYWN0b3J5OiAoc2VydmljZTogVG9rZW5TdG9yYWdlU2VydmljZSkgPT4gKHtcbiAqXHRcdFx0Z2V0VG9rZW46IHNlcnZpY2UuYWNjZXNzVG9rZW4kXG4gKlx0XHRcdGF1dG9SZWZyZXNoZXI6IHtcbiAqIFx0XHRcdFx0ZW5kcG9pbnQ6IGAke2Vudmlyb25tZW50LmFwaX0vYXV0aC9yZWZyZXNoYCxcbiAqIFx0XHRcdFx0c2V0VG9rZW46IChyZXNwb25zZSkgPT4gc2VydmljZS5hY2Nlc3NUb2tlbiQubmV4dChyZXNwb25zZS5hY2Nlc3NUb2tlbilcbiAqIFx0XHRcdH1cbiAqXHRcdH0pLFxuICpcdFx0ZGVwczogW1Rva2VuU3RvcmFnZVNlcnZpY2VdLFxuICogfSlcbiAqIGBgYFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEp3dENvbmZpZ3VyYXRpb24gZXh0ZW5kcyBPbWl0PEhlYWRlckNvbmZpZ3VyYXRpb24sICdnZXRWYWx1ZSc+LCBKd3RFcnJvckhhbmRsaW5nIHtcblx0LyoqXG5cdCAqIEEgY2FsbGJhY2sgb3Igb2JzZXJ2YWJsZSB0aGF0IHdpbGwgYmUgY2FsbGVkIG9yIHN1YnNjcmliZWQgdG9cblx0ICogb24gZXZlcnkgaHR0cCByZXF1ZXN0IGFuZCByZXR1cm5zIGEgdmFsdWUgZm9yIHRoZSBoZWFkZXJcblx0ICpcblx0ICogQGV4YW1wbGUgZ2V0VmFsdWU6ICgpID0+IGxvY2Fsc3RvcmFnZS5nZXQoJ2ZvbycpXG5cdCAqIEBleGFtcGxlIGdldFZhbHVlOiBteVRva2VuU2VydmljZS5mb28kXG5cdCAqL1xuXHRnZXRUb2tlbjpcblx0XHR8IE9ic2VydmFibGU8c3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZD5cblx0XHR8ICgoKSA9PlxuXHRcdFx0XHR8IHN0cmluZ1xuXHRcdFx0XHR8IG51bGxcblx0XHRcdFx0fCB1bmRlZmluZWRcblx0XHRcdFx0fCBQcm9taXNlPHN0cmluZyB8IG51bGwgfCB1bmRlZmluZWQ+XG5cdFx0XHRcdHwgT2JzZXJ2YWJsZTxzdHJpbmcgfCBudWxsIHwgdW5kZWZpbmVkPik7XG5cblx0LyoqXG5cdCAqIFRoZSBwcmVmaXggb2YgdGhlIHRva2VuIHdoZW4gaW5qZWN0aW5nLiBOb3RpY2UgdGhldCB0aGUgdHJhaWxpbmdcblx0ICogd2hpdGVzcGFjZSBoYXMgdG8gYmUgc2V0IGhlcmVcblx0ICpcblx0ICogQGRlZmF1bHQgJ0JlYXJlciAnXG5cdCAqL1xuXHRzY2hlbWU/OiBzdHJpbmc7XG5cblx0LyoqXG5cdCAqIEhlYWRlciBuYW1lIHRvIGJlIHNldFxuXHQgKlxuXHQgKiBAZGVmYXVsdCAnQXV0aG9yaXphdGlvbidcblx0ICovXG5cdGhlYWRlcjogc3RyaW5nO1xuXG5cdC8qKlxuXHQgKiBTZXRzIHRoZSAnd2l0aENyZWRlbnRpYWxzJyB0byB0cnVlIGFsb25nIHdpdGggdGhlIHRva2VuXG5cdCAqXG5cdCAqIEBkZWZhdWx0IHRydWVcblx0ICovXG5cdGhhbmRsZVdpdGhDcmVkZW50aWFsczogYm9vbGVhbjtcblxuXHQvKipcblx0ICogVGhpcyBjYWxsYmFjayBpcyBjYWxsZWQgd2hlbiB0aGUgcmVxdWVzdCBmYWlscyBhbmQgdGhlcmUgaXMgbm9cblx0ICogUmVmcmVzaENvbmZpZ3VyYXRpb24sIG9yIHdoZW4gdGhlIGFjY2VzcyB0b2tlbiBpcyBzaW1wbHkgbWlzc2luZy5cblx0ICogYGdldFRva2VuYCByZXR1cm5lZCBhIG51bGxpc2ggdmFsdWUuIElmIHRoZSBSZWZyZXNoQ29uZmlndXJhdGlvbiBpc1xuXHQgKiBhdmFpbGFibGUsIHRoZW4gdGhlIGVycm9yIGhhbmRsaW5nIGNvbnRpbnVlcyBpbiB0aGUgc2FtZSBmYXNoaW9uIG9uXG5cdCAqIHRoZSBvdGhlciBjb25maWd1cmF0aW9uLlxuXHQgKlxuXHQgKiBCb3RoIGhhdmUgdGhlIHNhbWUgbmFtZXMgYW5kIHNpZ25hdHVyZSBmb3Jcblx0ICogYm90aCB0aGUgZXJyb3IgaGFuZGxpbmcgY29uZmlndXJhdGlvbiBvcHRpb25zIGBvbkZhaWx1cmVgIGFuZFxuXHQgKiBgb25GYWlsdXJlUmVkaXJlY3RQYXJhbWV0ZXJzYCwgc28gaWYgeW91IHdpc2ggdG8gdXNlIHRoZSBzYW1lIGZvciBib3RoXG5cdCAqIGltcGxlbWVudCB0aGVtIG91dHNpZGUsIGFuZCBzcHJlYWQgdGhlbSBiYWNrLiBZb3UgY2FuIHVzZSB0aGVcblx0ICogYEp3dEVycm9ySGFuZGxpbmdgIGludGVyZmFjZSB0byBoZWxwIHlvdSB3aXRoIHRoZSB0eXBpbmcuIEFsdGhvdWdoXG5cdCAqIHRoYXRzIGEgYml0IHdpZGVyIHdoZW4gaXQgY29tZXMgdG8gdGhlIGVycm9yIHR5cGVzLlxuXHQgKlxuXHQgKiBJZiBpdCdzIGEgc3RyaW5nLCBpbnN0ZWFkIG9mIGNhbGxpbmcgaXQsIGEgcmVkaXJlY3Rpb24gd2lsbCBoYXBwZW4sXG5cdCAqIHdpdGggYG9uRmFpbHVyZVJlZGlyZWN0UGFyYW1ldGVyc2AgYXMgaXQncyBxdWVyeVBhcmFtcy5cblx0ICovXG5cdG9uRmFpbHVyZT86IHN0cmluZyB8ICgoand0RXJyb3I6IEp3dEVycm9yKSA9PiB2b2lkKTtcblxuXHRvbkZhaWx1cmVSZWRpcmVjdFBhcmFtZXRlcnM/OiAoKGVycm9yOiBKd3RFcnJvcikgPT4gSHR0cFBhcmFtcyB8IFBhcmFtcykgfCBIdHRwUGFyYW1zIHwgUGFyYW1zO1xufVxuIl19