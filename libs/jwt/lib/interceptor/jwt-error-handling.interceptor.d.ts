import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtConfiguration, JwtRefreshConfiguration } from '../model/auth-core-configuration.interface';
/**
 * If configured, handles authentication errors with custom callbacks
 * or redirects
 */
export declare class JwtErrorHandlingInterceptor implements HttpInterceptor {
    private readonly router?;
    private readonly jwtConfiguration;
    private readonly jwtRefreshConfiguration?;
    constructor(jwtConfig: JwtConfiguration, defaultJwtConfig: JwtConfiguration, refreshConfig?: JwtRefreshConfiguration<unknown, unknown>, defaultJwtRefreshConfig?: JwtRefreshConfiguration<unknown, unknown>, router?: Router | undefined);
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>;
}
