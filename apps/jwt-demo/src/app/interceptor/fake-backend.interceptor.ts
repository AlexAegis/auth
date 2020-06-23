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
	PATH_LOGIN,
	PATH_REFRESH,
	WHITELISTED_PATH,
} from '../constants';
import { RefreshRequest } from '../model';
import { AuthService, MockServerService } from '../service';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
	public constructor(
		private readonly mockBackend: MockServerService,
		private readonly auth: AuthService
	) {}

	public respond(request: HttpRequest<unknown>): Observable<HttpResponse<unknown>> | null {
		console.log('Trying to fake response');
		if (request.url.indexOf(PATH_LOGIN) > 0 && request.method === HttpMethod.POST) {
			// Unprotected endpoint
			return this.makeResponse(this.auth.generateTokenPair());
		} else if (request.url.indexOf(PATH_REFRESH) > 0 && request.method === HttpMethod.POST) {
			console.log('Refreshing');
			const refreshRequest = request.body as RefreshRequest;
			if (refreshRequest.refreshToken) {
				if (!isExpired(JwtToken.from(refreshRequest.refreshToken)?.payload.exp)) {
					return this.makeResponse(this.auth.generateTokenPair());
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
		const jwt = request.headers.get(JWT_HEADER);
		if (jwt) {
			if (!isExpired(JwtToken.from(jwt)?.payload.exp)) {
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
		console.log('FakeBackendInterceptor intercepting!');
		const response = this.respond(request);

		if (response) {
			return response.pipe(
				materialize(),
				delay(500),
				dematerialize(),
				tap((a) => console.log(a))
			);
		} else return next.handle(request);
	}
}
