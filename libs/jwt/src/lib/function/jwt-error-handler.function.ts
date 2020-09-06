import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Params, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { JwtCannotRefreshError, JwtCouldntRefreshError, JwtError } from '../errors/jwt-error.class';
import { isNotNullish } from '../function/is-not-nullish.predicate';
import { isString } from '../function/string.predicate';
import {
	JwtConfiguration,
	JwtRefreshConfiguration,
} from '../model/auth-core-configuration.interface';

export function handleJwtError<RefreshRequest = unknown, RefreshResponse = unknown>(
	wrappedError:
		| (Omit<HttpErrorResponse, 'error'> & {
				error?: Omit<ErrorEvent, 'error'> & {
					error: JwtError | JwtCannotRefreshError | JwtCouldntRefreshError;
				};
		  })
		| { error?: { error: JwtError | JwtCannotRefreshError | JwtCouldntRefreshError } },
	jwtConfiguration: JwtConfiguration,
	jwtRefreshConfiguration?: JwtRefreshConfiguration<RefreshRequest, RefreshResponse>,
	router?: Router
): Observable<never> {
	const error: undefined | JwtError | JwtCannotRefreshError | JwtCouldntRefreshError =
		wrappedError.error?.error;

	if (error instanceof JwtCannotRefreshError || error instanceof JwtCouldntRefreshError) {
		if (jwtRefreshConfiguration && isNotNullish(jwtRefreshConfiguration.onFailure)) {
			handleFailure(
				jwtRefreshConfiguration.onFailure,
				error,
				router,
				jwtRefreshConfiguration.onFailureRedirectParameters
			);
		}
		// Rethrow the inner error, so observers of the user can see it
		return throwError(error);
	} else if (error instanceof JwtError) {
		if (isNotNullish(jwtConfiguration.onFailure)) {
			handleFailure(
				jwtConfiguration.onFailure,
				error,
				router,
				jwtConfiguration.onFailureRedirectParameters
			);
		}
		return throwError(error);
	} else {
		// Other errors are left untreated
		return throwError(wrappedError);
	}
}

export function handleFailure<E>(
	errorCallbackOrRedirect: string | ((error: E) => void),
	error: E,
	router?: Router,
	redirectParameters?: ((error: E) => HttpParams | Params) | HttpParams | Params
): void {
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
					'installed and the RouterModule imported?'
			);
		}
	} else {
		errorCallbackOrRedirect(error);
	}
}
