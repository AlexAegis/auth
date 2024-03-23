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
    canActivate(route, _state) {
        const data = route.data;
        return this.isValid(data?.isRefreshAllowed);
    }
    canActivateChild(childRoute, _state) {
        const data = childRoute.data;
        return this.isValid(data?.isRefreshAllowed);
    }
    canLoad(route, _segments) {
        const data = route.data;
        return this.isValid(data?.isRefreshAllowed);
    }
    isValid(isRefreshAllowed) {
        const allowed = isRefreshAllowed ??
            this.jwtTokenService.refreshConfig?.isAutoRefreshAllowedInLoginGuardByDefault ??
            DEFAULT_JWT_REFRESH_CONFIG_DEFAULT_AUTO_IN_GUARD;
        return this.isAccessTokenValidOnce$.pipe(switchMap((isValid) => {
            if (!isValid && allowed) {
                return this.jwtTokenService.manualRefresh();
            }
            else {
                return of(isValid);
            }
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.1", ngImport: i0, type: LoginGuard, deps: [{ token: i1.JwtTokenService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.1", ngImport: i0, type: LoginGuard, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.1", ngImport: i0, type: LoginGuard, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [{ type: i1.JwtTokenService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uZ3VhcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9saWJzL2p3dC9zcmMvbGliL2d1YXJkcy9sb2dpbi5ndWFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBUTNDLE9BQU8sRUFBYyxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsZ0RBQWdELEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUM5RyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sOEJBQThCLENBQUM7OztBQWdCL0QsTUFBTSxPQUFPLFVBQVU7SUFHdEIsWUFBb0MsZUFBZ0M7UUFBaEMsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBRjVELDRCQUF1QixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWxCLENBQUM7SUFFakUsV0FBVyxDQUNqQixLQUE2QixFQUM3QixNQUEyQjtRQUUzQixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBa0MsQ0FBQztRQUN0RCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVNLGdCQUFnQixDQUN0QixVQUFrQyxFQUNsQyxNQUEyQjtRQUUzQixNQUFNLElBQUksR0FBRyxVQUFVLENBQUMsSUFBa0MsQ0FBQztRQUMzRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVNLE9BQU8sQ0FDYixLQUFZLEVBQ1osU0FBdUI7UUFFdkIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQWtDLENBQUM7UUFDdEQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFTyxPQUFPLENBQUMsZ0JBQXFDO1FBQ3BELE1BQU0sT0FBTyxHQUNaLGdCQUFnQjtZQUNoQixJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSx5Q0FBeUM7WUFDN0UsZ0RBQWdELENBQUM7UUFDbEQsT0FBTyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUN2QyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUNyQixJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sRUFBRSxDQUFDO2dCQUN6QixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDN0MsQ0FBQztpQkFBTSxDQUFDO2dCQUNQLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3BCLENBQUM7UUFDRixDQUFDLENBQUMsQ0FDRixDQUFDO0lBQ0gsQ0FBQzs4R0EzQ1csVUFBVTtrSEFBVixVQUFVLGNBRlYsTUFBTTs7MkZBRU4sVUFBVTtrQkFIdEIsVUFBVTttQkFBQztvQkFDWCxVQUFVLEVBQUUsTUFBTTtpQkFDbEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuXHRBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LFxuXHRSb3V0ZSxcblx0Um91dGVyU3RhdGVTbmFwc2hvdCxcblx0VXJsU2VnbWVudCxcblx0VXJsVHJlZSxcbn0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE9ic2VydmFibGUsIG9mIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBzd2l0Y2hNYXAsIHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBERUZBVUxUX0pXVF9SRUZSRVNIX0NPTkZJR19ERUZBVUxUX0FVVE9fSU5fR1VBUkQgfSBmcm9tICcuLi9tb2RlbC9hdXRoLWNvcmUtY29uZmlndXJhdGlvbi5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSnd0VG9rZW5TZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZS9qd3QtdG9rZW4uc2VydmljZSc7XG5cbi8qKlxuICogVGhpcyBpbnRlcmZhY2UgaXMgZm9yIHlvdXIgY29udmluaWVuY2UgdG8gdXNlIHdpdGggUm91dGUgZGF0YSB0byBzZWUgd2hhdFxuICogeW91IGNhbiBjb25maWd1cmUgb24gdGhlIExvZ2luR3VhcmRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMb2dpbkd1YXJkRGF0YSB7XG5cdC8qKlxuXHQgKiBFeHBsaWNpdGx5IGVuYWJsZSBvciBkaXNhYmxlIGF1dG8gcmVmcmVzaGluZyBvbiB0aGUgcm91dGUuXG5cdCAqL1xuXHRpc1JlZnJlc2hBbGxvd2VkOiBib29sZWFuO1xufVxuXG5ASW5qZWN0YWJsZSh7XG5cdHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgTG9naW5HdWFyZCB7XG5cdHByaXZhdGUgaXNBY2Nlc3NUb2tlblZhbGlkT25jZSQgPSB0aGlzLmp3dFRva2VuU2VydmljZS5pc0FjY2Vzc1Rva2VuVmFsaWQkLnBpcGUodGFrZSgxKSk7XG5cblx0cHVibGljIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgand0VG9rZW5TZXJ2aWNlOiBKd3RUb2tlblNlcnZpY2UpIHt9XG5cblx0cHVibGljIGNhbkFjdGl2YXRlKFxuXHRcdHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZVNuYXBzaG90LFxuXHRcdF9zdGF0ZTogUm91dGVyU3RhdGVTbmFwc2hvdCxcblx0KTogT2JzZXJ2YWJsZTxib29sZWFuIHwgVXJsVHJlZT4gfCBQcm9taXNlPGJvb2xlYW4gfCBVcmxUcmVlPiB8IGJvb2xlYW4gfCBVcmxUcmVlIHtcblx0XHRjb25zdCBkYXRhID0gcm91dGUuZGF0YSBhcyBMb2dpbkd1YXJkRGF0YSB8IHVuZGVmaW5lZDtcblx0XHRyZXR1cm4gdGhpcy5pc1ZhbGlkKGRhdGE/LmlzUmVmcmVzaEFsbG93ZWQpO1xuXHR9XG5cblx0cHVibGljIGNhbkFjdGl2YXRlQ2hpbGQoXG5cdFx0Y2hpbGRSb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCxcblx0XHRfc3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3QsXG5cdCk6IE9ic2VydmFibGU8Ym9vbGVhbiB8IFVybFRyZWU+IHwgUHJvbWlzZTxib29sZWFuIHwgVXJsVHJlZT4gfCBib29sZWFuIHwgVXJsVHJlZSB7XG5cdFx0Y29uc3QgZGF0YSA9IGNoaWxkUm91dGUuZGF0YSBhcyBMb2dpbkd1YXJkRGF0YSB8IHVuZGVmaW5lZDtcblx0XHRyZXR1cm4gdGhpcy5pc1ZhbGlkKGRhdGE/LmlzUmVmcmVzaEFsbG93ZWQpO1xuXHR9XG5cblx0cHVibGljIGNhbkxvYWQoXG5cdFx0cm91dGU6IFJvdXRlLFxuXHRcdF9zZWdtZW50czogVXJsU2VnbWVudFtdLFxuXHQpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHwgUHJvbWlzZTxib29sZWFuPiB8IGJvb2xlYW4ge1xuXHRcdGNvbnN0IGRhdGEgPSByb3V0ZS5kYXRhIGFzIExvZ2luR3VhcmREYXRhIHwgdW5kZWZpbmVkO1xuXHRcdHJldHVybiB0aGlzLmlzVmFsaWQoZGF0YT8uaXNSZWZyZXNoQWxsb3dlZCk7XG5cdH1cblxuXHRwcml2YXRlIGlzVmFsaWQoaXNSZWZyZXNoQWxsb3dlZDogYm9vbGVhbiB8IHVuZGVmaW5lZCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuXHRcdGNvbnN0IGFsbG93ZWQgPVxuXHRcdFx0aXNSZWZyZXNoQWxsb3dlZCA/P1xuXHRcdFx0dGhpcy5qd3RUb2tlblNlcnZpY2UucmVmcmVzaENvbmZpZz8uaXNBdXRvUmVmcmVzaEFsbG93ZWRJbkxvZ2luR3VhcmRCeURlZmF1bHQgPz9cblx0XHRcdERFRkFVTFRfSldUX1JFRlJFU0hfQ09ORklHX0RFRkFVTFRfQVVUT19JTl9HVUFSRDtcblx0XHRyZXR1cm4gdGhpcy5pc0FjY2Vzc1Rva2VuVmFsaWRPbmNlJC5waXBlKFxuXHRcdFx0c3dpdGNoTWFwKChpc1ZhbGlkKSA9PiB7XG5cdFx0XHRcdGlmICghaXNWYWxpZCAmJiBhbGxvd2VkKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuand0VG9rZW5TZXJ2aWNlLm1hbnVhbFJlZnJlc2goKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gb2YoaXNWYWxpZCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pLFxuXHRcdCk7XG5cdH1cbn1cbiJdfQ==