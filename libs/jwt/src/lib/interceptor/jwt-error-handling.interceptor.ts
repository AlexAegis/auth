import {
	HttpErrorResponse,
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleJwtError } from '../function/jwt-error-handler.function';
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
	private readonly jwtConfiguration: JwtConfiguration;
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
		return next
			.handle(request)
			.pipe(
				catchError((errorResponse: HttpErrorResponse) =>
					handleJwtError(
						errorResponse,
						this.jwtConfiguration,
						this.jwtRefreshConfiguration,
						this.router
					)
				)
			);
	}
}
