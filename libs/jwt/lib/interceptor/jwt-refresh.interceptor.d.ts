import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtConfiguration, JwtRefreshConfiguration } from '../model/auth-core-configuration.interface';
import { JwtRefreshStateService } from '../service/jwt-refresh-state.service';
import { JwtTokenService } from '../service/jwt-token.service';
import * as i0 from "@angular/core";
export declare class JwtRefreshInterceptor implements HttpInterceptor {
    readonly jwtConfig: JwtConfiguration;
    readonly defaultJwtConfig: JwtConfiguration;
    readonly refreshConfig: JwtRefreshConfiguration<unknown, unknown>;
    readonly defaultJwtRefreshConfig: JwtRefreshConfiguration<unknown, unknown>;
    private readonly jwtRefreshStateService;
    private readonly jwtTokenService;
    private readonly jwtConfiguration;
    private readonly jwtRefreshConfiguration;
    private readonly rawRefreshToken$;
    private readonly isRawRefreshTokenGetterAvailable;
    constructor(jwtConfig: JwtConfiguration, defaultJwtConfig: JwtConfiguration, refreshConfig: JwtRefreshConfiguration<unknown, unknown>, defaultJwtRefreshConfig: JwtRefreshConfiguration<unknown, unknown>, jwtRefreshStateService: JwtRefreshStateService, jwtTokenService: JwtTokenService);
    private handleWithToken;
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<JwtRefreshInterceptor, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<JwtRefreshInterceptor>;
}
