import { throwError } from 'rxjs';
import { JwtCannotRefreshError, JwtCouldntRefreshError, JwtError } from '../errors/jwt-error.class';
import { handleJwtFailure } from './handle-jwt-failure.function';
import { isNotNullish } from './is-not-nullish.predicate';
export const handleJwtError = (wrappedError, jwtConfiguration, jwtRefreshConfiguration, router) => {
    var _a;
    const error = (_a = wrappedError.error) === null || _a === void 0 ? void 0 : _a.error;
    if (error instanceof JwtCannotRefreshError || error instanceof JwtCouldntRefreshError) {
        if (jwtRefreshConfiguration && isNotNullish(jwtRefreshConfiguration.onFailure)) {
            handleJwtFailure(jwtRefreshConfiguration.onFailure, error, router, jwtRefreshConfiguration.onFailureRedirectParameters);
        }
        // Rethrow the inner error, so observers of the user can see it
        return throwError(error);
    }
    else if (error instanceof JwtError) {
        if (isNotNullish(jwtConfiguration.onFailure)) {
            handleJwtFailure(jwtConfiguration.onFailure, error, router, jwtConfiguration.onFailureRedirectParameters);
        }
        return throwError(error);
    }
    else {
        // Other errors are left untreated
        return throwError(wrappedError);
    }
};
//# sourceMappingURL=handle-jwt-error.function.js.map