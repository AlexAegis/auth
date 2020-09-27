import { HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, filter, map, mergeMap, tap } from 'rxjs/operators';
import {
	JwtRefreshConfiguration,
	JwtRefreshResponse,
} from '../model/auth-core-configuration.interface';
import { callWhenFunction } from './call-when-function.function';
import { isHttpResponse } from './http-response.predicate';
import { isNotNullish } from './is-not-nullish.predicate';

export function doJwtRefresh<Req, Res, Ret>(
	next: HttpHandler,
	requestBody: Req,
	jwtRefreshConfiguration: JwtRefreshConfiguration<Req, Res>,
	onError: (refreshError: unknown) => Observable<Ret>,
	originalAction: (refreshResponse: JwtRefreshResponse) => Observable<Ret>
): Observable<Ret> {
	const refreshRequest = new HttpRequest<Req>(
		isNotNullish(jwtRefreshConfiguration.method) ? jwtRefreshConfiguration.method : 'POST',
		jwtRefreshConfiguration.refreshUrl,
		requestBody,
		callWhenFunction(jwtRefreshConfiguration.refreshRequestInitials)
	);

	return next.handle(refreshRequest).pipe(
		filter(isHttpResponse),
		map((response) => jwtRefreshConfiguration.transformRefreshResponse(response.body)),
		tap((refreshResponse) => jwtRefreshConfiguration.setRefreshedTokens(refreshResponse)),
		mergeMap((refreshResponse) => originalAction(refreshResponse)),
		catchError(onError)
	);
}
