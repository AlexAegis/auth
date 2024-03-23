import { Inject, Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { handleJwtError } from '../function/handle-jwt-error.function';
import { DEFAULT_JWT_CONFIGURATION_TOKEN, DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN, JWT_CONFIGURATION_TOKEN, JWT_REFRESH_CONFIGURATION_TOKEN, } from '../token/jwt-configuration.token';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
/**
 * If configured, handles authentication errors with custom callbacks
 * or redirects
 */
export class JwtErrorHandlingInterceptor {
    constructor(jwtConfig, defaultJwtConfig, refreshConfig, defaultJwtRefreshConfig, router) {
        this.router = router;
        this.jwtConfiguration = {
            ...defaultJwtConfig,
            ...jwtConfig,
        };
        this.jwtRefreshConfiguration =
            defaultJwtRefreshConfig && refreshConfig
                ? {
                    ...defaultJwtRefreshConfig,
                    ...refreshConfig,
                }
                : undefined;
    }
    intercept(request, next) {
        return next
            .handle(request)
            .pipe(catchError((errorResponse) => handleJwtError(errorResponse, this.jwtConfiguration, this.jwtRefreshConfiguration, this.router)));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.1", ngImport: i0, type: JwtErrorHandlingInterceptor, deps: [{ token: JWT_CONFIGURATION_TOKEN }, { token: DEFAULT_JWT_CONFIGURATION_TOKEN }, { token: JWT_REFRESH_CONFIGURATION_TOKEN, optional: true }, { token: DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN, optional: true }, { token: i1.Router, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.1", ngImport: i0, type: JwtErrorHandlingInterceptor }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.1", ngImport: i0, type: JwtErrorHandlingInterceptor, decorators: [{
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
                }] }, { type: i1.Router, decorators: [{
                    type: Optional
                }] }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0LWVycm9yLWhhbmRsaW5nLmludGVyY2VwdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbGlicy9qd3Qvc3JjL2xpYi9pbnRlcmNlcHRvci9qd3QtZXJyb3ItaGFuZGxpbmcuaW50ZXJjZXB0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0EsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUV6QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBS3ZFLE9BQU8sRUFDTiwrQkFBK0IsRUFDL0IsdUNBQXVDLEVBQ3ZDLHVCQUF1QixFQUN2QiwrQkFBK0IsR0FDL0IsTUFBTSxrQ0FBa0MsQ0FBQzs7O0FBRTFDOzs7R0FHRztBQUVILE1BQU0sT0FBTywyQkFBMkI7SUFHdkMsWUFFQyxTQUEyQixFQUUzQixnQkFBa0MsRUFHbEMsYUFBeUQsRUFHekQsdUJBQW1FLEVBQ3RDLE1BQWU7UUFBZixXQUFNLEdBQU4sTUFBTSxDQUFTO1FBRTVDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRztZQUN2QixHQUFHLGdCQUFnQjtZQUNuQixHQUFHLFNBQVM7U0FDWixDQUFDO1FBRUYsSUFBSSxDQUFDLHVCQUF1QjtZQUMzQix1QkFBdUIsSUFBSSxhQUFhO2dCQUN2QyxDQUFDLENBQUM7b0JBQ0EsR0FBRyx1QkFBdUI7b0JBQzFCLEdBQUcsYUFBYTtpQkFDZjtnQkFDSCxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQ2YsQ0FBQztJQUNNLFNBQVMsQ0FDZixPQUE2QixFQUM3QixJQUFpQjtRQUVqQixPQUFPLElBQUk7YUFDVCxNQUFNLENBQUMsT0FBTyxDQUFDO2FBQ2YsSUFBSSxDQUNKLFVBQVUsQ0FBQyxDQUFDLGFBQWdDLEVBQUUsRUFBRSxDQUMvQyxjQUFjLENBQ2IsYUFBYSxFQUNiLElBQUksQ0FBQyxnQkFBZ0IsRUFDckIsSUFBSSxDQUFDLHVCQUF1QixFQUM1QixJQUFJLENBQUMsTUFBTSxDQUNYLENBQ0QsQ0FDRCxDQUFDO0lBQ0osQ0FBQzs4R0E3Q1csMkJBQTJCLGtCQUk5Qix1QkFBdUIsYUFFdkIsK0JBQStCLGFBRy9CLCtCQUErQiw2QkFHL0IsdUNBQXVDO2tIQVpwQywyQkFBMkI7OzJGQUEzQiwyQkFBMkI7a0JBRHZDLFVBQVU7OzBCQUtSLE1BQU07MkJBQUMsdUJBQXVCOzswQkFFOUIsTUFBTTsyQkFBQywrQkFBK0I7OzBCQUV0QyxRQUFROzswQkFDUixNQUFNOzJCQUFDLCtCQUErQjs7MEJBRXRDLFFBQVE7OzBCQUNSLE1BQU07MkJBQUMsdUNBQXVDOzswQkFFOUMsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG5cdEh0dHBFcnJvclJlc3BvbnNlLFxuXHRIdHRwRXZlbnQsXG5cdEh0dHBIYW5kbGVyLFxuXHRIdHRwSW50ZXJjZXB0b3IsXG5cdEh0dHBSZXF1ZXN0LFxufSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgY2F0Y2hFcnJvciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGhhbmRsZUp3dEVycm9yIH0gZnJvbSAnLi4vZnVuY3Rpb24vaGFuZGxlLWp3dC1lcnJvci5mdW5jdGlvbic7XG5pbXBvcnQge1xuXHRKd3RDb25maWd1cmF0aW9uLFxuXHRKd3RSZWZyZXNoQ29uZmlndXJhdGlvbixcbn0gZnJvbSAnLi4vbW9kZWwvYXV0aC1jb3JlLWNvbmZpZ3VyYXRpb24uaW50ZXJmYWNlJztcbmltcG9ydCB7XG5cdERFRkFVTFRfSldUX0NPTkZJR1VSQVRJT05fVE9LRU4sXG5cdERFRkFVTFRfSldUX1JFRlJFU0hfQ09ORklHVVJBVElPTl9UT0tFTixcblx0SldUX0NPTkZJR1VSQVRJT05fVE9LRU4sXG5cdEpXVF9SRUZSRVNIX0NPTkZJR1VSQVRJT05fVE9LRU4sXG59IGZyb20gJy4uL3Rva2VuL2p3dC1jb25maWd1cmF0aW9uLnRva2VuJztcblxuLyoqXG4gKiBJZiBjb25maWd1cmVkLCBoYW5kbGVzIGF1dGhlbnRpY2F0aW9uIGVycm9ycyB3aXRoIGN1c3RvbSBjYWxsYmFja3NcbiAqIG9yIHJlZGlyZWN0c1xuICovXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgSnd0RXJyb3JIYW5kbGluZ0ludGVyY2VwdG9yIGltcGxlbWVudHMgSHR0cEludGVyY2VwdG9yIHtcblx0cHJpdmF0ZSByZWFkb25seSBqd3RDb25maWd1cmF0aW9uOiBKd3RDb25maWd1cmF0aW9uO1xuXHRwcml2YXRlIHJlYWRvbmx5IGp3dFJlZnJlc2hDb25maWd1cmF0aW9uPzogSnd0UmVmcmVzaENvbmZpZ3VyYXRpb248dW5rbm93biwgdW5rbm93bj47XG5cdHB1YmxpYyBjb25zdHJ1Y3Rvcihcblx0XHRASW5qZWN0KEpXVF9DT05GSUdVUkFUSU9OX1RPS0VOKVxuXHRcdGp3dENvbmZpZzogSnd0Q29uZmlndXJhdGlvbixcblx0XHRASW5qZWN0KERFRkFVTFRfSldUX0NPTkZJR1VSQVRJT05fVE9LRU4pXG5cdFx0ZGVmYXVsdEp3dENvbmZpZzogSnd0Q29uZmlndXJhdGlvbixcblx0XHRAT3B0aW9uYWwoKVxuXHRcdEBJbmplY3QoSldUX1JFRlJFU0hfQ09ORklHVVJBVElPTl9UT0tFTilcblx0XHRyZWZyZXNoQ29uZmlnPzogSnd0UmVmcmVzaENvbmZpZ3VyYXRpb248dW5rbm93biwgdW5rbm93bj4sXG5cdFx0QE9wdGlvbmFsKClcblx0XHRASW5qZWN0KERFRkFVTFRfSldUX1JFRlJFU0hfQ09ORklHVVJBVElPTl9UT0tFTilcblx0XHRkZWZhdWx0Snd0UmVmcmVzaENvbmZpZz86IEp3dFJlZnJlc2hDb25maWd1cmF0aW9uPHVua25vd24sIHVua25vd24+LFxuXHRcdEBPcHRpb25hbCgpIHByaXZhdGUgcmVhZG9ubHkgcm91dGVyPzogUm91dGVyXG5cdCkge1xuXHRcdHRoaXMuand0Q29uZmlndXJhdGlvbiA9IHtcblx0XHRcdC4uLmRlZmF1bHRKd3RDb25maWcsXG5cdFx0XHQuLi5qd3RDb25maWcsXG5cdFx0fTtcblxuXHRcdHRoaXMuand0UmVmcmVzaENvbmZpZ3VyYXRpb24gPVxuXHRcdFx0ZGVmYXVsdEp3dFJlZnJlc2hDb25maWcgJiYgcmVmcmVzaENvbmZpZ1xuXHRcdFx0XHQ/IHtcblx0XHRcdFx0XHRcdC4uLmRlZmF1bHRKd3RSZWZyZXNoQ29uZmlnLFxuXHRcdFx0XHRcdFx0Li4ucmVmcmVzaENvbmZpZyxcblx0XHRcdFx0ICB9XG5cdFx0XHRcdDogdW5kZWZpbmVkO1xuXHR9XG5cdHB1YmxpYyBpbnRlcmNlcHQoXG5cdFx0cmVxdWVzdDogSHR0cFJlcXVlc3Q8dW5rbm93bj4sXG5cdFx0bmV4dDogSHR0cEhhbmRsZXJcblx0KTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8dW5rbm93bj4+IHtcblx0XHRyZXR1cm4gbmV4dFxuXHRcdFx0LmhhbmRsZShyZXF1ZXN0KVxuXHRcdFx0LnBpcGUoXG5cdFx0XHRcdGNhdGNoRXJyb3IoKGVycm9yUmVzcG9uc2U6IEh0dHBFcnJvclJlc3BvbnNlKSA9PlxuXHRcdFx0XHRcdGhhbmRsZUp3dEVycm9yKFxuXHRcdFx0XHRcdFx0ZXJyb3JSZXNwb25zZSxcblx0XHRcdFx0XHRcdHRoaXMuand0Q29uZmlndXJhdGlvbixcblx0XHRcdFx0XHRcdHRoaXMuand0UmVmcmVzaENvbmZpZ3VyYXRpb24sXG5cdFx0XHRcdFx0XHR0aGlzLnJvdXRlclxuXHRcdFx0XHRcdClcblx0XHRcdFx0KVxuXHRcdFx0KTtcblx0fVxufVxuIl19