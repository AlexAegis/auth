import { HttpErrorResponse } from '@angular/common/http';
export class JwtError extends Error {
    constructor(originalRequest, originalError, message = JwtError.type) {
        super(message);
        this.originalRequest = originalRequest;
        this.originalError = originalError;
    }
    static createErrorResponse(request, refreshError) {
        return new HttpErrorResponse({
            error: JwtError.createErrorEvent(request, refreshError),
        });
    }
    static createErrorEvent(request, refreshError) {
        return new ErrorEvent(JwtError.type, {
            error: new JwtError(request, refreshError),
        });
    }
}
JwtError.type = 'JWT_ERROR';
/**
 * When both access and refresh tokens are either invalid or expired!
 */
export class JwtCannotRefreshError extends JwtError {
    constructor(originalRequest, originalError) {
        super(originalRequest, originalError, JwtCannotRefreshError.type);
        this.originalRequest = originalRequest;
        this.originalError = originalError;
    }
    static createErrorResponse(request, refreshError) {
        return new HttpErrorResponse({
            error: JwtCannotRefreshError.createErrorEvent(request, refreshError),
        });
    }
    static createErrorEvent(request, refreshError) {
        return new ErrorEvent(JwtCannotRefreshError.type, {
            error: new JwtCannotRefreshError(request, refreshError),
        });
    }
}
JwtCannotRefreshError.type = 'JWT_CANNOT_REFRESH_ERROR';
/**
 * When refresh failed
 */
export class JwtCouldntRefreshError extends JwtError {
    constructor(originalRequest, originalError) {
        super(originalRequest, originalError, JwtCouldntRefreshError.type);
        this.originalRequest = originalRequest;
        this.originalError = originalError;
    }
    static createErrorResponse(request, refreshError) {
        return new HttpErrorResponse({
            error: JwtCouldntRefreshError.createErrorEvent(request, refreshError),
        });
    }
    static createErrorEvent(request, refreshError) {
        return new ErrorEvent(JwtCouldntRefreshError.type, {
            error: new JwtCouldntRefreshError(request, refreshError),
        });
    }
}
JwtCouldntRefreshError.type = 'JWT_COULDNT_REFRESH_ERROR';
//# sourceMappingURL=jwt-error.class.js.map