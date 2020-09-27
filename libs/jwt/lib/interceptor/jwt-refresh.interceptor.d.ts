import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtConfiguration, JwtRefreshConfiguration } from '../model/auth-core-configuration.interface';
export declare class JwtRefreshInterceptor implements HttpInterceptor {
    private readonly jwtConfiguration;
    private readonly jwtRefreshConfiguration;
    private readonly rawRefreshToken$;
    private readonly isRawRefreshTokenGetterAvailable;
    constructor(jwtConfig: JwtConfiguration, defaultJwtConfig: JwtConfiguration, refreshConfig: JwtRefreshConfiguration<unknown, unknown>, defaultJwtRefreshConfig: JwtRefreshConfiguration<unknown, unknown>);
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>;
}
