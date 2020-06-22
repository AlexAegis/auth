import { HttpMethod } from '@aegis-auth/jwt';
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
import { AuthService, MockServerService } from '../service';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
	public constructor(
		private readonly mockBackend: MockServerService,
		private readonly auth: AuthService
	) {}

	public respond(route: string, method: HttpMethod): Observable<HttpResponse<unknown>> {
		console.log('responde');
		if (route.indexOf('login') > 0 && method === HttpMethod.POST) {
			console.log('responde loggin');
			// Unprotected endpoint
			return this.ok(this.auth.generateTokenPair());
		} else if (route.indexOf('refresh') > 0 && method === HttpMethod.POST) {
			return this.ok('');
		} else {
			return throwError('Route not handled');
		}
	}

	public ok(body?: unknown): Observable<HttpResponse<unknown>> {
		return of(new HttpResponse({ status: 200, body }));
	}

	public intercept(
		request: HttpRequest<unknown>,
		_next: HttpHandler
	): Observable<HttpEvent<unknown>> {
		console.log('FakeBackendInterceptor intercepting!');
		const response = this.respond(request.url, request.method as HttpMethod);

		return response.pipe(
			materialize(),
			delay(500),
			dematerialize(),
			tap((a) => console.log(a))
		);
	}
}
