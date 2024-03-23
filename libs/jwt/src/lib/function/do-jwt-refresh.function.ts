import { HttpHandler, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, finalize, map, mergeMap, tap } from 'rxjs/operators';
import {
	JwtRefreshConfiguration,
	JwtRefreshResponse,
} from '../model/auth-core-configuration.interface';
import { callWhenFunction } from './call-when-function.function';
import { isHttpResponse } from './http-response.predicate';

export const doJwtRefresh = <Req, Res, Ret>(
	next: HttpHandler,
	requestBody: Req,
	jwtRefreshConfiguration: JwtRefreshConfiguration<Req, Res>,
	refreshLock: BehaviorSubject<boolean>,
	onError: (refreshError: unknown) => Observable<Ret>,
	originalAction: (refreshResponse: JwtRefreshResponse) => Observable<Ret>,
): Observable<Ret> => {
	const refreshRequest = new HttpRequest<Req>(
		jwtRefreshConfiguration.method ?? 'POST',
		jwtRefreshConfiguration.refreshUrl,
		requestBody,
		callWhenFunction(jwtRefreshConfiguration.refreshRequestInitials),
	);
	refreshLock.next(true); // Lock on refresh
	return next.handle(refreshRequest).pipe(
		filter(isHttpResponse),
		map((response) => jwtRefreshConfiguration.transformRefreshResponse(response.body)),
		tap((refreshResponse) => jwtRefreshConfiguration.setRefreshedTokens(refreshResponse)),
		mergeMap((refreshResponse) => originalAction(refreshResponse)),
		finalize(() => refreshLock.next(false)), // Unlock on finish
		catchError(onError),
	);
};
