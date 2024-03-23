import { HttpMethod } from '@aegis-auth/jwt';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PATH_LOGIN, PATH_REFRESH } from '../constants';
import { StateService } from '../service/state.service';

@Injectable()
export class RequestCounterInterceptor implements HttpInterceptor {
	public constructor(private readonly stateService: StateService) {}

	public intercept(
		request: HttpRequest<unknown>,
		next: HttpHandler,
	): Observable<HttpEvent<unknown>> {
		if (request.url.indexOf(PATH_REFRESH) > 0 && request.method === HttpMethod.POST) {
			this.stateService.refreshRequestCount$.next(
				this.stateService.refreshRequestCount$.value + 1,
			);
		} else if (request.url.indexOf(PATH_LOGIN) > 0 && request.method === HttpMethod.POST) {
			this.stateService.loginRequestCount$.next(
				this.stateService.loginRequestCount$.value + 1,
			);
		} else {
			this.stateService.launchedRequestCount$.next(
				this.stateService.launchedRequestCount$.value + 1,
			);
		}

		return next.handle(request).pipe(
			tap(() => {
				this.stateService.successfulResponseCount$.next(
					this.stateService.successfulResponseCount$.value + 1,
				);
			}),
			catchError((error) => {
				this.stateService.failedResponseCount$.next(
					this.stateService.failedResponseCount$.value + 1,
				);
				return throwError(error);
			}),
		);
	}
}
