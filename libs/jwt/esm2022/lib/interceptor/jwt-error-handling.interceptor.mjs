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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0LWVycm9yLWhhbmRsaW5nLmludGVyY2VwdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbGlicy9qd3Qvc3JjL2xpYi9pbnRlcmNlcHRvci9qd3QtZXJyb3ItaGFuZGxpbmcuaW50ZXJjZXB0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0EsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUV6QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDNUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHVDQUF1QyxDQUFDO0FBS3ZFLE9BQU8sRUFDTiwrQkFBK0IsRUFDL0IsdUNBQXVDLEVBQ3ZDLHVCQUF1QixFQUN2QiwrQkFBK0IsR0FDL0IsTUFBTSxrQ0FBa0MsQ0FBQzs7O0FBRTFDOzs7R0FHRztBQUVILE1BQU0sT0FBTywyQkFBMkI7SUFHdkMsWUFFQyxTQUEyQixFQUUzQixnQkFBa0MsRUFHbEMsYUFBeUQsRUFHekQsdUJBQW1FLEVBQ3RDLE1BQWU7UUFBZixXQUFNLEdBQU4sTUFBTSxDQUFTO1FBRTVDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRztZQUN2QixHQUFHLGdCQUFnQjtZQUNuQixHQUFHLFNBQVM7U0FDWixDQUFDO1FBRUYsSUFBSSxDQUFDLHVCQUF1QjtZQUMzQix1QkFBdUIsSUFBSSxhQUFhO2dCQUN2QyxDQUFDLENBQUM7b0JBQ0EsR0FBRyx1QkFBdUI7b0JBQzFCLEdBQUcsYUFBYTtpQkFDaEI7Z0JBQ0YsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNmLENBQUM7SUFDTSxTQUFTLENBQ2YsT0FBNkIsRUFDN0IsSUFBaUI7UUFFakIsT0FBTyxJQUFJO2FBQ1QsTUFBTSxDQUFDLE9BQU8sQ0FBQzthQUNmLElBQUksQ0FDSixVQUFVLENBQUMsQ0FBQyxhQUFnQyxFQUFFLEVBQUUsQ0FDL0MsY0FBYyxDQUNiLGFBQWEsRUFDYixJQUFJLENBQUMsZ0JBQWdCLEVBQ3JCLElBQUksQ0FBQyx1QkFBdUIsRUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FDWCxDQUNELENBQ0QsQ0FBQztJQUNKLENBQUM7OEdBN0NXLDJCQUEyQixrQkFJOUIsdUJBQXVCLGFBRXZCLCtCQUErQixhQUcvQiwrQkFBK0IsNkJBRy9CLHVDQUF1QztrSEFacEMsMkJBQTJCOzsyRkFBM0IsMkJBQTJCO2tCQUR2QyxVQUFVOzswQkFLUixNQUFNOzJCQUFDLHVCQUF1Qjs7MEJBRTlCLE1BQU07MkJBQUMsK0JBQStCOzswQkFFdEMsUUFBUTs7MEJBQ1IsTUFBTTsyQkFBQywrQkFBK0I7OzBCQUV0QyxRQUFROzswQkFDUixNQUFNOzJCQUFDLHVDQUF1Qzs7MEJBRTlDLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuXHRIdHRwRXJyb3JSZXNwb25zZSxcblx0SHR0cEV2ZW50LFxuXHRIdHRwSGFuZGxlcixcblx0SHR0cEludGVyY2VwdG9yLFxuXHRIdHRwUmVxdWVzdCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGNhdGNoRXJyb3IgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBoYW5kbGVKd3RFcnJvciB9IGZyb20gJy4uL2Z1bmN0aW9uL2hhbmRsZS1qd3QtZXJyb3IuZnVuY3Rpb24nO1xuaW1wb3J0IHtcblx0Snd0Q29uZmlndXJhdGlvbixcblx0Snd0UmVmcmVzaENvbmZpZ3VyYXRpb24sXG59IGZyb20gJy4uL21vZGVsL2F1dGgtY29yZS1jb25maWd1cmF0aW9uLmludGVyZmFjZSc7XG5pbXBvcnQge1xuXHRERUZBVUxUX0pXVF9DT05GSUdVUkFUSU9OX1RPS0VOLFxuXHRERUZBVUxUX0pXVF9SRUZSRVNIX0NPTkZJR1VSQVRJT05fVE9LRU4sXG5cdEpXVF9DT05GSUdVUkFUSU9OX1RPS0VOLFxuXHRKV1RfUkVGUkVTSF9DT05GSUdVUkFUSU9OX1RPS0VOLFxufSBmcm9tICcuLi90b2tlbi9qd3QtY29uZmlndXJhdGlvbi50b2tlbic7XG5cbi8qKlxuICogSWYgY29uZmlndXJlZCwgaGFuZGxlcyBhdXRoZW50aWNhdGlvbiBlcnJvcnMgd2l0aCBjdXN0b20gY2FsbGJhY2tzXG4gKiBvciByZWRpcmVjdHNcbiAqL1xuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEp3dEVycm9ySGFuZGxpbmdJbnRlcmNlcHRvciBpbXBsZW1lbnRzIEh0dHBJbnRlcmNlcHRvciB7XG5cdHByaXZhdGUgcmVhZG9ubHkgand0Q29uZmlndXJhdGlvbjogSnd0Q29uZmlndXJhdGlvbjtcblx0cHJpdmF0ZSByZWFkb25seSBqd3RSZWZyZXNoQ29uZmlndXJhdGlvbj86IEp3dFJlZnJlc2hDb25maWd1cmF0aW9uPHVua25vd24sIHVua25vd24+O1xuXHRwdWJsaWMgY29uc3RydWN0b3IoXG5cdFx0QEluamVjdChKV1RfQ09ORklHVVJBVElPTl9UT0tFTilcblx0XHRqd3RDb25maWc6IEp3dENvbmZpZ3VyYXRpb24sXG5cdFx0QEluamVjdChERUZBVUxUX0pXVF9DT05GSUdVUkFUSU9OX1RPS0VOKVxuXHRcdGRlZmF1bHRKd3RDb25maWc6IEp3dENvbmZpZ3VyYXRpb24sXG5cdFx0QE9wdGlvbmFsKClcblx0XHRASW5qZWN0KEpXVF9SRUZSRVNIX0NPTkZJR1VSQVRJT05fVE9LRU4pXG5cdFx0cmVmcmVzaENvbmZpZz86IEp3dFJlZnJlc2hDb25maWd1cmF0aW9uPHVua25vd24sIHVua25vd24+LFxuXHRcdEBPcHRpb25hbCgpXG5cdFx0QEluamVjdChERUZBVUxUX0pXVF9SRUZSRVNIX0NPTkZJR1VSQVRJT05fVE9LRU4pXG5cdFx0ZGVmYXVsdEp3dFJlZnJlc2hDb25maWc/OiBKd3RSZWZyZXNoQ29uZmlndXJhdGlvbjx1bmtub3duLCB1bmtub3duPixcblx0XHRAT3B0aW9uYWwoKSBwcml2YXRlIHJlYWRvbmx5IHJvdXRlcj86IFJvdXRlcixcblx0KSB7XG5cdFx0dGhpcy5qd3RDb25maWd1cmF0aW9uID0ge1xuXHRcdFx0Li4uZGVmYXVsdEp3dENvbmZpZyxcblx0XHRcdC4uLmp3dENvbmZpZyxcblx0XHR9O1xuXG5cdFx0dGhpcy5qd3RSZWZyZXNoQ29uZmlndXJhdGlvbiA9XG5cdFx0XHRkZWZhdWx0Snd0UmVmcmVzaENvbmZpZyAmJiByZWZyZXNoQ29uZmlnXG5cdFx0XHRcdD8ge1xuXHRcdFx0XHRcdFx0Li4uZGVmYXVsdEp3dFJlZnJlc2hDb25maWcsXG5cdFx0XHRcdFx0XHQuLi5yZWZyZXNoQ29uZmlnLFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0OiB1bmRlZmluZWQ7XG5cdH1cblx0cHVibGljIGludGVyY2VwdChcblx0XHRyZXF1ZXN0OiBIdHRwUmVxdWVzdDx1bmtub3duPixcblx0XHRuZXh0OiBIdHRwSGFuZGxlcixcblx0KTogT2JzZXJ2YWJsZTxIdHRwRXZlbnQ8dW5rbm93bj4+IHtcblx0XHRyZXR1cm4gbmV4dFxuXHRcdFx0LmhhbmRsZShyZXF1ZXN0KVxuXHRcdFx0LnBpcGUoXG5cdFx0XHRcdGNhdGNoRXJyb3IoKGVycm9yUmVzcG9uc2U6IEh0dHBFcnJvclJlc3BvbnNlKSA9PlxuXHRcdFx0XHRcdGhhbmRsZUp3dEVycm9yKFxuXHRcdFx0XHRcdFx0ZXJyb3JSZXNwb25zZSxcblx0XHRcdFx0XHRcdHRoaXMuand0Q29uZmlndXJhdGlvbixcblx0XHRcdFx0XHRcdHRoaXMuand0UmVmcmVzaENvbmZpZ3VyYXRpb24sXG5cdFx0XHRcdFx0XHR0aGlzLnJvdXRlcixcblx0XHRcdFx0XHQpLFxuXHRcdFx0XHQpLFxuXHRcdFx0KTtcblx0fVxufVxuIl19