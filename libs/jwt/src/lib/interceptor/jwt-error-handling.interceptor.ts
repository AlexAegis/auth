import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JwtError } from '../errors';
import { isString } from '../function';
import { JwtConfiguration, JwtRefreshConfiguration } from '../model';
import {
	DEFAULT_JWT_CONFIGURATION_TOKEN,
	DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,
	JWT_CONFIGURATION_TOKEN,
	JWT_REFRESH_CONFIGURATION_TOKEN,
} from '../token';

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
		console.log('Error handling interceptor');
		return next.handle(request).pipe(
			catchError((error) => {
				console.log('Catched an error', JSON.stringify(error));
				console.error(error);
				if (error instanceof JwtError) {
					console.log('handling error', error.originalError, error.originalRequest);
					return EMPTY;
				} else {
					return throwError(error);
				}
			})
		);
	}

	/**
	 * Cannot refresh can happen when
	 */
	private handleFailure(originalRequest: HttpRequest<unknown>, error: unknown): void {
		if (this.jwtRefreshConfiguration?.onCannotRefresh) {
			if (isString(this.jwtRefreshConfiguration.onCannotRefresh)) {
				if (this.router) {
					this.router.navigate([this.jwtRefreshConfiguration.onCannotRefresh]);
				} else {
					// This error is intended to surface as it's a configuration problem
					throw new Error(
						'JWT Refresh configuration error!' +
							' `onCannotRefresh` is defined as a string, but' +
							'Router is not available! Is @angular/router ' +
							'installed and the RouterModule imported?'
					);
				}
			} else {
				this.jwtRefreshConfiguration.onCannotRefresh(originalRequest, error);
			}
		}
	}
}
