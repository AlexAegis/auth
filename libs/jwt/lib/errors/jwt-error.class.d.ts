import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
export declare class JwtError extends Error {
    readonly originalRequest: HttpRequest<unknown> | undefined;
    readonly originalError: unknown;
    static type: string;
    constructor(originalRequest: HttpRequest<unknown> | undefined, originalError: unknown, message?: string);
    static createErrorResponse(request: HttpRequest<unknown> | undefined, refreshError: unknown): HttpErrorResponse;
    static createErrorEvent(request: HttpRequest<unknown> | undefined, refreshError: unknown): ErrorEvent;
}
/**
 * When both access and refresh tokens are either invalid or expired!
 */
export declare class JwtCannotRefreshError extends JwtError {
    readonly originalRequest: HttpRequest<unknown> | undefined;
    readonly originalError: unknown;
    static type: string;
    constructor(originalRequest: HttpRequest<unknown> | undefined, originalError: unknown);
    static createErrorResponse(request: HttpRequest<unknown> | undefined, refreshError: unknown): HttpErrorResponse;
    static createErrorEvent(request: HttpRequest<unknown> | undefined, refreshError: unknown): ErrorEvent;
}
/**
 * When refresh failed
 */
export declare class JwtCouldntRefreshError extends JwtError {
    readonly originalRequest: HttpRequest<unknown> | undefined;
    readonly originalError: unknown;
    static type: string;
    constructor(originalRequest: HttpRequest<unknown> | undefined, originalError: unknown);
    static createErrorResponse(request: HttpRequest<unknown> | undefined, refreshError: unknown): HttpErrorResponse;
    static createErrorEvent(request: HttpRequest<unknown> | undefined, refreshError: unknown): ErrorEvent;
}
