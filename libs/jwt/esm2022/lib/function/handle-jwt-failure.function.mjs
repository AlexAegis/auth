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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlLWp3dC1mYWlsdXJlLmZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbGlicy9qd3Qvc3JjL2xpYi9mdW5jdGlvbi9oYW5kbGUtand0LWZhaWx1cmUuZnVuY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBRXhEOzs7OztHQUtHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUcsQ0FDL0IsdUJBQWtELEVBQ2xELEtBQVEsRUFDUixNQUFlLEVBQ2Ysa0JBQTBFLEVBQ25FLEVBQUU7SUFDVCxJQUFJLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLENBQUM7UUFDdkMsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUNaLElBQUksV0FBVyxHQUFHLGtCQUFrQixDQUFDO1lBQ3JDLElBQUksT0FBTyxrQkFBa0IsS0FBSyxVQUFVLEVBQUUsQ0FBQztnQkFDOUMsV0FBVyxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3pDLENBQUM7WUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsdUJBQXVCLENBQUMsRUFBRTtnQkFDMUMsV0FBVzthQUNYLENBQUMsQ0FBQztRQUNKLENBQUM7YUFBTSxDQUFDO1lBQ1Asb0VBQW9FO1lBQ3BFLE1BQU0sSUFBSSxLQUFLLENBQ2QsbUNBQW1DO2dCQUNsQyw4Q0FBOEM7Z0JBQzlDLDhDQUE4QztnQkFDOUMsMENBQTBDLENBQzNDLENBQUM7UUFDSCxDQUFDO0lBQ0YsQ0FBQztTQUFNLENBQUM7UUFDUCx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQyxDQUFDO0FBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cFBhcmFtcyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IFBhcmFtcywgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IGlzU3RyaW5nIH0gZnJvbSAnLi4vZnVuY3Rpb24vc3RyaW5nLnByZWRpY2F0ZSc7XG5cbi8qKlxuICogSnd0IGZhaWx1cmVzIGFyZSBoYW5kbGVkIGJ5IGVpdGhlciBjYWxsaW5nIGEgY2FsbGJhY2sgb3IgaWYgaXRzIGEgc3RyaW5nLFxuICogcmVkaXJlY3RcbiAqXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGNvbnN0IGhhbmRsZUp3dEZhaWx1cmUgPSA8RT4oXG5cdGVycm9yQ2FsbGJhY2tPclJlZGlyZWN0OiBzdHJpbmcgfCAoKGU6IEUpID0+IHZvaWQpLFxuXHRlcnJvcjogRSxcblx0cm91dGVyPzogUm91dGVyLFxuXHRyZWRpcmVjdFBhcmFtZXRlcnM/OiAoKGU6IEUpID0+IEh0dHBQYXJhbXMgfCBQYXJhbXMpIHwgSHR0cFBhcmFtcyB8IFBhcmFtcyxcbik6IHZvaWQgPT4ge1xuXHRpZiAoaXNTdHJpbmcoZXJyb3JDYWxsYmFja09yUmVkaXJlY3QpKSB7XG5cdFx0aWYgKHJvdXRlcikge1xuXHRcdFx0bGV0IHF1ZXJ5UGFyYW1zID0gcmVkaXJlY3RQYXJhbWV0ZXJzO1xuXHRcdFx0aWYgKHR5cGVvZiByZWRpcmVjdFBhcmFtZXRlcnMgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdFx0cXVlcnlQYXJhbXMgPSByZWRpcmVjdFBhcmFtZXRlcnMoZXJyb3IpO1xuXHRcdFx0fVxuXG5cdFx0XHRyb3V0ZXIubmF2aWdhdGUoW2Vycm9yQ2FsbGJhY2tPclJlZGlyZWN0XSwge1xuXHRcdFx0XHRxdWVyeVBhcmFtcyxcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBUaGlzIGVycm9yIGlzIGludGVuZGVkIHRvIHN1cmZhY2UgYXMgaXQncyBhIGNvbmZpZ3VyYXRpb24gcHJvYmxlbVxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFxuXHRcdFx0XHQnSldUIFJlZnJlc2ggY29uZmlndXJhdGlvbiBlcnJvciEgJyArXG5cdFx0XHRcdFx0J2BvbkZhaWx1cmVgIGlzIGRlZmluZWQgYXMgYSBzdHJpbmcsIGJ1dCB0aGUgJyArXG5cdFx0XHRcdFx0J1JvdXRlciBpcyBub3QgYXZhaWxhYmxlISBJcyBAYW5ndWxhci9yb3V0ZXIgJyArXG5cdFx0XHRcdFx0J2luc3RhbGxlZCBhbmQgdGhlIFJvdXRlck1vZHVsZSBpbXBvcnRlZD8nLFxuXHRcdFx0KTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0ZXJyb3JDYWxsYmFja09yUmVkaXJlY3QoZXJyb3IpO1xuXHR9XG59O1xuIl19