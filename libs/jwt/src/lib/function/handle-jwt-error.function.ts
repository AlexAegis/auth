import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { JwtCannotRefreshError, JwtCouldntRefreshError, JwtError } from '../errors/jwt-error.class';
import { isNotNullish } from './is-not-nullish.predicate';
import {
	JwtConfiguration,
	JwtRefreshConfiguration,
} from '../model/auth-core-configuration.interface';
import { handleJwtFailure } from './handle-jwt-failure.function';

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
			handleJwtFailure(
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
			handleJwtFailure(
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
