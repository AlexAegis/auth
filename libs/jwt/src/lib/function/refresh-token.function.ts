import { HttpErrorResponse, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import { callWhenFunction } from '../function/call-when-function.function';
import { checkAgainstHttpErrorFilter } from '../function/check-against-http-error-filter.function';
import { isHttpResponse } from '../function/http-response.predicate';
import { intoObservable } from '../function/into-observable.function';
import {
	JwtRefreshConfiguration,
	JwtRefreshResponse,
} from '../model/auth-core-configuration.interface';

export function tryRefresh<Req, Res, Ret>(
	next: HttpHandler,
	originalError: string | HttpErrorResponse,
	jwtRefreshConfiguration: JwtRefreshConfiguration<Req, Res>,
	onError: (refreshError: unknown) => Observable<Ret>,
	originalAction: (refreshResponse: JwtRefreshResponse) => Observable<Ret>
): Observable<Ret> {
	const isRefreshAllowed =
		typeof originalError === 'string' ||
		checkAgainstHttpErrorFilter(jwtRefreshConfiguration, originalError);
	if (isRefreshAllowed) {
		return intoObservable(jwtRefreshConfiguration.createRefreshRequestBody).pipe(
			take(1),
			switchMap((requestBody) =>
				doRefresh(next, requestBody, jwtRefreshConfiguration, onError, originalAction)
			)
		);
	} else return throwError(originalError);
}

export function doRefresh<Req, Res, Ret>(
	next: HttpHandler,
	requestBody: any,
	jwtRefreshConfiguration: JwtRefreshConfiguration<Req, Res>,
	onError: (refreshError: unknown) => Observable<Ret>,
	originalAction: (refreshResponse: JwtRefreshResponse) => Observable<Ret>
): Observable<Ret> {
	const refreshRequest = new HttpRequest<unknown>(
		jwtRefreshConfiguration.method ?? 'POST',
		jwtRefreshConfiguration.refreshUrl,
		requestBody,
		callWhenFunction(jwtRefreshConfiguration.refreshRequestInitials)
	);

	return next.handle(refreshRequest).pipe(
		filter(isHttpResponse),
		map((response) => jwtRefreshConfiguration.transformRefreshResponse(response.body)),
		tap((refreshResponse) => jwtRefreshConfiguration.setRefreshedTokens(refreshResponse)),
		switchMap((refreshResponse) => originalAction(refreshResponse)),
		catchError(onError)
	);
}
