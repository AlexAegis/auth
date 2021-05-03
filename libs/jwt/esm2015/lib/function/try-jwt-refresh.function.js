import { throwError } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { checkAgainstHttpErrorFilter } from './check-against-http-error-filter.function';
import { doJwtRefresh } from './do-jwt-refresh.function';
import { intoObservable } from './into-observable.function';
export const tryJwtRefresh = (next, originalError, jwtRefreshConfiguration, refreshLock, onError, originalAction) => {
    const isRefreshAllowed = typeof originalError === 'string' ||
        checkAgainstHttpErrorFilter(jwtRefreshConfiguration, originalError);
    if (isRefreshAllowed) {
        return intoObservable(jwtRefreshConfiguration.createRefreshRequestBody).pipe(take(1), switchMap((requestBody) => {
            if (requestBody) {
                return doJwtRefresh(next, requestBody, jwtRefreshConfiguration, refreshLock, onError, originalAction);
            }
            else {
                return onError(originalError);
            }
        }));
    }
    else {
        return throwError(originalError);
    }
};
//# sourceMappingURL=try-jwt-refresh.function.js.map