import { HttpParams } from '@angular/common/http';
import { Params, Router } from '@angular/router';
import { isString } from '../function/string.predicate';

/**
 * Jwt failures are handled by either calling a callback or if its a string,
 * redirect
 *
 * @internal
 */
export const handleJwtFailure = <E>(
	errorCallbackOrRedirect: string | ((e: E) => void),
	error: E,
	router?: Router,
	redirectParameters?: ((e: E) => HttpParams | Params) | HttpParams | Params,
): void => {
	if (isString(errorCallbackOrRedirect)) {
		if (router) {
			let queryParams = redirectParameters;
			if (typeof redirectParameters === 'function') {
				queryParams = redirectParameters(error);
			}

			router.navigate([errorCallbackOrRedirect], {
				queryParams,
			});
		} else {
			// This error is intended to surface as it's a configuration problem
			throw new Error(
				'JWT Refresh configuration error! ' +
					'`onFailure` is defined as a string, but the ' +
					'Router is not available! Is @angular/router ' +
					'installed and the RouterModule imported?',
			);
		}
	} else {
		errorCallbackOrRedirect(error);
	}
};
