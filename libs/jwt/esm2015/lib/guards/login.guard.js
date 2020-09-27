import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { DEFAULT_JWT_REFRESH_CONFIG_DEFAULT_AUTO_IN_GUARD } from '../model/auth-core-configuration.interface';
import { JwtTokenService } from '../service/jwt-token.service';
import * as i0 from "@angular/core";
import * as i1 from "../service/jwt-token.service";
export class LoginGuard {
    constructor(jwtTokenService) {
        this.jwtTokenService = jwtTokenService;
        this.isAccessTokenValidOnce$ = this.jwtTokenService.isAccessTokenValid$.pipe(take(1));
    }
    isValid(isRefreshAllowed) {
        var _a, _b;
        const allowed = (_b = isRefreshAllowed !== null && isRefreshAllowed !== void 0 ? isRefreshAllowed : (_a = this.jwtTokenService.refreshConfig) === null || _a === void 0 ? void 0 : _a.isAutoRefreshAllowedInLoginGuardByDefault) !== null && _b !== void 0 ? _b : DEFAULT_JWT_REFRESH_CONFIG_DEFAULT_AUTO_IN_GUARD;
        return this.isAccessTokenValidOnce$.pipe(switchMap((isValid) => {
            if (!isValid && allowed) {
                return this.jwtTokenService.manualRefresh();
            }
            else {
                return of(isValid);
            }
        }));
    }
    canActivate(route, _state) {
        const data = route.data;
        return this.isValid(data === null || data === void 0 ? void 0 : data.isRefreshAllowed);
    }
    canActivateChild(childRoute, _state) {
        const data = childRoute.data;
        return this.isValid(data === null || data === void 0 ? void 0 : data.isRefreshAllowed);
    }
    canLoad(route, _segments) {
        const data = route.data;
        return this.isValid(data === null || data === void 0 ? void 0 : data.isRefreshAllowed);
    }
}
LoginGuard.ɵprov = i0.ɵɵdefineInjectable({ factory: function LoginGuard_Factory() { return new LoginGuard(i0.ɵɵinject(i1.JwtTokenService)); }, token: LoginGuard, providedIn: "root" });
LoginGuard.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
LoginGuard.ctorParameters = () => [
    { type: JwtTokenService }
];
//# sourceMappingURL=login.guard.js.map