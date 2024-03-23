import { HttpHandler } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { JwtCouldntRefreshError } from '../errors/jwt-error.class';
import { handleJwtError } from '../function/handle-jwt-error.function';
import { intoObservable } from '../function/into-observable.function';
import { isNotNullish } from '../function/is-not-nullish.predicate';
import { isUnixTimestampExpiredNowAndWhenItIs } from '../function/is-unix-timestamp-expired-now-and-when-it-is.function';
import { isString } from '../function/string.predicate';
import { tryJwtRefresh } from '../function/try-jwt-refresh.function';
import { JwtToken } from '../model/jwt-token.class';
import { DEFAULT_JWT_CONFIGURATION_TOKEN, DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN, JWT_CONFIGURATION_TOKEN, JWT_REFRESH_CONFIGURATION_TOKEN, } from '../token/jwt-configuration.token';
import { JwtRefreshStateService } from './jwt-refresh-state.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "./jwt-refresh-state.service";
import * as i3 from "@angular/router";
export class JwtTokenService {
    constructor(httpHandler, jwtRefreshStateService, rawConfig, rawDefaultConfig, rawDefaultRefreshConfig, rawRefreshConfig, router) {
        this.httpHandler = httpHandler;
        this.jwtRefreshStateService = jwtRefreshStateService;
        this.rawConfig = rawConfig;
        this.rawDefaultConfig = rawDefaultConfig;
        this.rawDefaultRefreshConfig = rawDefaultRefreshConfig;
        this.rawRefreshConfig = rawRefreshConfig;
        this.router = router;
        this.config = {
            ...this.rawDefaultConfig,
            ...this.rawConfig,
        };
        this.refreshConfig = this.rawDefaultRefreshConfig && this.rawRefreshConfig
            ? {
                ...this.rawDefaultRefreshConfig,
                ...this.rawRefreshConfig,
            }
            : undefined;
        /**
         * Consider restricting getToken to observables only so things can be cached
         */
        this.rawAccessToken$ = intoObservable(this.config.getToken);
        this.rawRefreshToken$ = this.refreshConfig?.getRefreshToken
            ? intoObservable(this.refreshConfig.getRefreshToken)
            : of(null);
        this.accessToken$ = this.rawAccessToken$.pipe(map((token) => {
            if (isString(token)) {
                const jwtToken = JwtToken.from(token);
                if (!jwtToken) {
                    throw new Error('Non-valid token observed');
                }
                else {
                    return jwtToken;
                }
            }
            else {
                return null;
            }
        }));
        this.refreshToken$ = this.rawRefreshToken$.pipe(map((refreshToken) => {
            if (isString(refreshToken)) {
                const jwtToken = JwtToken.from(refreshToken);
                if (!jwtToken) {
                    throw new Error('Non-valid token observed');
                }
                else {
                    return jwtToken;
                }
            }
            else {
                return null;
            }
        }));
        this.accessTokenHeader$ = this.accessToken$.pipe(map((token) => token?.header ?? null));
        this.accessTokenPayload$ = this.accessToken$.pipe(map((token) => token?.payload ?? null));
        this.refreshTokenHeader$ = this.refreshToken$.pipe(map((token) => token?.header ?? null));
        this.refreshTokenPayload$ = this.refreshToken$.pipe(map((token) => token?.payload ?? null));
        this.isAccessTokenExpired$ = this.accessToken$.pipe(switchMap((token) => token ? isUnixTimestampExpiredNowAndWhenItIs(token.payload.exp) : of(null)));
        this.isRefreshTokenExpired$ = this.refreshToken$.pipe(switchMap((token) => token ? isUnixTimestampExpiredNowAndWhenItIs(token.payload.exp) : of(null)));
        this.isAccessTokenValid$ = this.isAccessTokenExpired$.pipe(map((isExpired) => isNotNullish(isExpired) && !isExpired));
        this.isRefreshTokenValid$ = this.isRefreshTokenExpired$.pipe(map((isExpired) => isNotNullish(isExpired) && !isExpired));
    }
    /**
     * Does a token refresh. Emits false if it failed, or true if succeeded.
     */
    manualRefresh() {
        if (this.refreshConfig) {
            return tryJwtRefresh(this.httpHandler, 'Access token not valid on guard activation', this.refreshConfig, this.jwtRefreshStateService.refreshLock$, (refreshError) => handleJwtError(JwtCouldntRefreshError.createErrorResponse(undefined, refreshError), this.config, this.refreshConfig, this.router).pipe(catchError(() => of(false))), () => of(true));
        }
        else {
            return of(false);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: JwtTokenService, deps: [{ token: i1.HttpHandler }, { token: i2.JwtRefreshStateService }, { token: JWT_CONFIGURATION_TOKEN }, { token: DEFAULT_JWT_CONFIGURATION_TOKEN }, { token: DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN, optional: true }, { token: JWT_REFRESH_CONFIGURATION_TOKEN, optional: true }, { token: i3.Router, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: JwtTokenService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: JwtTokenService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1.HttpHandler }, { type: i2.JwtRefreshStateService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [JWT_CONFIGURATION_TOKEN]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DEFAULT_JWT_CONFIGURATION_TOKEN]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN]
                }, {
                    type: Optional
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [JWT_REFRESH_CONFIGURATION_TOKEN]
                }, {
                    type: Optional
                }] }, { type: i3.Router, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0LXRva2VuLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9saWJzL2p3dC9zcmMvbGliL3NlcnZpY2Uvand0LXRva2VuLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFjLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN0QyxPQUFPLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1RCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDdkUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUNwRSxPQUFPLEVBQUUsb0NBQW9DLEVBQUUsTUFBTSxtRUFBbUUsQ0FBQztBQUN6SCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDeEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBS3JFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNwRCxPQUFPLEVBQ04sK0JBQStCLEVBQy9CLHVDQUF1QyxFQUN2Qyx1QkFBdUIsRUFDdkIsK0JBQStCLEdBQy9CLE1BQU0sa0NBQWtDLENBQUM7QUFDMUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7Ozs7O0FBS3JFLE1B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Q0FDbkIsSUFBSSxDQUFDLFdBQVcsRUFDaEIsNENBQTRDLEVBQzVDLElBQUksQ0FBQyxhQUFhLEVBQ2xCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLEVBQ3hDLENBQUMsWUFBWSxFQUFFLEVBQUUsQ0FDaEIsY0FBYyxDQUNiLHNCQUFzQixDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsRUFDbkUsSUFBSSxDQUFDLE1BQU0sRUFDWCxJQUFJLENBQUMsYUFBYSxFQUNsQixJQUFJLENBQUMsTUFBTSxDQUNYLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUNwQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQ2QsQ0FBQztTQUNGO2FBQU07WUFDTixPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNqQjtJQUNGLENBQUM7K0dBMUlXLGVBQWUsbUZBaUdsQix1QkFBdUIsYUFFdkIsK0JBQStCLGFBRS9CLHVDQUF1Qyw2QkFNdkMsK0JBQStCO21IQTNHNUIsZUFBZSxjQUZmLE1BQU07OzRGQUVOLGVBQWU7a0JBSDNCLFVBQVU7bUJBQUM7b0JBQ1gsVUFBVSxFQUFFLE1BQU07aUJBQ2xCOzswQkFrR0UsTUFBTTsyQkFBQyx1QkFBdUI7OzBCQUU5QixNQUFNOzJCQUFDLCtCQUErQjs7MEJBRXRDLE1BQU07MkJBQUMsdUNBQXVDOzswQkFDOUMsUUFBUTs7MEJBS1IsTUFBTTsyQkFBQywrQkFBK0I7OzBCQUN0QyxRQUFROzswQkFLUixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cEhhbmRsZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgb2YgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IsIG1hcCwgc3dpdGNoTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgSnd0Q291bGRudFJlZnJlc2hFcnJvciB9IGZyb20gJy4uL2Vycm9ycy9qd3QtZXJyb3IuY2xhc3MnO1xuaW1wb3J0IHsgaGFuZGxlSnd0RXJyb3IgfSBmcm9tICcuLi9mdW5jdGlvbi9oYW5kbGUtand0LWVycm9yLmZ1bmN0aW9uJztcbmltcG9ydCB7IGludG9PYnNlcnZhYmxlIH0gZnJvbSAnLi4vZnVuY3Rpb24vaW50by1vYnNlcnZhYmxlLmZ1bmN0aW9uJztcbmltcG9ydCB7IGlzTm90TnVsbGlzaCB9IGZyb20gJy4uL2Z1bmN0aW9uL2lzLW5vdC1udWxsaXNoLnByZWRpY2F0ZSc7XG5pbXBvcnQgeyBpc1VuaXhUaW1lc3RhbXBFeHBpcmVkTm93QW5kV2hlbkl0SXMgfSBmcm9tICcuLi9mdW5jdGlvbi9pcy11bml4LXRpbWVzdGFtcC1leHBpcmVkLW5vdy1hbmQtd2hlbi1pdC1pcy5mdW5jdGlvbic7XG5pbXBvcnQgeyBpc1N0cmluZyB9IGZyb20gJy4uL2Z1bmN0aW9uL3N0cmluZy5wcmVkaWNhdGUnO1xuaW1wb3J0IHsgdHJ5Snd0UmVmcmVzaCB9IGZyb20gJy4uL2Z1bmN0aW9uL3RyeS1qd3QtcmVmcmVzaC5mdW5jdGlvbic7XG5pbXBvcnQge1xuXHRKd3RDb25maWd1cmF0aW9uLFxuXHRKd3RSZWZyZXNoQ29uZmlndXJhdGlvbixcbn0gZnJvbSAnLi4vbW9kZWwvYXV0aC1jb3JlLWNvbmZpZ3VyYXRpb24uaW50ZXJmYWNlJztcbmltcG9ydCB7IEp3dFRva2VuIH0gZnJvbSAnLi4vbW9kZWwvand0LXRva2VuLmNsYXNzJztcbmltcG9ydCB7XG5cdERFRkFVTFRfSldUX0NPTkZJR1VSQVRJT05fVE9LRU4sXG5cdERFRkFVTFRfSldUX1JFRlJFU0hfQ09ORklHVVJBVElPTl9UT0tFTixcblx0SldUX0NPTkZJR1VSQVRJT05fVE9LRU4sXG5cdEpXVF9SRUZSRVNIX0NPTkZJR1VSQVRJT05fVE9LRU4sXG59IGZyb20gJy4uL3Rva2VuL2p3dC1jb25maWd1cmF0aW9uLnRva2VuJztcbmltcG9ydCB7IEp3dFJlZnJlc2hTdGF0ZVNlcnZpY2UgfSBmcm9tICcuL2p3dC1yZWZyZXNoLXN0YXRlLnNlcnZpY2UnO1xuXG5ASW5qZWN0YWJsZSh7XG5cdHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgSnd0VG9rZW5TZXJ2aWNlPFxuXHRDbGFpbXMgPSBSZWNvcmQ8c3RyaW5nIHwgbnVtYmVyLCB1bmtub3duPixcblx0UmVmcmVzaENsYWltcyA9IFJlY29yZDxzdHJpbmcgfCBudW1iZXIsIHVua25vd24+LFxuXHRSZWZyZXNoUmVxdWVzdCA9IFJlY29yZDxzdHJpbmcgfCBudW1iZXIsIHVua25vd24+LFxuXHRSZWZyZXNoUmVzcG9uc2UgPSBSZWNvcmQ8c3RyaW5nIHwgbnVtYmVyLCB1bmtub3duPlxuPiB7XG5cdHB1YmxpYyByZWFkb25seSBjb25maWc6IEp3dENvbmZpZ3VyYXRpb24gPSB7XG5cdFx0Li4udGhpcy5yYXdEZWZhdWx0Q29uZmlnLFxuXHRcdC4uLnRoaXMucmF3Q29uZmlnLFxuXHR9O1xuXG5cdHB1YmxpYyByZWFkb25seSByZWZyZXNoQ29uZmlnPzogSnd0UmVmcmVzaENvbmZpZ3VyYXRpb248UmVmcmVzaFJlcXVlc3QsIFJlZnJlc2hSZXNwb25zZT4gPVxuXHRcdHRoaXMucmF3RGVmYXVsdFJlZnJlc2hDb25maWcgJiYgdGhpcy5yYXdSZWZyZXNoQ29uZmlnXG5cdFx0XHQ/IHtcblx0XHRcdFx0XHQuLi50aGlzLnJhd0RlZmF1bHRSZWZyZXNoQ29uZmlnLFxuXHRcdFx0XHRcdC4uLnRoaXMucmF3UmVmcmVzaENvbmZpZyxcblx0XHRcdCAgfVxuXHRcdFx0OiB1bmRlZmluZWQ7XG5cblx0LyoqXG5cdCAqIENvbnNpZGVyIHJlc3RyaWN0aW5nIGdldFRva2VuIHRvIG9ic2VydmFibGVzIG9ubHkgc28gdGhpbmdzIGNhbiBiZSBjYWNoZWRcblx0ICovXG5cdHB1YmxpYyByZWFkb25seSByYXdBY2Nlc3NUb2tlbiQgPSBpbnRvT2JzZXJ2YWJsZSh0aGlzLmNvbmZpZy5nZXRUb2tlbik7XG5cblx0cHVibGljIHJlYWRvbmx5IHJhd1JlZnJlc2hUb2tlbiQgPSB0aGlzLnJlZnJlc2hDb25maWc/LmdldFJlZnJlc2hUb2tlblxuXHRcdD8gaW50b09ic2VydmFibGUodGhpcy5yZWZyZXNoQ29uZmlnLmdldFJlZnJlc2hUb2tlbilcblx0XHQ6IG9mKG51bGwpO1xuXG5cdHB1YmxpYyByZWFkb25seSBhY2Nlc3NUb2tlbiQgPSB0aGlzLnJhd0FjY2Vzc1Rva2VuJC5waXBlKFxuXHRcdG1hcCgodG9rZW4pID0+IHtcblx0XHRcdGlmIChpc1N0cmluZyh0b2tlbikpIHtcblx0XHRcdFx0Y29uc3Qgand0VG9rZW4gPSBKd3RUb2tlbi5mcm9tPENsYWltcz4odG9rZW4pO1xuXHRcdFx0XHRpZiAoIWp3dFRva2VuKSB7XG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdOb24tdmFsaWQgdG9rZW4gb2JzZXJ2ZWQnKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gand0VG9rZW47XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdH0pXG5cdCk7XG5cblx0cHVibGljIHJlYWRvbmx5IHJlZnJlc2hUb2tlbiQgPSB0aGlzLnJhd1JlZnJlc2hUb2tlbiQucGlwZShcblx0XHRtYXAoKHJlZnJlc2hUb2tlbikgPT4ge1xuXHRcdFx0aWYgKGlzU3RyaW5nKHJlZnJlc2hUb2tlbikpIHtcblx0XHRcdFx0Y29uc3Qgand0VG9rZW4gPSBKd3RUb2tlbi5mcm9tPFJlZnJlc2hDbGFpbXM+KHJlZnJlc2hUb2tlbik7XG5cdFx0XHRcdGlmICghand0VG9rZW4pIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ05vbi12YWxpZCB0b2tlbiBvYnNlcnZlZCcpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBqd3RUb2tlbjtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cdFx0fSlcblx0KTtcblxuXHRwdWJsaWMgcmVhZG9ubHkgYWNjZXNzVG9rZW5IZWFkZXIkID0gdGhpcy5hY2Nlc3NUb2tlbiQucGlwZShcblx0XHRtYXAoKHRva2VuKSA9PiB0b2tlbj8uaGVhZGVyID8/IG51bGwpXG5cdCk7XG5cblx0cHVibGljIHJlYWRvbmx5IGFjY2Vzc1Rva2VuUGF5bG9hZCQgPSB0aGlzLmFjY2Vzc1Rva2VuJC5waXBlKFxuXHRcdG1hcCgodG9rZW4pID0+IHRva2VuPy5wYXlsb2FkID8/IG51bGwpXG5cdCk7XG5cblx0cHVibGljIHJlYWRvbmx5IHJlZnJlc2hUb2tlbkhlYWRlciQgPSB0aGlzLnJlZnJlc2hUb2tlbiQucGlwZShcblx0XHRtYXAoKHRva2VuKSA9PiB0b2tlbj8uaGVhZGVyID8/IG51bGwpXG5cdCk7XG5cblx0cHVibGljIHJlYWRvbmx5IHJlZnJlc2hUb2tlblBheWxvYWQkID0gdGhpcy5yZWZyZXNoVG9rZW4kLnBpcGUoXG5cdFx0bWFwKCh0b2tlbikgPT4gdG9rZW4/LnBheWxvYWQgPz8gbnVsbClcblx0KTtcblxuXHRwdWJsaWMgcmVhZG9ubHkgaXNBY2Nlc3NUb2tlbkV4cGlyZWQkID0gdGhpcy5hY2Nlc3NUb2tlbiQucGlwZShcblx0XHRzd2l0Y2hNYXAoKHRva2VuKSA9PlxuXHRcdFx0dG9rZW4gPyBpc1VuaXhUaW1lc3RhbXBFeHBpcmVkTm93QW5kV2hlbkl0SXModG9rZW4ucGF5bG9hZC5leHApIDogb2YobnVsbClcblx0XHQpXG5cdCk7XG5cblx0cHVibGljIHJlYWRvbmx5IGlzUmVmcmVzaFRva2VuRXhwaXJlZCQgPSB0aGlzLnJlZnJlc2hUb2tlbiQucGlwZShcblx0XHRzd2l0Y2hNYXAoKHRva2VuKSA9PlxuXHRcdFx0dG9rZW4gPyBpc1VuaXhUaW1lc3RhbXBFeHBpcmVkTm93QW5kV2hlbkl0SXModG9rZW4ucGF5bG9hZC5leHApIDogb2YobnVsbClcblx0XHQpXG5cdCk7XG5cblx0cHVibGljIHJlYWRvbmx5IGlzQWNjZXNzVG9rZW5WYWxpZCQgPSB0aGlzLmlzQWNjZXNzVG9rZW5FeHBpcmVkJC5waXBlKFxuXHRcdG1hcCgoaXNFeHBpcmVkKSA9PiBpc05vdE51bGxpc2goaXNFeHBpcmVkKSAmJiAhaXNFeHBpcmVkKVxuXHQpO1xuXG5cdHB1YmxpYyByZWFkb25seSBpc1JlZnJlc2hUb2tlblZhbGlkJCA9IHRoaXMuaXNSZWZyZXNoVG9rZW5FeHBpcmVkJC5waXBlKFxuXHRcdG1hcCgoaXNFeHBpcmVkKSA9PiBpc05vdE51bGxpc2goaXNFeHBpcmVkKSAmJiAhaXNFeHBpcmVkKVxuXHQpO1xuXG5cdHB1YmxpYyBjb25zdHJ1Y3Rvcihcblx0XHRwcml2YXRlIHJlYWRvbmx5IGh0dHBIYW5kbGVyOiBIdHRwSGFuZGxlcixcblx0XHRwcml2YXRlIHJlYWRvbmx5IGp3dFJlZnJlc2hTdGF0ZVNlcnZpY2U6IEp3dFJlZnJlc2hTdGF0ZVNlcnZpY2UsXG5cdFx0QEluamVjdChKV1RfQ09ORklHVVJBVElPTl9UT0tFTilcblx0XHRwcml2YXRlIHJlYWRvbmx5IHJhd0NvbmZpZzogSnd0Q29uZmlndXJhdGlvbixcblx0XHRASW5qZWN0KERFRkFVTFRfSldUX0NPTkZJR1VSQVRJT05fVE9LRU4pXG5cdFx0cHJpdmF0ZSByZWFkb25seSByYXdEZWZhdWx0Q29uZmlnOiBKd3RDb25maWd1cmF0aW9uLFxuXHRcdEBJbmplY3QoREVGQVVMVF9KV1RfUkVGUkVTSF9DT05GSUdVUkFUSU9OX1RPS0VOKVxuXHRcdEBPcHRpb25hbCgpXG5cdFx0cHJpdmF0ZSByZWFkb25seSByYXdEZWZhdWx0UmVmcmVzaENvbmZpZz86IEp3dFJlZnJlc2hDb25maWd1cmF0aW9uPFxuXHRcdFx0UmVmcmVzaFJlcXVlc3QsXG5cdFx0XHRSZWZyZXNoUmVzcG9uc2Vcblx0XHQ+LFxuXHRcdEBJbmplY3QoSldUX1JFRlJFU0hfQ09ORklHVVJBVElPTl9UT0tFTilcblx0XHRAT3B0aW9uYWwoKVxuXHRcdHByaXZhdGUgcmVhZG9ubHkgcmF3UmVmcmVzaENvbmZpZz86IEp3dFJlZnJlc2hDb25maWd1cmF0aW9uPFxuXHRcdFx0UmVmcmVzaFJlcXVlc3QsXG5cdFx0XHRSZWZyZXNoUmVzcG9uc2Vcblx0XHQ+LFxuXHRcdEBPcHRpb25hbCgpIHByaXZhdGUgcmVhZG9ubHkgcm91dGVyPzogUm91dGVyXG5cdCkge31cblxuXHQvKipcblx0ICogRG9lcyBhIHRva2VuIHJlZnJlc2guIEVtaXRzIGZhbHNlIGlmIGl0IGZhaWxlZCwgb3IgdHJ1ZSBpZiBzdWNjZWVkZWQuXG5cdCAqL1xuXHRwdWJsaWMgbWFudWFsUmVmcmVzaCgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcblx0XHRpZiAodGhpcy5yZWZyZXNoQ29uZmlnKSB7XG5cdFx0XHRyZXR1cm4gdHJ5Snd0UmVmcmVzaChcblx0XHRcdFx0dGhpcy5odHRwSGFuZGxlcixcblx0XHRcdFx0J0FjY2VzcyB0b2tlbiBub3QgdmFsaWQgb24gZ3VhcmQgYWN0aXZhdGlvbicsXG5cdFx0XHRcdHRoaXMucmVmcmVzaENvbmZpZyxcblx0XHRcdFx0dGhpcy5qd3RSZWZyZXNoU3RhdGVTZXJ2aWNlLnJlZnJlc2hMb2NrJCxcblx0XHRcdFx0KHJlZnJlc2hFcnJvcikgPT5cblx0XHRcdFx0XHRoYW5kbGVKd3RFcnJvcjxSZWZyZXNoUmVxdWVzdCwgUmVmcmVzaFJlc3BvbnNlPihcblx0XHRcdFx0XHRcdEp3dENvdWxkbnRSZWZyZXNoRXJyb3IuY3JlYXRlRXJyb3JSZXNwb25zZSh1bmRlZmluZWQsIHJlZnJlc2hFcnJvciksXG5cdFx0XHRcdFx0XHR0aGlzLmNvbmZpZyxcblx0XHRcdFx0XHRcdHRoaXMucmVmcmVzaENvbmZpZyxcblx0XHRcdFx0XHRcdHRoaXMucm91dGVyXG5cdFx0XHRcdFx0KS5waXBlKGNhdGNoRXJyb3IoKCkgPT4gb2YoZmFsc2UpKSksXG5cdFx0XHRcdCgpID0+IG9mKHRydWUpXG5cdFx0XHQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4gb2YoZmFsc2UpO1xuXHRcdH1cblx0fVxufVxuIl19