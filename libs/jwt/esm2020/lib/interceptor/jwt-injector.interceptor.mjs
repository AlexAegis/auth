import { Inject, Injectable, Optional } from '@angular/core';
import { throwError } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { JwtError } from '../errors/jwt-error.class';
import { checkAgainstUrlFilter } from '../function/check-against-url-filter.function';
import { intoObservable } from '../function/into-observable.function';
import { separateUrl } from '../function/separate-url.function';
import { JwtToken } from '../model/jwt-token.class';
import { DEFAULT_JWT_CONFIGURATION_TOKEN, DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN, JWT_CONFIGURATION_TOKEN, JWT_REFRESH_CONFIGURATION_TOKEN, } from '../token/jwt-configuration.token';
import * as i0 from "@angular/core";
export class JwtInjectorInterceptor {
    constructor(jwtConfig, defaultJwtConfig, refreshConfig, defaultJwtRefreshConfig) {
        this.jwtConfiguration = {
            ...defaultJwtConfig,
            ...jwtConfig,
        };
        this.jwtRefreshConfiguration = refreshConfig &&
            defaultJwtRefreshConfig && {
            ...defaultJwtRefreshConfig,
            ...refreshConfig,
        };
    }
    intercept(request, next) {
        const separatedUrl = separateUrl(request.url);
        return intoObservable(this.jwtConfiguration.getToken).pipe(take(1), switchMap((rawToken) => {
            if (checkAgainstUrlFilter(this.jwtConfiguration, separatedUrl)) {
                const token = rawToken && JwtToken.from(rawToken);
                const isAccessTokenExpiredOrInvalid = !token || token.isExpired();
                // If there is a token to inject
                if (rawToken &&
                    (!isAccessTokenExpiredOrInvalid || this.jwtRefreshConfiguration)) {
                    let cloned = request.clone({
                        headers: request.headers.set(this.jwtConfiguration.header, this.jwtConfiguration.scheme
                            ? this.jwtConfiguration.scheme + rawToken
                            : rawToken),
                    });
                    if (this.jwtConfiguration.handleWithCredentials) {
                        cloned = cloned.clone({
                            withCredentials: true,
                        });
                    }
                    return next.handle(cloned);
                }
                else {
                    return throwError(JwtError.createErrorResponse(request, 'Token is expired or invalid, and refresh is not configured.'));
                }
            }
            else {
                return next.handle(request);
            }
        }));
    }
}
JwtInjectorInterceptor.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: JwtInjectorInterceptor, deps: [{ token: JWT_CONFIGURATION_TOKEN }, { token: DEFAULT_JWT_CONFIGURATION_TOKEN }, { token: JWT_REFRESH_CONFIGURATION_TOKEN, optional: true }, { token: DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
JwtInjectorInterceptor.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: JwtInjectorInterceptor });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.0", ngImport: i0, type: JwtInjectorInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [JWT_CONFIGURATION_TOKEN]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DEFAULT_JWT_CONFIGURATION_TOKEN]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [JWT_REFRESH_CONFIGURATION_TOKEN]
                }] }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0LWluamVjdG9yLmludGVyY2VwdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbGlicy9qd3Qvc3JjL2xpYi9pbnRlcmNlcHRvci9qd3QtaW5qZWN0b3IuaW50ZXJjZXB0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdELE9BQU8sRUFBYyxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDOUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDckQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDdEYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUtoRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDcEQsT0FBTyxFQUNOLCtCQUErQixFQUMvQix1Q0FBdUMsRUFDdkMsdUJBQXVCLEVBQ3ZCLCtCQUErQixHQUMvQixNQUFNLGtDQUFrQyxDQUFDOztBQUcxQyxNQUFNLE9BQU8sc0JBQXNCO0lBSWxDLFlBRUMsU0FBMkIsRUFFM0IsZ0JBQWtDLEVBR2xDLGFBQXlELEVBR3pELHVCQUFtRTtRQUVuRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUc7WUFDdkIsR0FBRyxnQkFBZ0I7WUFDbkIsR0FBRyxTQUFTO1NBQ1osQ0FBQztRQUVGLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxhQUFhO1lBQzNDLHVCQUF1QixJQUFJO1lBQzFCLEdBQUcsdUJBQXVCO1lBQzFCLEdBQUcsYUFBYTtTQUNoQixDQUFDO0lBQ0osQ0FBQztJQUVNLFNBQVMsQ0FDZixPQUE2QixFQUM3QixJQUFpQjtRQUVqQixNQUFNLFlBQVksR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlDLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQ3pELElBQUksQ0FBQyxDQUFDLENBQUMsRUFDUCxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUN0QixJQUFJLHFCQUFxQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxZQUFZLENBQUMsRUFBRTtnQkFDL0QsTUFBTSxLQUFLLEdBQUcsUUFBUSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ2xELE1BQU0sNkJBQTZCLEdBQUcsQ0FBQyxLQUFLLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNsRSxnQ0FBZ0M7Z0JBQ2hDLElBQ0MsUUFBUTtvQkFDUixDQUFDLENBQUMsNkJBQTZCLElBQUksSUFBSSxDQUFDLHVCQUF1QixDQUFDLEVBQy9EO29CQUNELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7d0JBQzFCLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FDM0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFDNUIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU07NEJBQzNCLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLFFBQVE7NEJBQ3pDLENBQUMsQ0FBQyxRQUFRLENBQ1g7cUJBQ0QsQ0FBQyxDQUFDO29CQUNILElBQUksSUFBSSxDQUFDLGdCQUFnQixDQUFDLHFCQUFxQixFQUFFO3dCQUNoRCxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQzs0QkFDckIsZUFBZSxFQUFFLElBQUk7eUJBQ3JCLENBQUMsQ0FBQztxQkFDSDtvQkFDRCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7aUJBQzNCO3FCQUFNO29CQUNOLE9BQU8sVUFBVSxDQUNoQixRQUFRLENBQUMsbUJBQW1CLENBQzNCLE9BQU8sRUFDUCw2REFBNkQsQ0FDN0QsQ0FDRCxDQUFDO2lCQUNGO2FBQ0Q7aUJBQU07Z0JBQ04sT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzVCO1FBQ0YsQ0FBQyxDQUFDLENBQ0YsQ0FBQztJQUNILENBQUM7O21IQXZFVyxzQkFBc0Isa0JBS3pCLHVCQUF1QixhQUV2QiwrQkFBK0IsYUFHL0IsK0JBQStCLDZCQUcvQix1Q0FBdUM7dUhBYnBDLHNCQUFzQjsyRkFBdEIsc0JBQXNCO2tCQURsQyxVQUFVOzswQkFNUixNQUFNOzJCQUFDLHVCQUF1Qjs7MEJBRTlCLE1BQU07MkJBQUMsK0JBQStCOzswQkFFdEMsUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQywrQkFBK0I7OzBCQUV0QyxRQUFROzswQkFDUixNQUFNOzJCQUFDLHVDQUF1QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBFdmVudCwgSHR0cEhhbmRsZXIsIEh0dHBJbnRlcmNlcHRvciwgSHR0cFJlcXVlc3QgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCB0aHJvd0Vycm9yIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBzd2l0Y2hNYXAsIHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBKd3RFcnJvciB9IGZyb20gJy4uL2Vycm9ycy9qd3QtZXJyb3IuY2xhc3MnO1xuaW1wb3J0IHsgY2hlY2tBZ2FpbnN0VXJsRmlsdGVyIH0gZnJvbSAnLi4vZnVuY3Rpb24vY2hlY2stYWdhaW5zdC11cmwtZmlsdGVyLmZ1bmN0aW9uJztcbmltcG9ydCB7IGludG9PYnNlcnZhYmxlIH0gZnJvbSAnLi4vZnVuY3Rpb24vaW50by1vYnNlcnZhYmxlLmZ1bmN0aW9uJztcbmltcG9ydCB7IHNlcGFyYXRlVXJsIH0gZnJvbSAnLi4vZnVuY3Rpb24vc2VwYXJhdGUtdXJsLmZ1bmN0aW9uJztcbmltcG9ydCB7XG5cdEp3dENvbmZpZ3VyYXRpb24sXG5cdEp3dFJlZnJlc2hDb25maWd1cmF0aW9uLFxufSBmcm9tICcuLi9tb2RlbC9hdXRoLWNvcmUtY29uZmlndXJhdGlvbi5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgSnd0VG9rZW4gfSBmcm9tICcuLi9tb2RlbC9qd3QtdG9rZW4uY2xhc3MnO1xuaW1wb3J0IHtcblx0REVGQVVMVF9KV1RfQ09ORklHVVJBVElPTl9UT0tFTixcblx0REVGQVVMVF9KV1RfUkVGUkVTSF9DT05GSUdVUkFUSU9OX1RPS0VOLFxuXHRKV1RfQ09ORklHVVJBVElPTl9UT0tFTixcblx0SldUX1JFRlJFU0hfQ09ORklHVVJBVElPTl9UT0tFTixcbn0gZnJvbSAnLi4vdG9rZW4vand0LWNvbmZpZ3VyYXRpb24udG9rZW4nO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSnd0SW5qZWN0b3JJbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XG5cdHByaXZhdGUgcmVhZG9ubHkgand0Q29uZmlndXJhdGlvbiE6IEp3dENvbmZpZ3VyYXRpb247XG5cdHByaXZhdGUgcmVhZG9ubHkgand0UmVmcmVzaENvbmZpZ3VyYXRpb24/OiBKd3RSZWZyZXNoQ29uZmlndXJhdGlvbjx1bmtub3duLCB1bmtub3duPjtcblxuXHRwdWJsaWMgY29uc3RydWN0b3IoXG5cdFx0QEluamVjdChKV1RfQ09ORklHVVJBVElPTl9UT0tFTilcblx0XHRqd3RDb25maWc6IEp3dENvbmZpZ3VyYXRpb24sXG5cdFx0QEluamVjdChERUZBVUxUX0pXVF9DT05GSUdVUkFUSU9OX1RPS0VOKVxuXHRcdGRlZmF1bHRKd3RDb25maWc6IEp3dENvbmZpZ3VyYXRpb24sXG5cdFx0QE9wdGlvbmFsKClcblx0XHRASW5qZWN0KEpXVF9SRUZSRVNIX0NPTkZJR1VSQVRJT05fVE9LRU4pXG5cdFx0cmVmcmVzaENvbmZpZz86IEp3dFJlZnJlc2hDb25maWd1cmF0aW9uPHVua25vd24sIHVua25vd24+LFxuXHRcdEBPcHRpb25hbCgpXG5cdFx0QEluamVjdChERUZBVUxUX0pXVF9SRUZSRVNIX0NPTkZJR1VSQVRJT05fVE9LRU4pXG5cdFx0ZGVmYXVsdEp3dFJlZnJlc2hDb25maWc/OiBKd3RSZWZyZXNoQ29uZmlndXJhdGlvbjx1bmtub3duLCB1bmtub3duPlxuXHQpIHtcblx0XHR0aGlzLmp3dENvbmZpZ3VyYXRpb24gPSB7XG5cdFx0XHQuLi5kZWZhdWx0Snd0Q29uZmlnLFxuXHRcdFx0Li4uand0Q29uZmlnLFxuXHRcdH07XG5cblx0XHR0aGlzLmp3dFJlZnJlc2hDb25maWd1cmF0aW9uID0gcmVmcmVzaENvbmZpZyAmJlxuXHRcdFx0ZGVmYXVsdEp3dFJlZnJlc2hDb25maWcgJiYge1xuXHRcdFx0XHQuLi5kZWZhdWx0Snd0UmVmcmVzaENvbmZpZyxcblx0XHRcdFx0Li4ucmVmcmVzaENvbmZpZyxcblx0XHRcdH07XG5cdH1cblxuXHRwdWJsaWMgaW50ZXJjZXB0KFxuXHRcdHJlcXVlc3Q6IEh0dHBSZXF1ZXN0PHVua25vd24+LFxuXHRcdG5leHQ6IEh0dHBIYW5kbGVyXG5cdCk6IE9ic2VydmFibGU8SHR0cEV2ZW50PHVua25vd24+PiB7XG5cdFx0Y29uc3Qgc2VwYXJhdGVkVXJsID0gc2VwYXJhdGVVcmwocmVxdWVzdC51cmwpO1xuXHRcdHJldHVybiBpbnRvT2JzZXJ2YWJsZSh0aGlzLmp3dENvbmZpZ3VyYXRpb24uZ2V0VG9rZW4pLnBpcGUoXG5cdFx0XHR0YWtlKDEpLFxuXHRcdFx0c3dpdGNoTWFwKChyYXdUb2tlbikgPT4ge1xuXHRcdFx0XHRpZiAoY2hlY2tBZ2FpbnN0VXJsRmlsdGVyKHRoaXMuand0Q29uZmlndXJhdGlvbiwgc2VwYXJhdGVkVXJsKSkge1xuXHRcdFx0XHRcdGNvbnN0IHRva2VuID0gcmF3VG9rZW4gJiYgSnd0VG9rZW4uZnJvbShyYXdUb2tlbik7XG5cdFx0XHRcdFx0Y29uc3QgaXNBY2Nlc3NUb2tlbkV4cGlyZWRPckludmFsaWQgPSAhdG9rZW4gfHwgdG9rZW4uaXNFeHBpcmVkKCk7XG5cdFx0XHRcdFx0Ly8gSWYgdGhlcmUgaXMgYSB0b2tlbiB0byBpbmplY3Rcblx0XHRcdFx0XHRpZiAoXG5cdFx0XHRcdFx0XHRyYXdUb2tlbiAmJlxuXHRcdFx0XHRcdFx0KCFpc0FjY2Vzc1Rva2VuRXhwaXJlZE9ySW52YWxpZCB8fCB0aGlzLmp3dFJlZnJlc2hDb25maWd1cmF0aW9uKVxuXHRcdFx0XHRcdCkge1xuXHRcdFx0XHRcdFx0bGV0IGNsb25lZCA9IHJlcXVlc3QuY2xvbmUoe1xuXHRcdFx0XHRcdFx0XHRoZWFkZXJzOiByZXF1ZXN0LmhlYWRlcnMuc2V0KFxuXHRcdFx0XHRcdFx0XHRcdHRoaXMuand0Q29uZmlndXJhdGlvbi5oZWFkZXIsXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5qd3RDb25maWd1cmF0aW9uLnNjaGVtZVxuXHRcdFx0XHRcdFx0XHRcdFx0PyB0aGlzLmp3dENvbmZpZ3VyYXRpb24uc2NoZW1lICsgcmF3VG9rZW5cblx0XHRcdFx0XHRcdFx0XHRcdDogcmF3VG9rZW5cblx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0aWYgKHRoaXMuand0Q29uZmlndXJhdGlvbi5oYW5kbGVXaXRoQ3JlZGVudGlhbHMpIHtcblx0XHRcdFx0XHRcdFx0Y2xvbmVkID0gY2xvbmVkLmNsb25lKHtcblx0XHRcdFx0XHRcdFx0XHR3aXRoQ3JlZGVudGlhbHM6IHRydWUsXG5cdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0cmV0dXJuIG5leHQuaGFuZGxlKGNsb25lZCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHJldHVybiB0aHJvd0Vycm9yKFxuXHRcdFx0XHRcdFx0XHRKd3RFcnJvci5jcmVhdGVFcnJvclJlc3BvbnNlKFxuXHRcdFx0XHRcdFx0XHRcdHJlcXVlc3QsXG5cdFx0XHRcdFx0XHRcdFx0J1Rva2VuIGlzIGV4cGlyZWQgb3IgaW52YWxpZCwgYW5kIHJlZnJlc2ggaXMgbm90IGNvbmZpZ3VyZWQuJ1xuXHRcdFx0XHRcdFx0XHQpXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gbmV4dC5oYW5kbGUocmVxdWVzdCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0KTtcblx0fVxufVxuIl19