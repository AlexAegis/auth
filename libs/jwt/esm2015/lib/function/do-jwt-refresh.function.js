import { HttpRequest } from '@angular/common/http';
import { catchError, filter, finalize, map, mergeMap, tap } from 'rxjs/operators';
import { callWhenFunction } from './call-when-function.function';
import { isHttpResponse } from './http-response.predicate';
export const doJwtRefresh = (next, requestBody, jwtRefreshConfiguration, refreshLock, onError, originalAction) => {
    var _a;
    const refreshRequest = new HttpRequest((_a = jwtRefreshConfiguration.method) !== null && _a !== void 0 ? _a : 'POST', jwtRefreshConfiguration.refreshUrl, requestBody, callWhenFunction(jwtRefreshConfiguration.refreshRequestInitials));
    refreshLock.next(true); // Lock on refresh
    return next.handle(refreshRequest).pipe(filter(isHttpResponse), map((response) => jwtRefreshConfiguration.transformRefreshResponse(response.body)), tap((refreshResponse) => jwtRefreshConfiguration.setRefreshedTokens(refreshResponse)), mergeMap((refreshResponse) => originalAction(refreshResponse)), finalize(() => refreshLock.next(false)), // Unlock on finish
    catchError(onError));
};
//# sourceMappingURL=do-jwt-refresh.function.js.map