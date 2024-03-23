import { ActivatedRouteSnapshot, Route, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtTokenService } from '../service/jwt-token.service';
import * as i0 from "@angular/core";
/**
 * This interface is for your convinience to use with Route data to see what
 * you can configure on the LoginGuard
 */
export interface LoginGuardData {
    /**
     * Explicitly enable or disable auto refreshing on the route.
     */
    isRefreshAllowed: boolean;
}
export declare class LoginGuard {
    private readonly jwtTokenService;
    private isAccessTokenValidOnce$;
    constructor(jwtTokenService: JwtTokenService);
    canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
    canActivateChild(childRoute: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
    canLoad(route: Route, _segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean;
    private isValid;
    static ɵfac: i0.ɵɵFactoryDeclaration<LoginGuard, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LoginGuard>;
}
