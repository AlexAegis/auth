import { isString } from '../function/string.predicate';
/**
 * Jwt failures are handled by either calling a callback or if its a string,
 * redirect
 *
 * @internal
 */
export function handleJwtFailure(errorCallbackOrRedirect, error, router, redirectParameters) {
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
}
//# sourceMappingURL=handle-jwt-failure.function.js.map