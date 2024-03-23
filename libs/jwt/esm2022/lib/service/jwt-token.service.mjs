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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.1", ngImport: i0, type: JwtTokenService, deps: [{ token: i1.HttpHandler }, { token: i2.JwtRefreshStateService }, { token: JWT_CONFIGURATION_TOKEN }, { token: DEFAULT_JWT_CONFIGURATION_TOKEN }, { token: DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN, optional: true }, { token: JWT_REFRESH_CONFIGURATION_TOKEN, optional: true }, { token: i3.Router, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.1", ngImport: i0, type: JwtTokenService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.1", ngImport: i0, type: JwtTokenService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [{ type: i1.HttpHandler }, { type: i2.JwtRefreshStateService }, { type: undefined, decorators: [{
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
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0LXRva2VuLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9saWJzL2p3dC9zcmMvbGliL3NlcnZpY2Uvand0LXRva2VuLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ25ELE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDekMsT0FBTyxFQUFjLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN0QyxPQUFPLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM1RCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNuRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDdkUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUNwRSxPQUFPLEVBQUUsb0NBQW9DLEVBQUUsTUFBTSxtRUFBbUUsQ0FBQztBQUN6SCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDeEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBS3JFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNwRCxPQUFPLEVBQ04sK0JBQStCLEVBQy9CLHVDQUF1QyxFQUN2Qyx1QkFBdUIsRUFDdkIsK0JBQStCLEdBQy9CLE1BQU0sa0NBQWtDLENBQUM7QUFDMUMsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7Ozs7O0FBS3JFLE1B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O0lBc0JDLENBQUM7SUFFSjs7T0FFRztJQUNJLGFBQWE7UUFDbkIsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDeEIsT0FBTyxhQUFhLENBQ25CLElBQUksQ0FBQyxXQUFXLEVBQ2hCLDRDQUE0QyxFQUM1QyxJQUFJLENBQUMsYUFBYSxFQUNsQixJQUFJLENBQUMsc0JBQXNCLENBQUMsWUFBWSxFQUN4QyxDQUFDLFlBQVksRUFBRSxFQUFFLENBQ2hCLGNBQWMsQ0FDYixzQkFBc0IsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLEVBQ25FLElBQUksQ0FBQyxNQUFNLEVBQ1gsSUFBSSxDQUFDLGFBQWEsRUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FDWCxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFDcEMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUNkLENBQUM7UUFDSCxDQUFDO2FBQU0sQ0FBQztZQUNQLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xCLENBQUM7SUFDRixDQUFDOzhHQTFJVyxlQUFlLG1GQWlHbEIsdUJBQXVCLGFBRXZCLCtCQUErQixhQUUvQix1Q0FBdUMsNkJBTXZDLCtCQUErQjtrSEEzRzVCLGVBQWUsY0FGZixNQUFNOzsyRkFFTixlQUFlO2tCQUgzQixVQUFVO21CQUFDO29CQUNYLFVBQVUsRUFBRSxNQUFNO2lCQUNsQjs7MEJBa0dFLE1BQU07MkJBQUMsdUJBQXVCOzswQkFFOUIsTUFBTTsyQkFBQywrQkFBK0I7OzBCQUV0QyxNQUFNOzJCQUFDLHVDQUF1Qzs7MEJBQzlDLFFBQVE7OzBCQUtSLE1BQU07MkJBQUMsK0JBQStCOzswQkFDdEMsUUFBUTs7MEJBS1IsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBIYW5kbGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE9ic2VydmFibGUsIG9mIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjYXRjaEVycm9yLCBtYXAsIHN3aXRjaE1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEp3dENvdWxkbnRSZWZyZXNoRXJyb3IgfSBmcm9tICcuLi9lcnJvcnMvand0LWVycm9yLmNsYXNzJztcbmltcG9ydCB7IGhhbmRsZUp3dEVycm9yIH0gZnJvbSAnLi4vZnVuY3Rpb24vaGFuZGxlLWp3dC1lcnJvci5mdW5jdGlvbic7XG5pbXBvcnQgeyBpbnRvT2JzZXJ2YWJsZSB9IGZyb20gJy4uL2Z1bmN0aW9uL2ludG8tb2JzZXJ2YWJsZS5mdW5jdGlvbic7XG5pbXBvcnQgeyBpc05vdE51bGxpc2ggfSBmcm9tICcuLi9mdW5jdGlvbi9pcy1ub3QtbnVsbGlzaC5wcmVkaWNhdGUnO1xuaW1wb3J0IHsgaXNVbml4VGltZXN0YW1wRXhwaXJlZE5vd0FuZFdoZW5JdElzIH0gZnJvbSAnLi4vZnVuY3Rpb24vaXMtdW5peC10aW1lc3RhbXAtZXhwaXJlZC1ub3ctYW5kLXdoZW4taXQtaXMuZnVuY3Rpb24nO1xuaW1wb3J0IHsgaXNTdHJpbmcgfSBmcm9tICcuLi9mdW5jdGlvbi9zdHJpbmcucHJlZGljYXRlJztcbmltcG9ydCB7IHRyeUp3dFJlZnJlc2ggfSBmcm9tICcuLi9mdW5jdGlvbi90cnktand0LXJlZnJlc2guZnVuY3Rpb24nO1xuaW1wb3J0IHtcblx0Snd0Q29uZmlndXJhdGlvbixcblx0Snd0UmVmcmVzaENvbmZpZ3VyYXRpb24sXG59IGZyb20gJy4uL21vZGVsL2F1dGgtY29yZS1jb25maWd1cmF0aW9uLmludGVyZmFjZSc7XG5pbXBvcnQgeyBKd3RUb2tlbiB9IGZyb20gJy4uL21vZGVsL2p3dC10b2tlbi5jbGFzcyc7XG5pbXBvcnQge1xuXHRERUZBVUxUX0pXVF9DT05GSUdVUkFUSU9OX1RPS0VOLFxuXHRERUZBVUxUX0pXVF9SRUZSRVNIX0NPTkZJR1VSQVRJT05fVE9LRU4sXG5cdEpXVF9DT05GSUdVUkFUSU9OX1RPS0VOLFxuXHRKV1RfUkVGUkVTSF9DT05GSUdVUkFUSU9OX1RPS0VOLFxufSBmcm9tICcuLi90b2tlbi9qd3QtY29uZmlndXJhdGlvbi50b2tlbic7XG5pbXBvcnQgeyBKd3RSZWZyZXNoU3RhdGVTZXJ2aWNlIH0gZnJvbSAnLi9qd3QtcmVmcmVzaC1zdGF0ZS5zZXJ2aWNlJztcblxuQEluamVjdGFibGUoe1xuXHRwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIEp3dFRva2VuU2VydmljZTxcblx0Q2xhaW1zID0gUmVjb3JkPHN0cmluZyB8IG51bWJlciwgdW5rbm93bj4sXG5cdFJlZnJlc2hDbGFpbXMgPSBSZWNvcmQ8c3RyaW5nIHwgbnVtYmVyLCB1bmtub3duPixcblx0UmVmcmVzaFJlcXVlc3QgPSBSZWNvcmQ8c3RyaW5nIHwgbnVtYmVyLCB1bmtub3duPixcblx0UmVmcmVzaFJlc3BvbnNlID0gUmVjb3JkPHN0cmluZyB8IG51bWJlciwgdW5rbm93bj4sXG4+IHtcblx0cHVibGljIHJlYWRvbmx5IGNvbmZpZzogSnd0Q29uZmlndXJhdGlvbiA9IHtcblx0XHQuLi50aGlzLnJhd0RlZmF1bHRDb25maWcsXG5cdFx0Li4udGhpcy5yYXdDb25maWcsXG5cdH07XG5cblx0cHVibGljIHJlYWRvbmx5IHJlZnJlc2hDb25maWc/OiBKd3RSZWZyZXNoQ29uZmlndXJhdGlvbjxSZWZyZXNoUmVxdWVzdCwgUmVmcmVzaFJlc3BvbnNlPiA9XG5cdFx0dGhpcy5yYXdEZWZhdWx0UmVmcmVzaENvbmZpZyAmJiB0aGlzLnJhd1JlZnJlc2hDb25maWdcblx0XHRcdD8ge1xuXHRcdFx0XHRcdC4uLnRoaXMucmF3RGVmYXVsdFJlZnJlc2hDb25maWcsXG5cdFx0XHRcdFx0Li4udGhpcy5yYXdSZWZyZXNoQ29uZmlnLFxuXHRcdFx0XHR9XG5cdFx0XHQ6IHVuZGVmaW5lZDtcblxuXHQvKipcblx0ICogQ29uc2lkZXIgcmVzdHJpY3RpbmcgZ2V0VG9rZW4gdG8gb2JzZXJ2YWJsZXMgb25seSBzbyB0aGluZ3MgY2FuIGJlIGNhY2hlZFxuXHQgKi9cblx0cHVibGljIHJlYWRvbmx5IHJhd0FjY2Vzc1Rva2VuJCA9IGludG9PYnNlcnZhYmxlKHRoaXMuY29uZmlnLmdldFRva2VuKTtcblxuXHRwdWJsaWMgcmVhZG9ubHkgcmF3UmVmcmVzaFRva2VuJCA9IHRoaXMucmVmcmVzaENvbmZpZz8uZ2V0UmVmcmVzaFRva2VuXG5cdFx0PyBpbnRvT2JzZXJ2YWJsZSh0aGlzLnJlZnJlc2hDb25maWcuZ2V0UmVmcmVzaFRva2VuKVxuXHRcdDogb2YobnVsbCk7XG5cblx0cHVibGljIHJlYWRvbmx5IGFjY2Vzc1Rva2VuJCA9IHRoaXMucmF3QWNjZXNzVG9rZW4kLnBpcGUoXG5cdFx0bWFwKCh0b2tlbikgPT4ge1xuXHRcdFx0aWYgKGlzU3RyaW5nKHRva2VuKSkge1xuXHRcdFx0XHRjb25zdCBqd3RUb2tlbiA9IEp3dFRva2VuLmZyb208Q2xhaW1zPih0b2tlbik7XG5cdFx0XHRcdGlmICghand0VG9rZW4pIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ05vbi12YWxpZCB0b2tlbiBvYnNlcnZlZCcpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBqd3RUb2tlbjtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cdFx0fSksXG5cdCk7XG5cblx0cHVibGljIHJlYWRvbmx5IHJlZnJlc2hUb2tlbiQgPSB0aGlzLnJhd1JlZnJlc2hUb2tlbiQucGlwZShcblx0XHRtYXAoKHJlZnJlc2hUb2tlbikgPT4ge1xuXHRcdFx0aWYgKGlzU3RyaW5nKHJlZnJlc2hUb2tlbikpIHtcblx0XHRcdFx0Y29uc3Qgand0VG9rZW4gPSBKd3RUb2tlbi5mcm9tPFJlZnJlc2hDbGFpbXM+KHJlZnJlc2hUb2tlbik7XG5cdFx0XHRcdGlmICghand0VG9rZW4pIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ05vbi12YWxpZCB0b2tlbiBvYnNlcnZlZCcpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBqd3RUb2tlbjtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cdFx0fSksXG5cdCk7XG5cblx0cHVibGljIHJlYWRvbmx5IGFjY2Vzc1Rva2VuSGVhZGVyJCA9IHRoaXMuYWNjZXNzVG9rZW4kLnBpcGUoXG5cdFx0bWFwKCh0b2tlbikgPT4gdG9rZW4/LmhlYWRlciA/PyBudWxsKSxcblx0KTtcblxuXHRwdWJsaWMgcmVhZG9ubHkgYWNjZXNzVG9rZW5QYXlsb2FkJCA9IHRoaXMuYWNjZXNzVG9rZW4kLnBpcGUoXG5cdFx0bWFwKCh0b2tlbikgPT4gdG9rZW4/LnBheWxvYWQgPz8gbnVsbCksXG5cdCk7XG5cblx0cHVibGljIHJlYWRvbmx5IHJlZnJlc2hUb2tlbkhlYWRlciQgPSB0aGlzLnJlZnJlc2hUb2tlbiQucGlwZShcblx0XHRtYXAoKHRva2VuKSA9PiB0b2tlbj8uaGVhZGVyID8/IG51bGwpLFxuXHQpO1xuXG5cdHB1YmxpYyByZWFkb25seSByZWZyZXNoVG9rZW5QYXlsb2FkJCA9IHRoaXMucmVmcmVzaFRva2VuJC5waXBlKFxuXHRcdG1hcCgodG9rZW4pID0+IHRva2VuPy5wYXlsb2FkID8/IG51bGwpLFxuXHQpO1xuXG5cdHB1YmxpYyByZWFkb25seSBpc0FjY2Vzc1Rva2VuRXhwaXJlZCQgPSB0aGlzLmFjY2Vzc1Rva2VuJC5waXBlKFxuXHRcdHN3aXRjaE1hcCgodG9rZW4pID0+XG5cdFx0XHR0b2tlbiA/IGlzVW5peFRpbWVzdGFtcEV4cGlyZWROb3dBbmRXaGVuSXRJcyh0b2tlbi5wYXlsb2FkLmV4cCkgOiBvZihudWxsKSxcblx0XHQpLFxuXHQpO1xuXG5cdHB1YmxpYyByZWFkb25seSBpc1JlZnJlc2hUb2tlbkV4cGlyZWQkID0gdGhpcy5yZWZyZXNoVG9rZW4kLnBpcGUoXG5cdFx0c3dpdGNoTWFwKCh0b2tlbikgPT5cblx0XHRcdHRva2VuID8gaXNVbml4VGltZXN0YW1wRXhwaXJlZE5vd0FuZFdoZW5JdElzKHRva2VuLnBheWxvYWQuZXhwKSA6IG9mKG51bGwpLFxuXHRcdCksXG5cdCk7XG5cblx0cHVibGljIHJlYWRvbmx5IGlzQWNjZXNzVG9rZW5WYWxpZCQgPSB0aGlzLmlzQWNjZXNzVG9rZW5FeHBpcmVkJC5waXBlKFxuXHRcdG1hcCgoaXNFeHBpcmVkKSA9PiBpc05vdE51bGxpc2goaXNFeHBpcmVkKSAmJiAhaXNFeHBpcmVkKSxcblx0KTtcblxuXHRwdWJsaWMgcmVhZG9ubHkgaXNSZWZyZXNoVG9rZW5WYWxpZCQgPSB0aGlzLmlzUmVmcmVzaFRva2VuRXhwaXJlZCQucGlwZShcblx0XHRtYXAoKGlzRXhwaXJlZCkgPT4gaXNOb3ROdWxsaXNoKGlzRXhwaXJlZCkgJiYgIWlzRXhwaXJlZCksXG5cdCk7XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKFxuXHRcdHByaXZhdGUgcmVhZG9ubHkgaHR0cEhhbmRsZXI6IEh0dHBIYW5kbGVyLFxuXHRcdHByaXZhdGUgcmVhZG9ubHkgand0UmVmcmVzaFN0YXRlU2VydmljZTogSnd0UmVmcmVzaFN0YXRlU2VydmljZSxcblx0XHRASW5qZWN0KEpXVF9DT05GSUdVUkFUSU9OX1RPS0VOKVxuXHRcdHByaXZhdGUgcmVhZG9ubHkgcmF3Q29uZmlnOiBKd3RDb25maWd1cmF0aW9uLFxuXHRcdEBJbmplY3QoREVGQVVMVF9KV1RfQ09ORklHVVJBVElPTl9UT0tFTilcblx0XHRwcml2YXRlIHJlYWRvbmx5IHJhd0RlZmF1bHRDb25maWc6IEp3dENvbmZpZ3VyYXRpb24sXG5cdFx0QEluamVjdChERUZBVUxUX0pXVF9SRUZSRVNIX0NPTkZJR1VSQVRJT05fVE9LRU4pXG5cdFx0QE9wdGlvbmFsKClcblx0XHRwcml2YXRlIHJlYWRvbmx5IHJhd0RlZmF1bHRSZWZyZXNoQ29uZmlnPzogSnd0UmVmcmVzaENvbmZpZ3VyYXRpb248XG5cdFx0XHRSZWZyZXNoUmVxdWVzdCxcblx0XHRcdFJlZnJlc2hSZXNwb25zZVxuXHRcdD4sXG5cdFx0QEluamVjdChKV1RfUkVGUkVTSF9DT05GSUdVUkFUSU9OX1RPS0VOKVxuXHRcdEBPcHRpb25hbCgpXG5cdFx0cHJpdmF0ZSByZWFkb25seSByYXdSZWZyZXNoQ29uZmlnPzogSnd0UmVmcmVzaENvbmZpZ3VyYXRpb248XG5cdFx0XHRSZWZyZXNoUmVxdWVzdCxcblx0XHRcdFJlZnJlc2hSZXNwb25zZVxuXHRcdD4sXG5cdFx0QE9wdGlvbmFsKCkgcHJpdmF0ZSByZWFkb25seSByb3V0ZXI/OiBSb3V0ZXIsXG5cdCkge31cblxuXHQvKipcblx0ICogRG9lcyBhIHRva2VuIHJlZnJlc2guIEVtaXRzIGZhbHNlIGlmIGl0IGZhaWxlZCwgb3IgdHJ1ZSBpZiBzdWNjZWVkZWQuXG5cdCAqL1xuXHRwdWJsaWMgbWFudWFsUmVmcmVzaCgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcblx0XHRpZiAodGhpcy5yZWZyZXNoQ29uZmlnKSB7XG5cdFx0XHRyZXR1cm4gdHJ5Snd0UmVmcmVzaChcblx0XHRcdFx0dGhpcy5odHRwSGFuZGxlcixcblx0XHRcdFx0J0FjY2VzcyB0b2tlbiBub3QgdmFsaWQgb24gZ3VhcmQgYWN0aXZhdGlvbicsXG5cdFx0XHRcdHRoaXMucmVmcmVzaENvbmZpZyxcblx0XHRcdFx0dGhpcy5qd3RSZWZyZXNoU3RhdGVTZXJ2aWNlLnJlZnJlc2hMb2NrJCxcblx0XHRcdFx0KHJlZnJlc2hFcnJvcikgPT5cblx0XHRcdFx0XHRoYW5kbGVKd3RFcnJvcjxSZWZyZXNoUmVxdWVzdCwgUmVmcmVzaFJlc3BvbnNlPihcblx0XHRcdFx0XHRcdEp3dENvdWxkbnRSZWZyZXNoRXJyb3IuY3JlYXRlRXJyb3JSZXNwb25zZSh1bmRlZmluZWQsIHJlZnJlc2hFcnJvciksXG5cdFx0XHRcdFx0XHR0aGlzLmNvbmZpZyxcblx0XHRcdFx0XHRcdHRoaXMucmVmcmVzaENvbmZpZyxcblx0XHRcdFx0XHRcdHRoaXMucm91dGVyLFxuXHRcdFx0XHRcdCkucGlwZShjYXRjaEVycm9yKCgpID0+IG9mKGZhbHNlKSkpLFxuXHRcdFx0XHQoKSA9PiBvZih0cnVlKSxcblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBvZihmYWxzZSk7XG5cdFx0fVxuXHR9XG59XG4iXX0=