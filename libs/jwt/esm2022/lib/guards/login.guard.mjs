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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: LoginGuard, deps: [{ token: i1.JwtTokenService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: LoginGuard, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.2.12", ngImport: i0, type: LoginGuard, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1.JwtTokenService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4uZ3VhcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9saWJzL2p3dC9zcmMvbGliL2d1YXJkcy9sb2dpbi5ndWFyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBUTNDLE9BQU8sRUFBYyxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsZ0RBQWdELEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUM5RyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sOEJBQThCLENBQUM7OztBQWdCL0QsTUFBTSxPQUFPLFVBQVU7SUFHdEIsWUFBb0MsZUFBZ0M7UUFBaEMsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBRjVELDRCQUF1QixHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRWxCLENBQUM7SUFFakUsV0FBVyxDQUNqQixLQUE2QixFQUM3QixNQUEyQjtRQUUzQixNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsSUFBa0MsQ0FBQztRQUN0RCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVNLGdCQUFnQixDQUN0QixVQUFrQyxFQUNsQyxNQUEyQjtRQUUzQixNQUFNLElBQUksR0FBRyxVQUFVLENBQUMsSUFBa0MsQ0FBQztRQUMzRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVNLE9BQU8sQ0FDYixLQUFZLEVBQ1osU0FBdUI7UUFFdkIsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQWtDLENBQUM7UUFDdEQsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFTyxPQUFPLENBQUMsZ0JBQXFDO1FBQ3BELE1BQU0sT0FBTyxHQUNaLGdCQUFnQjtZQUNoQixJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSx5Q0FBeUM7WUFDN0UsZ0RBQWdELENBQUM7UUFDbEQsT0FBTyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUN2QyxTQUFTLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUNyQixJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sRUFBRTtnQkFDeEIsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDO2FBQzVDO2lCQUFNO2dCQUNOLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQ25CO1FBQ0YsQ0FBQyxDQUFDLENBQ0YsQ0FBQztJQUNILENBQUM7K0dBM0NXLFVBQVU7bUhBQVYsVUFBVSxjQUZWLE1BQU07OzRGQUVOLFVBQVU7a0JBSHRCLFVBQVU7bUJBQUM7b0JBQ1gsVUFBVSxFQUFFLE1BQU07aUJBQ2xCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcblx0QWN0aXZhdGVkUm91dGVTbmFwc2hvdCxcblx0Um91dGUsXG5cdFJvdXRlclN0YXRlU25hcHNob3QsXG5cdFVybFNlZ21lbnQsXG5cdFVybFRyZWUsXG59IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc3dpdGNoTWFwLCB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgREVGQVVMVF9KV1RfUkVGUkVTSF9DT05GSUdfREVGQVVMVF9BVVRPX0lOX0dVQVJEIH0gZnJvbSAnLi4vbW9kZWwvYXV0aC1jb3JlLWNvbmZpZ3VyYXRpb24uaW50ZXJmYWNlJztcbmltcG9ydCB7IEp3dFRva2VuU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2Uvand0LXRva2VuLnNlcnZpY2UnO1xuXG4vKipcbiAqIFRoaXMgaW50ZXJmYWNlIGlzIGZvciB5b3VyIGNvbnZpbmllbmNlIHRvIHVzZSB3aXRoIFJvdXRlIGRhdGEgdG8gc2VlIHdoYXRcbiAqIHlvdSBjYW4gY29uZmlndXJlIG9uIHRoZSBMb2dpbkd1YXJkXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTG9naW5HdWFyZERhdGEge1xuXHQvKipcblx0ICogRXhwbGljaXRseSBlbmFibGUgb3IgZGlzYWJsZSBhdXRvIHJlZnJlc2hpbmcgb24gdGhlIHJvdXRlLlxuXHQgKi9cblx0aXNSZWZyZXNoQWxsb3dlZDogYm9vbGVhbjtcbn1cblxuQEluamVjdGFibGUoe1xuXHRwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIExvZ2luR3VhcmQge1xuXHRwcml2YXRlIGlzQWNjZXNzVG9rZW5WYWxpZE9uY2UkID0gdGhpcy5qd3RUb2tlblNlcnZpY2UuaXNBY2Nlc3NUb2tlblZhbGlkJC5waXBlKHRha2UoMSkpO1xuXG5cdHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGp3dFRva2VuU2VydmljZTogSnd0VG9rZW5TZXJ2aWNlKSB7fVxuXG5cdHB1YmxpYyBjYW5BY3RpdmF0ZShcblx0XHRyb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCxcblx0XHRfc3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3Rcblx0KTogT2JzZXJ2YWJsZTxib29sZWFuIHwgVXJsVHJlZT4gfCBQcm9taXNlPGJvb2xlYW4gfCBVcmxUcmVlPiB8IGJvb2xlYW4gfCBVcmxUcmVlIHtcblx0XHRjb25zdCBkYXRhID0gcm91dGUuZGF0YSBhcyBMb2dpbkd1YXJkRGF0YSB8IHVuZGVmaW5lZDtcblx0XHRyZXR1cm4gdGhpcy5pc1ZhbGlkKGRhdGE/LmlzUmVmcmVzaEFsbG93ZWQpO1xuXHR9XG5cblx0cHVibGljIGNhbkFjdGl2YXRlQ2hpbGQoXG5cdFx0Y2hpbGRSb3V0ZTogQWN0aXZhdGVkUm91dGVTbmFwc2hvdCxcblx0XHRfc3RhdGU6IFJvdXRlclN0YXRlU25hcHNob3Rcblx0KTogT2JzZXJ2YWJsZTxib29sZWFuIHwgVXJsVHJlZT4gfCBQcm9taXNlPGJvb2xlYW4gfCBVcmxUcmVlPiB8IGJvb2xlYW4gfCBVcmxUcmVlIHtcblx0XHRjb25zdCBkYXRhID0gY2hpbGRSb3V0ZS5kYXRhIGFzIExvZ2luR3VhcmREYXRhIHwgdW5kZWZpbmVkO1xuXHRcdHJldHVybiB0aGlzLmlzVmFsaWQoZGF0YT8uaXNSZWZyZXNoQWxsb3dlZCk7XG5cdH1cblxuXHRwdWJsaWMgY2FuTG9hZChcblx0XHRyb3V0ZTogUm91dGUsXG5cdFx0X3NlZ21lbnRzOiBVcmxTZWdtZW50W11cblx0KTogT2JzZXJ2YWJsZTxib29sZWFuPiB8IFByb21pc2U8Ym9vbGVhbj4gfCBib29sZWFuIHtcblx0XHRjb25zdCBkYXRhID0gcm91dGUuZGF0YSBhcyBMb2dpbkd1YXJkRGF0YSB8IHVuZGVmaW5lZDtcblx0XHRyZXR1cm4gdGhpcy5pc1ZhbGlkKGRhdGE/LmlzUmVmcmVzaEFsbG93ZWQpO1xuXHR9XG5cblx0cHJpdmF0ZSBpc1ZhbGlkKGlzUmVmcmVzaEFsbG93ZWQ6IGJvb2xlYW4gfCB1bmRlZmluZWQpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcblx0XHRjb25zdCBhbGxvd2VkID1cblx0XHRcdGlzUmVmcmVzaEFsbG93ZWQgPz9cblx0XHRcdHRoaXMuand0VG9rZW5TZXJ2aWNlLnJlZnJlc2hDb25maWc/LmlzQXV0b1JlZnJlc2hBbGxvd2VkSW5Mb2dpbkd1YXJkQnlEZWZhdWx0ID8/XG5cdFx0XHRERUZBVUxUX0pXVF9SRUZSRVNIX0NPTkZJR19ERUZBVUxUX0FVVE9fSU5fR1VBUkQ7XG5cdFx0cmV0dXJuIHRoaXMuaXNBY2Nlc3NUb2tlblZhbGlkT25jZSQucGlwZShcblx0XHRcdHN3aXRjaE1hcCgoaXNWYWxpZCkgPT4ge1xuXHRcdFx0XHRpZiAoIWlzVmFsaWQgJiYgYWxsb3dlZCkge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLmp3dFRva2VuU2VydmljZS5tYW51YWxSZWZyZXNoKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0cmV0dXJuIG9mKGlzVmFsaWQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdCk7XG5cdH1cbn1cbiJdfQ==