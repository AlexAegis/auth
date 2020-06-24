import { HttpMethod, isExpired, JwtToken } from '@aegis-auth/jwt';
import {
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
	HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, dematerialize, materialize, tap } from 'rxjs/operators';
import {
	BLACKLISTED_PATH,
	JWT_HEADER,
	JWT_SCHEME,
	PATH_LOGIN,
	PATH_REFRESH,
	WHITELISTED_PATH,
} from '../constants';
import { RefreshRequest } from '../model';
import { AuthService } from '../service';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
	public constructor(private readonly auth: AuthService) {}

	public respond(request: HttpRequest<unknown>): Observable<HttpResponse<unknown>> | null {
		console.log('Trying to fake response', request);
		if (request.url.indexOf(PATH_LOGIN) > 0 && request.method === HttpMethod.POST) {
			// Unprotected endpoint
			const timeout = parseInt(request.params.get('tokenTimeout') || '60', 10);
			return this.makeResponse(this.auth.generateTokenPair(timeout));
		} else if (request.url.indexOf(PATH_REFRESH) > 0 && request.method === HttpMethod.POST) {
			const refreshRequest = request.body as RefreshRequest;
			console.log('Refreshing', refreshRequest);
			if (refreshRequest.refreshToken) {
				if (!isExpired(JwtToken.from(refreshRequest.refreshToken)?.payload.exp)) {
					return this.makeResponse(
						this.auth.generateTokenPair(refreshRequest.lifespan ?? 60)
					);
				} else {
					return throwError('Expired refresh token on refresh route');
				}
			} else {
				return throwError('No refresh token on refresh route');
			}
		} else if (request.url.indexOf(WHITELISTED_PATH) > 0 && request.method === HttpMethod.GET) {
			return this.checkAuthorization(request, 'this is a protected endpoint');
		} else if (request.url.indexOf(BLACKLISTED_PATH) > 0 && request.method === HttpMethod.GET) {
			return this.makeResponse('this is a unprotected endpoint');
		} else {
			console.warn('Route not handled, falling back to real http requests');
			return null;
		}
	}

	public checkAuthorization(
		request: HttpRequest<unknown>,
		response: unknown
	): Observable<HttpResponse<unknown>> {
		const jwtHeader = request.headers.get(JWT_HEADER);
		if (jwtHeader) {
			const rawJwtToken = jwtHeader.split(JWT_SCHEME)[1];
			if (!isExpired(JwtToken.from(rawJwtToken)?.payload.exp)) {
				return this.makeResponse(response);
			} else {
				return throwError('Expired token on protected route');
			}
		} else {
			return throwError('No token on protected route');
		}
	}

	public makeResponse(body?: unknown): Observable<HttpResponse<unknown>> {
		return of(new HttpResponse({ status: 200, body }));
	}

	public intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		const response = this.respond(request);
		if (response) {
			return response.pipe(
				materialize(),
				delay(500),
				tap((a) => console.log('Fake Backend Responded: ', a)),
				dematerialize()
			);
		} else return next.handle(request);
	}
}
