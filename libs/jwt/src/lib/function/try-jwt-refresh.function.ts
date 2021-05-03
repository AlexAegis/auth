import { HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import {
	JwtRefreshConfiguration,
	JwtRefreshResponse,
} from '../model/auth-core-configuration.interface';
import { checkAgainstHttpErrorFilter } from './check-against-http-error-filter.function';
import { doJwtRefresh } from './do-jwt-refresh.function';
import { intoObservable } from './into-observable.function';

export const tryJwtRefresh = <Req, Res, Ret>(
	next: HttpHandler,
	originalError: string | HttpErrorResponse,
	jwtRefreshConfiguration: JwtRefreshConfiguration<Req, Res>,
	onError: (refreshError: unknown) => Observable<Ret>,
	originalAction: (refreshResponse: JwtRefreshResponse) => Observable<Ret>
): Observable<Ret> => {
	const isRefreshAllowed =
		typeof originalError === 'string' ||
		checkAgainstHttpErrorFilter(jwtRefreshConfiguration, originalError);
	if (isRefreshAllowed) {
		return intoObservable(jwtRefreshConfiguration.createRefreshRequestBody).pipe(
			take(1),
			switchMap((requestBody) => {
				if (requestBody) {
					return doJwtRefresh(
						next,
						requestBody,
						jwtRefreshConfiguration,
						onError,
						originalAction
					);
				} else {
					return onError(originalError);
				}
			})
		);
	} else {
		return throwError(originalError);
	}
};
