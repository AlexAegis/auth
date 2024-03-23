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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlLWp3dC1mYWlsdXJlLmZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbGlicy9qd3Qvc3JjL2xpYi9mdW5jdGlvbi9oYW5kbGUtand0LWZhaWx1cmUuZnVuY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBRXhEOzs7OztHQUtHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsQ0FDL0IsdUJBQWtELEVBQ2xELEtBQVEsRUFDUixNQUFlLEVBQ2Ysa0JBQTBFLEVBQ25FLEVBQUU7SUFDVCxJQUFJLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFO1FBQ3RDLElBQUksTUFBTSxFQUFFO1lBQ1gsSUFBSSxXQUFXLEdBQUcsa0JBQWtCLENBQUM7WUFDckMsSUFBSSxPQUFPLGtCQUFrQixLQUFLLFVBQVUsRUFBRTtnQkFDN0MsV0FBVyxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3hDO1lBRUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLHVCQUF1QixDQUFDLEVBQUU7Z0JBQzFDLFdBQVc7YUFDWCxDQUFDLENBQUM7U0FDSDthQUFNO1lBQ04sb0VBQW9FO1lBQ3BFLE1BQU0sSUFBSSxLQUFLLENBQ2QsbUNBQW1DO2dCQUNsQyw4Q0FBOEM7Z0JBQzlDLDhDQUE4QztnQkFDOUMsMENBQTBDLENBQzNDLENBQUM7U0FDRjtLQUNEO1NBQU07UUFDTix1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMvQjtBQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBQYXJhbXMgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBQYXJhbXMsIFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBpc1N0cmluZyB9IGZyb20gJy4uL2Z1bmN0aW9uL3N0cmluZy5wcmVkaWNhdGUnO1xuXG4vKipcbiAqIEp3dCBmYWlsdXJlcyBhcmUgaGFuZGxlZCBieSBlaXRoZXIgY2FsbGluZyBhIGNhbGxiYWNrIG9yIGlmIGl0cyBhIHN0cmluZyxcbiAqIHJlZGlyZWN0XG4gKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBjb25zdCBoYW5kbGVKd3RGYWlsdXJlID0gPEU+KFxuXHRlcnJvckNhbGxiYWNrT3JSZWRpcmVjdDogc3RyaW5nIHwgKChlOiBFKSA9PiB2b2lkKSxcblx0ZXJyb3I6IEUsXG5cdHJvdXRlcj86IFJvdXRlcixcblx0cmVkaXJlY3RQYXJhbWV0ZXJzPzogKChlOiBFKSA9PiBIdHRwUGFyYW1zIHwgUGFyYW1zKSB8IEh0dHBQYXJhbXMgfCBQYXJhbXNcbik6IHZvaWQgPT4ge1xuXHRpZiAoaXNTdHJpbmcoZXJyb3JDYWxsYmFja09yUmVkaXJlY3QpKSB7XG5cdFx0aWYgKHJvdXRlcikge1xuXHRcdFx0bGV0IHF1ZXJ5UGFyYW1zID0gcmVkaXJlY3RQYXJhbWV0ZXJzO1xuXHRcdFx0aWYgKHR5cGVvZiByZWRpcmVjdFBhcmFtZXRlcnMgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0cXVlcnlQYXJhbXMgPSByZWRpcmVjdFBhcmFtZXRlcnMoZXJyb3IpO1xuXHRcdFx0fVxuXG5cdFx0XHRyb3V0ZXIubmF2aWdhdGUoW2Vycm9yQ2FsbGJhY2tPclJlZGlyZWN0XSwge1xuXHRcdFx0XHRxdWVyeVBhcmFtcyxcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBUaGlzIGVycm9yIGlzIGludGVuZGVkIHRvIHN1cmZhY2UgYXMgaXQncyBhIGNvbmZpZ3VyYXRpb24gcHJvYmxlbVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHQnSldUIFJlZnJlc2ggY29uZmlndXJhdGlvbiBlcnJvciEgJyArXG5cdFx0XHRcdFx0J2BvbkZhaWx1cmVgIGlzIGRlZmluZWQgYXMgYSBzdHJpbmcsIGJ1dCB0aGUgJyArXG5cdFx0XHRcdFx0J1JvdXRlciBpcyBub3QgYXZhaWxhYmxlISBJcyBAYW5ndWxhci9yb3V0ZXIgJyArXG5cdFx0XHRcdFx0J2luc3RhbGxlZCBhbmQgdGhlIFJvdXRlck1vZHVsZSBpbXBvcnRlZD8nXG5cdFx0XHQpO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRlcnJvckNhbGxiYWNrT3JSZWRpcmVjdChlcnJvcik7XG5cdH1cbn07XG4iXX0=