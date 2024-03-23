import { isString } from '../function/string.predicate';
/**
 * Jwt failures are handled by either calling a callback or if its a string,
 * redirect
 *
 * @internal
 */
export const handleJwtFailure = (errorCallbackOrRedirect, error, router, redirectParameters) => {
    if (isString(errorCallbackOrRedirect)) {
        if (router) {
            let queryParams = redirectParameters;
            if (typeof redirectParameters === 'function') {
                queryParams = redirectParameters(error);
            }
            router.navigate([errorCallbackOrRedirect], {
                queryParams,
            });
        }
        else {
            // This error is intended to surface as it's a configuration problem
            throw new Error('JWT Refresh configuration error! ' +
                '`onFailure` is defined as a string, but the ' +
                'Router is not available! Is @angular/router ' +
                'installed and the RouterModule imported?');
        }
    }
    else {
        errorCallbackOrRedirect(error);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlLWp3dC1mYWlsdXJlLmZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbGlicy9qd3Qvc3JjL2xpYi9mdW5jdGlvbi9oYW5kbGUtand0LWZhaWx1cmUuZnVuY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBRXhEOzs7OztHQUtHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsQ0FDL0IsdUJBQWtELEVBQ2xELEtBQVEsRUFDUixNQUFlLEVBQ2Ysa0JBQTBFLEVBQ25FLEVBQUU7SUFDVCxJQUFJLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLENBQUM7UUFDdkMsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUNaLElBQUksV0FBVyxHQUFHLGtCQUFrQixDQUFDO1lBQ3JDLElBQUksT0FBTyxrQkFBa0IsS0FBSyxVQUFVLEVBQUUsQ0FBQztnQkFDOUMsV0FBVyxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pDLENBQUM7WUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsdUJBQXVCLENBQUMsRUFBRTtnQkFDMUMsV0FBVzthQUNYLENBQUMsQ0FBQztRQUNKLENBQUM7YUFBTSxDQUFDO1lBQ1Asb0VBQW9FO1lBQ3BFLE1BQU0sSUFBSSxLQUFLLENBQ2QsbUNBQW1DO2dCQUNsQyw4Q0FBOEM7Z0JBQzlDLDhDQUE4QztnQkFDOUMsMENBQTBDLENBQzNDLENBQUM7UUFDSCxDQUFDO0lBQ0YsQ0FBQztTQUFNLENBQUM7UUFDUCx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxDQUFDO0FBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cFBhcmFtcyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IFBhcmFtcywgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IGlzU3RyaW5nIH0gZnJvbSAnLi4vZnVuY3Rpb24vc3RyaW5nLnByZWRpY2F0ZSc7XG5cbi8qKlxuICogSnd0IGZhaWx1cmVzIGFyZSBoYW5kbGVkIGJ5IGVpdGhlciBjYWxsaW5nIGEgY2FsbGJhY2sgb3IgaWYgaXRzIGEgc3RyaW5nLFxuICogcmVkaXJlY3RcbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGNvbnN0IGhhbmRsZUp3dEZhaWx1cmUgPSA8RT4oXG5cdGVycm9yQ2FsbGJhY2tPclJlZGlyZWN0OiBzdHJpbmcgfCAoKGU6IEUpID0+IHZvaWQpLFxuXHRlcnJvcjogRSxcblx0cm91dGVyPzogUm91dGVyLFxuXHRyZWRpcmVjdFBhcmFtZXRlcnM/OiAoKGU6IEUpID0+IEh0dHBQYXJhbXMgfCBQYXJhbXMpIHwgSHR0cFBhcmFtcyB8IFBhcmFtc1xuKTogdm9pZCA9PiB7XG5cdGlmIChpc1N0cmluZyhlcnJvckNhbGxiYWNrT3JSZWRpcmVjdCkpIHtcblx0XHRpZiAocm91dGVyKSB7XG5cdFx0XHRsZXQgcXVlcnlQYXJhbXMgPSByZWRpcmVjdFBhcmFtZXRlcnM7XG5cdFx0XHRpZiAodHlwZW9mIHJlZGlyZWN0UGFyYW1ldGVycyA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRxdWVyeVBhcmFtcyA9IHJlZGlyZWN0UGFyYW1ldGVycyhlcnJvcik7XG5cdFx0XHR9XG5cblx0XHRcdHJvdXRlci5uYXZpZ2F0ZShbZXJyb3JDYWxsYmFja09yUmVkaXJlY3RdLCB7XG5cdFx0XHRcdHF1ZXJ5UGFyYW1zLFxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIFRoaXMgZXJyb3IgaXMgaW50ZW5kZWQgdG8gc3VyZmFjZSBhcyBpdCdzIGEgY29uZmlndXJhdGlvbiBwcm9ibGVtXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXG5cdFx0XHRcdCdKV1QgUmVmcmVzaCBjb25maWd1cmF0aW9uIGVycm9yISAnICtcblx0XHRcdFx0XHQnYG9uRmFpbHVyZWAgaXMgZGVmaW5lZCBhcyBhIHN0cmluZywgYnV0IHRoZSAnICtcblx0XHRcdFx0XHQnUm91dGVyIGlzIG5vdCBhdmFpbGFibGUhIElzIEBhbmd1bGFyL3JvdXRlciAnICtcblx0XHRcdFx0XHQnaW5zdGFsbGVkIGFuZCB0aGUgUm91dGVyTW9kdWxlIGltcG9ydGVkPydcblx0XHRcdCk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGVycm9yQ2FsbGJhY2tPclJlZGlyZWN0KGVycm9yKTtcblx0fVxufTtcbiJdfQ==