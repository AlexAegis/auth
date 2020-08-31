import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpParams,
	HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Params, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JwtCannotRefreshError, JwtCouldntRefreshError, JwtError } from '../errors/jwt-error.class';
import { isNotNullish } from '../function/is-not-nullish.predicate';
import { isString } from '../function/string.predicate';
import {
	JwtConfiguration,
	JwtRefreshConfiguration,
} from '../model/auth-core-configuration.interface';
import {
	DEFAULT_JWT_CONFIGURATION_TOKEN,
	DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,
	JWT_CONFIGURATION_TOKEN,
	JWT_REFRESH_CONFIGURATION_TOKEN,
} from '../token/jwt-configuration.token';

/**
 * If configured, handles authentication errors with custom callbacks
 * or redirects
 */
@Injectable()
export class JwtErrorHandlingInterceptor implements HttpInterceptor {
	private readonly jwtConfiguration!: JwtConfiguration;
	private readonly jwtRefreshConfiguration?: JwtRefreshConfiguration<unknown, unknown>;
	public constructor(
		@Inject(JWT_CONFIGURATION_TOKEN)
		jwtConfig: JwtConfiguration,
		@Inject(DEFAULT_JWT_CONFIGURATION_TOKEN)
		defaultJwtConfig: JwtConfiguration,
		@Optional()
		@Inject(JWT_REFRESH_CONFIGURATION_TOKEN)
		refreshConfig?: JwtRefreshConfiguration<unknown, unknown>,
		@Optional()
		@Inject(DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN)
		defaultJwtRefreshConfig?: JwtRefreshConfiguration<unknown, unknown>,
		@Optional() private readonly router?: Router
	) {
		this.jwtConfiguration = {
			...defaultJwtConfig,
			...jwtConfig,
		};

		this.jwtRefreshConfiguration =
			defaultJwtRefreshConfig && refreshConfig
				? {
						...defaultJwtRefreshConfig,
						...refreshConfig,
				  }
				: undefined;
	}
	public intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		return next.handle(request).pipe(
			catchError((errorResponse: HttpErrorResponse) => {
				const error:
					| JwtError
					| JwtCannotRefreshError
					| JwtCouldntRefreshError = (errorResponse.error as ErrorEvent | undefined)
					?.error;
				if (
					error instanceof JwtCannotRefreshError ||
					error instanceof JwtCouldntRefreshError
				) {
					if (
						this.jwtRefreshConfiguration &&
						isNotNullish(this.jwtRefreshConfiguration.onFailure)
					) {
						this.handleFailure(
							this.jwtRefreshConfiguration.onFailure,
							error,
							this.jwtRefreshConfiguration.onFailureRedirectParameters
						);
					}
					// Rethrow the inner error, so observers of the user can see it
					return throwError(error);
				} else if (error instanceof JwtError) {
					if (isNotNullish(this.jwtConfiguration.onFailure)) {
						this.handleFailure(
							this.jwtConfiguration.onFailure,
							error,
							this.jwtConfiguration.onFailureRedirectParameters
						);
					}
					return throwError(error);
				} else {
					// Other errors are left untreated
					return throwError(errorResponse);
				}
			})
		);
	}

	private handleFailure<E>(
		errorCallbackOrRedirect: string | ((error: E) => void),
		error: E,
		redirectParameters?: ((error: E) => HttpParams | Params) | HttpParams | Params
	): void {
		if (isString(errorCallbackOrRedirect)) {
			if (this.router) {
				let queryParams = redirectParameters;
				if (typeof redirectParameters === 'function') {
					queryParams = redirectParameters(error);
				}

				this.router.navigate([errorCallbackOrRedirect], {
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
}
