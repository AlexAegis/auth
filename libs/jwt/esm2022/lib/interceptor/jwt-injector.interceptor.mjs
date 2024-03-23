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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.1", ngImport: i0, type: JwtInjectorInterceptor, deps: [{ token: JWT_CONFIGURATION_TOKEN }, { token: DEFAULT_JWT_CONFIGURATION_TOKEN }, { token: JWT_REFRESH_CONFIGURATION_TOKEN, optional: true }, { token: DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.1", ngImport: i0, type: JwtInjectorInterceptor }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.1", ngImport: i0, type: JwtInjectorInterceptor, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: undefined, decorators: [{
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
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0LWluamVjdG9yLmludGVyY2VwdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbGlicy9qd3Qvc3JjL2xpYi9pbnRlcmNlcHRvci9qd3QtaW5qZWN0b3IuaW50ZXJjZXB0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdELE9BQU8sRUFBYyxVQUFVLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDOUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDckQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sK0NBQStDLENBQUM7QUFDdEYsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUtoRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDcEQsT0FBTyxFQUNOLCtCQUErQixFQUMvQix1Q0FBdUMsRUFDdkMsdUJBQXVCLEVBQ3ZCLCtCQUErQixHQUMvQixNQUFNLGtDQUFrQyxDQUFDOztBQUcxQyxNQUFNLE9BQU8sc0JBQXNCO0lBSWxDLFlBRUMsU0FBMkIsRUFFM0IsZ0JBQWtDLEVBR2xDLGFBQXlELEVBR3pELHVCQUFtRTtRQUVuRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUc7WUFDdkIsR0FBRyxnQkFBZ0I7WUFDbkIsR0FBRyxTQUFTO1NBQ1osQ0FBQztRQUVGLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxhQUFhO1lBQzNDLHVCQUF1QixJQUFJO1lBQzFCLEdBQUcsdUJBQXVCO1lBQzFCLEdBQUcsYUFBYTtTQUNoQixDQUFDO0lBQ0osQ0FBQztJQUVNLFNBQVMsQ0FDZixPQUE2QixFQUM3QixJQUFpQjtRQUVqQixNQUFNLFlBQVksR0FBRyxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlDLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQ3pELElBQUksQ0FBQyxDQUFDLENBQUMsRUFDUCxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUN0QixJQUFJLHFCQUFxQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxZQUFZLENBQUMsRUFBRSxDQUFDO2dCQUNoRSxNQUFNLEtBQUssR0FBRyxRQUFRLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDbEQsTUFBTSw2QkFBNkIsR0FBRyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQ2xFLGdDQUFnQztnQkFDaEMsSUFDQyxRQUFRO29CQUNSLENBQUMsQ0FBQyw2QkFBNkIsSUFBSSxJQUFJLENBQUMsdUJBQXVCLENBQUMsRUFDL0QsQ0FBQztvQkFDRixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDO3dCQUMxQixPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQzNCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQzVCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNOzRCQUMzQixDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxRQUFROzRCQUN6QyxDQUFDLENBQUMsUUFBUSxDQUNYO3FCQUNELENBQUMsQ0FBQztvQkFDSCxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO3dCQUNqRCxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQzs0QkFDckIsZUFBZSxFQUFFLElBQUk7eUJBQ3JCLENBQUMsQ0FBQztvQkFDSixDQUFDO29CQUNELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDNUIsQ0FBQztxQkFBTSxDQUFDO29CQUNQLE9BQU8sVUFBVSxDQUNoQixRQUFRLENBQUMsbUJBQW1CLENBQzNCLE9BQU8sRUFDUCw2REFBNkQsQ0FDN0QsQ0FDRCxDQUFDO2dCQUNILENBQUM7WUFDRixDQUFDO2lCQUFNLENBQUM7Z0JBQ1AsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzdCLENBQUM7UUFDRixDQUFDLENBQUMsQ0FDRixDQUFDO0lBQ0gsQ0FBQzs4R0F2RVcsc0JBQXNCLGtCQUt6Qix1QkFBdUIsYUFFdkIsK0JBQStCLGFBRy9CLCtCQUErQiw2QkFHL0IsdUNBQXVDO2tIQWJwQyxzQkFBc0I7OzJGQUF0QixzQkFBc0I7a0JBRGxDLFVBQVU7OzBCQU1SLE1BQU07MkJBQUMsdUJBQXVCOzswQkFFOUIsTUFBTTsyQkFBQywrQkFBK0I7OzBCQUV0QyxRQUFROzswQkFDUixNQUFNOzJCQUFDLCtCQUErQjs7MEJBRXRDLFFBQVE7OzBCQUNSLE1BQU07MkJBQUMsdUNBQXVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cEV2ZW50LCBIdHRwSGFuZGxlciwgSHR0cEludGVyY2VwdG9yLCBIdHRwUmVxdWVzdCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHN3aXRjaE1hcCwgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IEp3dEVycm9yIH0gZnJvbSAnLi4vZXJyb3JzL2p3dC1lcnJvci5jbGFzcyc7XG5pbXBvcnQgeyBjaGVja0FnYWluc3RVcmxGaWx0ZXIgfSBmcm9tICcuLi9mdW5jdGlvbi9jaGVjay1hZ2FpbnN0LXVybC1maWx0ZXIuZnVuY3Rpb24nO1xuaW1wb3J0IHsgaW50b09ic2VydmFibGUgfSBmcm9tICcuLi9mdW5jdGlvbi9pbnRvLW9ic2VydmFibGUuZnVuY3Rpb24nO1xuaW1wb3J0IHsgc2VwYXJhdGVVcmwgfSBmcm9tICcuLi9mdW5jdGlvbi9zZXBhcmF0ZS11cmwuZnVuY3Rpb24nO1xuaW1wb3J0IHtcblx0Snd0Q29uZmlndXJhdGlvbixcblx0Snd0UmVmcmVzaENvbmZpZ3VyYXRpb24sXG59IGZyb20gJy4uL21vZGVsL2F1dGgtY29yZS1jb25maWd1cmF0aW9uLmludGVyZmFjZSc7XG5pbXBvcnQgeyBKd3RUb2tlbiB9IGZyb20gJy4uL21vZGVsL2p3dC10b2tlbi5jbGFzcyc7XG5pbXBvcnQge1xuXHRERUZBVUxUX0pXVF9DT05GSUdVUkFUSU9OX1RPS0VOLFxuXHRERUZBVUxUX0pXVF9SRUZSRVNIX0NPTkZJR1VSQVRJT05fVE9LRU4sXG5cdEpXVF9DT05GSUdVUkFUSU9OX1RPS0VOLFxuXHRKV1RfUkVGUkVTSF9DT05GSUdVUkFUSU9OX1RPS0VOLFxufSBmcm9tICcuLi90b2tlbi9qd3QtY29uZmlndXJhdGlvbi50b2tlbic7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBKd3RJbmplY3RvckludGVyY2VwdG9yIGltcGxlbWVudHMgSHR0cEludGVyY2VwdG9yIHtcblx0cHJpdmF0ZSByZWFkb25seSBqd3RDb25maWd1cmF0aW9uITogSnd0Q29uZmlndXJhdGlvbjtcblx0cHJpdmF0ZSByZWFkb25seSBqd3RSZWZyZXNoQ29uZmlndXJhdGlvbj86IEp3dFJlZnJlc2hDb25maWd1cmF0aW9uPHVua25vd24sIHVua25vd24+O1xuXG5cdHB1YmxpYyBjb25zdHJ1Y3Rvcihcblx0XHRASW5qZWN0KEpXVF9DT05GSUdVUkFUSU9OX1RPS0VOKVxuXHRcdGp3dENvbmZpZzogSnd0Q29uZmlndXJhdGlvbixcblx0XHRASW5qZWN0KERFRkFVTFRfSldUX0NPTkZJR1VSQVRJT05fVE9LRU4pXG5cdFx0ZGVmYXVsdEp3dENvbmZpZzogSnd0Q29uZmlndXJhdGlvbixcblx0XHRAT3B0aW9uYWwoKVxuXHRcdEBJbmplY3QoSldUX1JFRlJFU0hfQ09ORklHVVJBVElPTl9UT0tFTilcblx0XHRyZWZyZXNoQ29uZmlnPzogSnd0UmVmcmVzaENvbmZpZ3VyYXRpb248dW5rbm93biwgdW5rbm93bj4sXG5cdFx0QE9wdGlvbmFsKClcblx0XHRASW5qZWN0KERFRkFVTFRfSldUX1JFRlJFU0hfQ09ORklHVVJBVElPTl9UT0tFTilcblx0XHRkZWZhdWx0Snd0UmVmcmVzaENvbmZpZz86IEp3dFJlZnJlc2hDb25maWd1cmF0aW9uPHVua25vd24sIHVua25vd24+XG5cdCkge1xuXHRcdHRoaXMuand0Q29uZmlndXJhdGlvbiA9IHtcblx0XHRcdC4uLmRlZmF1bHRKd3RDb25maWcsXG5cdFx0XHQuLi5qd3RDb25maWcsXG5cdFx0fTtcblxuXHRcdHRoaXMuand0UmVmcmVzaENvbmZpZ3VyYXRpb24gPSByZWZyZXNoQ29uZmlnICYmXG5cdFx0XHRkZWZhdWx0Snd0UmVmcmVzaENvbmZpZyAmJiB7XG5cdFx0XHRcdC4uLmRlZmF1bHRKd3RSZWZyZXNoQ29uZmlnLFxuXHRcdFx0XHQuLi5yZWZyZXNoQ29uZmlnLFxuXHRcdFx0fTtcblx0fVxuXG5cdHB1YmxpYyBpbnRlcmNlcHQoXG5cdFx0cmVxdWVzdDogSHR0cFJlcXVlc3Q8dW5rbm93bj4sXG5cdFx0bmV4dDogSHR0cEhhbmRsZXJcblx0KTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8dW5rbm93bj4+IHtcblx0XHRjb25zdCBzZXBhcmF0ZWRVcmwgPSBzZXBhcmF0ZVVybChyZXF1ZXN0LnVybCk7XG5cdFx0cmV0dXJuIGludG9PYnNlcnZhYmxlKHRoaXMuand0Q29uZmlndXJhdGlvbi5nZXRUb2tlbikucGlwZShcblx0XHRcdHRha2UoMSksXG5cdFx0XHRzd2l0Y2hNYXAoKHJhd1Rva2VuKSA9PiB7XG5cdFx0XHRcdGlmIChjaGVja0FnYWluc3RVcmxGaWx0ZXIodGhpcy5qd3RDb25maWd1cmF0aW9uLCBzZXBhcmF0ZWRVcmwpKSB7XG5cdFx0XHRcdFx0Y29uc3QgdG9rZW4gPSByYXdUb2tlbiAmJiBKd3RUb2tlbi5mcm9tKHJhd1Rva2VuKTtcblx0XHRcdFx0XHRjb25zdCBpc0FjY2Vzc1Rva2VuRXhwaXJlZE9ySW52YWxpZCA9ICF0b2tlbiB8fCB0b2tlbi5pc0V4cGlyZWQoKTtcblx0XHRcdFx0XHQvLyBJZiB0aGVyZSBpcyBhIHRva2VuIHRvIGluamVjdFxuXHRcdFx0XHRcdGlmIChcblx0XHRcdFx0XHRcdHJhd1Rva2VuICYmXG5cdFx0XHRcdFx0XHQoIWlzQWNjZXNzVG9rZW5FeHBpcmVkT3JJbnZhbGlkIHx8IHRoaXMuand0UmVmcmVzaENvbmZpZ3VyYXRpb24pXG5cdFx0XHRcdFx0KSB7XG5cdFx0XHRcdFx0XHRsZXQgY2xvbmVkID0gcmVxdWVzdC5jbG9uZSh7XG5cdFx0XHRcdFx0XHRcdGhlYWRlcnM6IHJlcXVlc3QuaGVhZGVycy5zZXQoXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5qd3RDb25maWd1cmF0aW9uLmhlYWRlcixcblx0XHRcdFx0XHRcdFx0XHR0aGlzLmp3dENvbmZpZ3VyYXRpb24uc2NoZW1lXG5cdFx0XHRcdFx0XHRcdFx0XHQ/IHRoaXMuand0Q29uZmlndXJhdGlvbi5zY2hlbWUgKyByYXdUb2tlblxuXHRcdFx0XHRcdFx0XHRcdFx0OiByYXdUb2tlblxuXHRcdFx0XHRcdFx0XHQpLFxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5qd3RDb25maWd1cmF0aW9uLmhhbmRsZVdpdGhDcmVkZW50aWFscykge1xuXHRcdFx0XHRcdFx0XHRjbG9uZWQgPSBjbG9uZWQuY2xvbmUoe1xuXHRcdFx0XHRcdFx0XHRcdHdpdGhDcmVkZW50aWFsczogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4gbmV4dC5oYW5kbGUoY2xvbmVkKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRocm93RXJyb3IoXG5cdFx0XHRcdFx0XHRcdEp3dEVycm9yLmNyZWF0ZUVycm9yUmVzcG9uc2UoXG5cdFx0XHRcdFx0XHRcdFx0cmVxdWVzdCxcblx0XHRcdFx0XHRcdFx0XHQnVG9rZW4gaXMgZXhwaXJlZCBvciBpbnZhbGlkLCBhbmQgcmVmcmVzaCBpcyBub3QgY29uZmlndXJlZC4nXG5cdFx0XHRcdFx0XHRcdClcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiBuZXh0LmhhbmRsZShyZXF1ZXN0KTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHQpO1xuXHR9XG59XG4iXX0=