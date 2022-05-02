import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { JwtErrorHandlingInterceptor } from './interceptor/jwt-error-handling.interceptor';
import { JwtInjectorInterceptor } from './interceptor/jwt-injector.interceptor';
import { JwtRefreshInterceptor } from './interceptor/jwt-refresh.interceptor';
import { DEFAULT_JWT_CONFIG, DEFAULT_JWT_REFRESH_CONFIG, } from './model/auth-core-configuration.interface';
import { createJwtConfigurationProvider } from './providers/create-jwt-configuration-provider.function';
import { createJwtRefreshConfigurationProvider } from './providers/create-jwt-refresh-configuration-provider.function';
import { DEFAULT_JWT_CONFIGURATION_TOKEN, DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN, } from './token/jwt-configuration.token';
import * as i0 from "@angular/core";
/**
 * This module needs to be configured to use. See the
 * {@link JwtModule#forRoot | forRoot} method for more information.
 *
 * tokens. So that other, plug in configration modules can provide them.
 * Like Ngrx and Local. They then transform their configs into this common one.
 */
export class JwtModule {
    static forRoot(jwtModuleConfigurationProvider, jwtRefreshConfigurationProvider) {
        return {
            ngModule: JwtModule,
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: JwtErrorHandlingInterceptor,
                    multi: true,
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: JwtInjectorInterceptor,
                    multi: true,
                },
                {
                    provide: DEFAULT_JWT_CONFIGURATION_TOKEN,
                    useValue: DEFAULT_JWT_CONFIG,
                },
                createJwtConfigurationProvider(jwtModuleConfigurationProvider),
                ...(jwtRefreshConfigurationProvider
                    ? [
                        {
                            provide: HTTP_INTERCEPTORS,
                            useClass: JwtRefreshInterceptor,
                            multi: true,
                        },
                        {
                            provide: DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,
                            useValue: DEFAULT_JWT_REFRESH_CONFIG,
                        },
                        createJwtRefreshConfigurationProvider(jwtRefreshConfigurationProvider),
                    ]
                    : []),
            ],
        };
    }
}
JwtModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: JwtModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
JwtModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: JwtModule, imports: [CommonModule] });
JwtModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: JwtModule, imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.5", ngImport: i0, type: JwtModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2xpYnMvand0L3NyYy9saWIvand0Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDekQsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDM0YsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDaEYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDOUUsT0FBTyxFQUNOLGtCQUFrQixFQUNsQiwwQkFBMEIsR0FDMUIsTUFBTSwyQ0FBMkMsQ0FBQztBQUNuRCxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUN4RyxPQUFPLEVBQUUscUNBQXFDLEVBQUUsTUFBTSxnRUFBZ0UsQ0FBQztBQUN2SCxPQUFPLEVBQ04sK0JBQStCLEVBQy9CLHVDQUF1QyxHQUd2QyxNQUFNLGlDQUFpQyxDQUFDOztBQUV6Qzs7Ozs7O0dBTUc7QUFJSCxNQUFNLE9BQU8sU0FBUztJQThCZCxNQUFNLENBQUMsT0FBTyxDQUNwQiw4QkFBOEQsRUFDOUQsK0JBR0M7UUFFRCxPQUFPO1lBQ04sUUFBUSxFQUFFLFNBQVM7WUFDbkIsU0FBUyxFQUFFO2dCQUNWO29CQUNDLE9BQU8sRUFBRSxpQkFBaUI7b0JBQzFCLFFBQVEsRUFBRSwyQkFBMkI7b0JBQ3JDLEtBQUssRUFBRSxJQUFJO2lCQUNYO2dCQUNEO29CQUNDLE9BQU8sRUFBRSxpQkFBaUI7b0JBQzFCLFFBQVEsRUFBRSxzQkFBc0I7b0JBQ2hDLEtBQUssRUFBRSxJQUFJO2lCQUNYO2dCQUNEO29CQUNDLE9BQU8sRUFBRSwrQkFBK0I7b0JBQ3hDLFFBQVEsRUFBRSxrQkFBa0I7aUJBQzVCO2dCQUNELDhCQUE4QixDQUFDLDhCQUE4QixDQUFDO2dCQUM5RCxHQUFHLENBQUMsK0JBQStCO29CQUNsQyxDQUFDLENBQUM7d0JBQ0E7NEJBQ0MsT0FBTyxFQUFFLGlCQUFpQjs0QkFDMUIsUUFBUSxFQUFFLHFCQUFxQjs0QkFDL0IsS0FBSyxFQUFFLElBQUk7eUJBQ1g7d0JBQ0Q7NEJBQ0MsT0FBTyxFQUFFLHVDQUF1Qzs0QkFDaEQsUUFBUSxFQUFFLDBCQUEwQjt5QkFDcEM7d0JBQ0QscUNBQXFDLENBQ3BDLCtCQUErQixDQUMvQjtxQkFDQTtvQkFDSCxDQUFDLENBQUMsRUFBRSxDQUFDO2FBQ047U0FDRCxDQUFDO0lBQ0gsQ0FBQzs7c0dBekVXLFNBQVM7dUdBQVQsU0FBUyxZQUZYLFlBQVk7dUdBRVYsU0FBUyxZQUZaLENBQUMsWUFBWSxDQUFDOzJGQUVYLFNBQVM7a0JBSHJCLFFBQVE7bUJBQUM7b0JBQ1QsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2lCQUN2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBIVFRQX0lOVEVSQ0VQVE9SUyB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbi9odHRwJztcbmltcG9ydCB7IE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBKd3RFcnJvckhhbmRsaW5nSW50ZXJjZXB0b3IgfSBmcm9tICcuL2ludGVyY2VwdG9yL2p3dC1lcnJvci1oYW5kbGluZy5pbnRlcmNlcHRvcic7XG5pbXBvcnQgeyBKd3RJbmplY3RvckludGVyY2VwdG9yIH0gZnJvbSAnLi9pbnRlcmNlcHRvci9qd3QtaW5qZWN0b3IuaW50ZXJjZXB0b3InO1xuaW1wb3J0IHsgSnd0UmVmcmVzaEludGVyY2VwdG9yIH0gZnJvbSAnLi9pbnRlcmNlcHRvci9qd3QtcmVmcmVzaC5pbnRlcmNlcHRvcic7XG5pbXBvcnQge1xuXHRERUZBVUxUX0pXVF9DT05GSUcsXG5cdERFRkFVTFRfSldUX1JFRlJFU0hfQ09ORklHLFxufSBmcm9tICcuL21vZGVsL2F1dGgtY29yZS1jb25maWd1cmF0aW9uLmludGVyZmFjZSc7XG5pbXBvcnQgeyBjcmVhdGVKd3RDb25maWd1cmF0aW9uUHJvdmlkZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9jcmVhdGUtand0LWNvbmZpZ3VyYXRpb24tcHJvdmlkZXIuZnVuY3Rpb24nO1xuaW1wb3J0IHsgY3JlYXRlSnd0UmVmcmVzaENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4vcHJvdmlkZXJzL2NyZWF0ZS1qd3QtcmVmcmVzaC1jb25maWd1cmF0aW9uLXByb3ZpZGVyLmZ1bmN0aW9uJztcbmltcG9ydCB7XG5cdERFRkFVTFRfSldUX0NPTkZJR1VSQVRJT05fVE9LRU4sXG5cdERFRkFVTFRfSldUX1JFRlJFU0hfQ09ORklHVVJBVElPTl9UT0tFTixcblx0Snd0TW9kdWxlQ29uZmlndXJhdGlvblByb3ZpZGVyLFxuXHRKd3RNb2R1bGVSZWZyZXNoQ29uZmlndXJhdGlvblByb3ZpZGVyLFxufSBmcm9tICcuL3Rva2VuL2p3dC1jb25maWd1cmF0aW9uLnRva2VuJztcblxuLyoqXG4gKiBUaGlzIG1vZHVsZSBuZWVkcyB0byBiZSBjb25maWd1cmVkIHRvIHVzZS4gU2VlIHRoZVxuICoge0BsaW5rIEp3dE1vZHVsZSNmb3JSb290IHwgZm9yUm9vdH0gbWV0aG9kIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICpcbiAqIHRva2Vucy4gU28gdGhhdCBvdGhlciwgcGx1ZyBpbiBjb25maWdyYXRpb24gbW9kdWxlcyBjYW4gcHJvdmlkZSB0aGVtLlxuICogTGlrZSBOZ3J4IGFuZCBMb2NhbC4gVGhleSB0aGVuIHRyYW5zZm9ybSB0aGVpciBjb25maWdzIGludG8gdGhpcyBjb21tb24gb25lLlxuICovXG5ATmdNb2R1bGUoe1xuXHRpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbn0pXG5leHBvcnQgY2xhc3MgSnd0TW9kdWxlIHtcblx0LyoqXG5cdCAqIFRvIGRlZmluZSB0aGUgaW50ZXJjZXB0b3JzIGFuZCB0aGUgdG9rZW4gd2l0aCB0aGUgcHJvdmlkZWQgY29uZmlnLlxuXHQgKlxuXHQgKiBAZXhhbXBsZVxuXHQgKlxuXHQgKiBgYGB0c1xuXHQgKiAoYSlOZ01vZHVsZSh7XG5cdCAqXHRcdGltcG9ydHM6IFtcblx0ICpcdFx0XHRKd3RNb2R1bGUuZm9yUm9vdDxGb28+KHtcblx0ICpcdFx0XHRcdFx0dXNlRmFjdG9yeTogKGZvbykgPT4gZm9vLmdldENvbmYoKSxcblx0ICpcdFx0XHRcdFx0ZGVwczogW0Zvb10gLy8gaWYgc29tZXRoaW5nIGhhcyB0byBiZSBpbmplY3RlZFxuXHQgKlx0XHRcdH0pXG5cdCAqXHRcdF1cblx0ICpcdH0pXG5cdCAqXHRleHBvcnQgY2xhc3MgQ29yZU1vZHVsZSB7fVxuXHQgKiBgYGBcblx0ICogQHBhcmFtIHRva2VuUHJvdmlkZXIgY3JlYXRlIHdpdGggYGNyZWF0ZUF1dGhUb2tlblByb3ZpZGVyYCBvclxuXHQgKiBcdGBjcmVhdGVSZWZyZXNoYWJsZUF1dGhUb2tlblByb3ZpZGVyYFxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBmb3JSb290KFxuXHRcdGp3dE1vZHVsZUNvbmZpZ3VyYXRpb25Qcm92aWRlcjogSnd0TW9kdWxlQ29uZmlndXJhdGlvblByb3ZpZGVyXG5cdCk6IE1vZHVsZVdpdGhQcm92aWRlcnM8Snd0TW9kdWxlPjtcblx0cHVibGljIHN0YXRpYyBmb3JSb290PFJlZnJlc2hSZXF1ZXN0LCBSZWZyZXNoUmVzcG9uc2U+KFxuXHRcdGp3dE1vZHVsZUNvbmZpZ3VyYXRpb25Qcm92aWRlcjogSnd0TW9kdWxlQ29uZmlndXJhdGlvblByb3ZpZGVyLFxuXHRcdGp3dFJlZnJlc2hDb25maWd1cmF0aW9uUHJvdmlkZXI6IEp3dE1vZHVsZVJlZnJlc2hDb25maWd1cmF0aW9uUHJvdmlkZXI8XG5cdFx0XHRSZWZyZXNoUmVxdWVzdCxcblx0XHRcdFJlZnJlc2hSZXNwb25zZVxuXHRcdD5cblx0KTogTW9kdWxlV2l0aFByb3ZpZGVyczxKd3RNb2R1bGU+O1xuXHRwdWJsaWMgc3RhdGljIGZvclJvb3Q8UmVmcmVzaFJlcXVlc3QsIFJlZnJlc2hSZXNwb25zZT4oXG5cdFx0and0TW9kdWxlQ29uZmlndXJhdGlvblByb3ZpZGVyOiBKd3RNb2R1bGVDb25maWd1cmF0aW9uUHJvdmlkZXIsXG5cdFx0and0UmVmcmVzaENvbmZpZ3VyYXRpb25Qcm92aWRlcj86IEp3dE1vZHVsZVJlZnJlc2hDb25maWd1cmF0aW9uUHJvdmlkZXI8XG5cdFx0XHRSZWZyZXNoUmVxdWVzdCxcblx0XHRcdFJlZnJlc2hSZXNwb25zZVxuXHRcdD5cblx0KTogTW9kdWxlV2l0aFByb3ZpZGVyczxKd3RNb2R1bGU+IHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0bmdNb2R1bGU6IEp3dE1vZHVsZSxcblx0XHRcdHByb3ZpZGVyczogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cHJvdmlkZTogSFRUUF9JTlRFUkNFUFRPUlMsXG5cdFx0XHRcdFx0dXNlQ2xhc3M6IEp3dEVycm9ySGFuZGxpbmdJbnRlcmNlcHRvcixcblx0XHRcdFx0XHRtdWx0aTogdHJ1ZSxcblx0XHRcdFx0fSxcblx0XHRcdFx0e1xuXHRcdFx0XHRcdHByb3ZpZGU6IEhUVFBfSU5URVJDRVBUT1JTLFxuXHRcdFx0XHRcdHVzZUNsYXNzOiBKd3RJbmplY3RvckludGVyY2VwdG9yLFxuXHRcdFx0XHRcdG11bHRpOiB0cnVlLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cHJvdmlkZTogREVGQVVMVF9KV1RfQ09ORklHVVJBVElPTl9UT0tFTixcblx0XHRcdFx0XHR1c2VWYWx1ZTogREVGQVVMVF9KV1RfQ09ORklHLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjcmVhdGVKd3RDb25maWd1cmF0aW9uUHJvdmlkZXIoand0TW9kdWxlQ29uZmlndXJhdGlvblByb3ZpZGVyKSxcblx0XHRcdFx0Li4uKGp3dFJlZnJlc2hDb25maWd1cmF0aW9uUHJvdmlkZXJcblx0XHRcdFx0XHQ/IFtcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHByb3ZpZGU6IEhUVFBfSU5URVJDRVBUT1JTLFxuXHRcdFx0XHRcdFx0XHRcdHVzZUNsYXNzOiBKd3RSZWZyZXNoSW50ZXJjZXB0b3IsXG5cdFx0XHRcdFx0XHRcdFx0bXVsdGk6IHRydWUsXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRwcm92aWRlOiBERUZBVUxUX0pXVF9SRUZSRVNIX0NPTkZJR1VSQVRJT05fVE9LRU4sXG5cdFx0XHRcdFx0XHRcdFx0dXNlVmFsdWU6IERFRkFVTFRfSldUX1JFRlJFU0hfQ09ORklHLFxuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHRjcmVhdGVKd3RSZWZyZXNoQ29uZmlndXJhdGlvblByb3ZpZGVyPFJlZnJlc2hSZXF1ZXN0LCBSZWZyZXNoUmVzcG9uc2U+KFxuXHRcdFx0XHRcdFx0XHRcdGp3dFJlZnJlc2hDb25maWd1cmF0aW9uUHJvdmlkZXJcblx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHQgIF1cblx0XHRcdFx0XHQ6IFtdKSxcblx0XHRcdF0sXG5cdFx0fTtcblx0fVxufVxuIl19