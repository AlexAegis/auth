import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtCannotRefreshError, JwtCouldntRefreshError, JwtError } from '../errors/jwt-error.class';
import { JwtConfiguration, JwtRefreshConfiguration } from '../model/auth-core-configuration.interface';
export declare const handleJwtError: <RefreshRequest = unknown, RefreshResponse = unknown>(wrappedError: (Omit<HttpErrorResponse, 'error'> & {
    error?: Omit<ErrorEvent, 'error'> & {
        error: JwtError | JwtCannotRefreshError | JwtCouldntRefreshError;
    };
}) | {
    error?: {
        error: JwtError | JwtCannotRefreshError | JwtCouldntRefreshError;
    };
}, jwtConfiguration: JwtConfiguration, jwtRefreshConfiguration?: JwtRefreshConfiguration<RefreshRequest, RefreshResponse> | undefined, router?: Router) => Observable<never>;
