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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.1", ngImport: i0, type: JwtModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.3.1", ngImport: i0, type: JwtModule, imports: [CommonModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.3.1", ngImport: i0, type: JwtModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.1", ngImport: i0, type: JwtModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2xpYnMvand0L3NyYy9saWIvand0Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDekQsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sOENBQThDLENBQUM7QUFDM0YsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDaEYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sdUNBQXVDLENBQUM7QUFDOUUsT0FBTyxFQUNOLGtCQUFrQixFQUNsQiwwQkFBMEIsR0FDMUIsTUFBTSwyQ0FBMkMsQ0FBQztBQUNuRCxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUN4RyxPQUFPLEVBQUUscUNBQXFDLEVBQUUsTUFBTSxnRUFBZ0UsQ0FBQztBQUN2SCxPQUFPLEVBQ04sK0JBQStCLEVBQy9CLHVDQUF1QyxHQUd2QyxNQUFNLGlDQUFpQyxDQUFDOztBQUV6Qzs7Ozs7O0dBTUc7QUFJSCxNQUFNLE9BQU8sU0FBUztJQThCZCxNQUFNLENBQUMsT0FBTyxDQUNwQiw4QkFBOEQsRUFDOUQsK0JBR0M7UUFFRCxPQUFPO1lBQ04sUUFBUSxFQUFFLFNBQVM7WUFDbkIsU0FBUyxFQUFFO2dCQUNWO29CQUNDLE9BQU8sRUFBRSxpQkFBaUI7b0JBQzFCLFFBQVEsRUFBRSwyQkFBMkI7b0JBQ3JDLEtBQUssRUFBRSxJQUFJO2lCQUNYO2dCQUNEO29CQUNDLE9BQU8sRUFBRSxpQkFBaUI7b0JBQzFCLFFBQVEsRUFBRSxzQkFBc0I7b0JBQ2hDLEtBQUssRUFBRSxJQUFJO2lCQUNYO2dCQUNEO29CQUNDLE9BQU8sRUFBRSwrQkFBK0I7b0JBQ3hDLFFBQVEsRUFBRSxrQkFBa0I7aUJBQzVCO2dCQUNELDhCQUE4QixDQUFDLDhCQUE4QixDQUFDO2dCQUM5RCxHQUFHLENBQUMsK0JBQStCO29CQUNsQyxDQUFDLENBQUM7d0JBQ0E7NEJBQ0MsT0FBTyxFQUFFLGlCQUFpQjs0QkFDMUIsUUFBUSxFQUFFLHFCQUFxQjs0QkFDL0IsS0FBSyxFQUFFLElBQUk7eUJBQ1g7d0JBQ0Q7NEJBQ0MsT0FBTyxFQUFFLHVDQUF1Qzs0QkFDaEQsUUFBUSxFQUFFLDBCQUEwQjt5QkFDcEM7d0JBQ0QscUNBQXFDLENBQ3BDLCtCQUErQixDQUMvQjtxQkFDRDtvQkFDRixDQUFDLENBQUMsRUFBRSxDQUFDO2FBQ047U0FDRCxDQUFDO0lBQ0gsQ0FBQzs4R0F6RVcsU0FBUzsrR0FBVCxTQUFTLFlBRlgsWUFBWTsrR0FFVixTQUFTLFlBRlgsWUFBWTs7MkZBRVYsU0FBUztrQkFIckIsUUFBUTttQkFBQztvQkFDVCxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7aUJBQ3ZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEhUVFBfSU5URVJDRVBUT1JTIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEp3dEVycm9ySGFuZGxpbmdJbnRlcmNlcHRvciB9IGZyb20gJy4vaW50ZXJjZXB0b3Ivand0LWVycm9yLWhhbmRsaW5nLmludGVyY2VwdG9yJztcbmltcG9ydCB7IEp3dEluamVjdG9ySW50ZXJjZXB0b3IgfSBmcm9tICcuL2ludGVyY2VwdG9yL2p3dC1pbmplY3Rvci5pbnRlcmNlcHRvcic7XG5pbXBvcnQgeyBKd3RSZWZyZXNoSW50ZXJjZXB0b3IgfSBmcm9tICcuL2ludGVyY2VwdG9yL2p3dC1yZWZyZXNoLmludGVyY2VwdG9yJztcbmltcG9ydCB7XG5cdERFRkFVTFRfSldUX0NPTkZJRyxcblx0REVGQVVMVF9KV1RfUkVGUkVTSF9DT05GSUcsXG59IGZyb20gJy4vbW9kZWwvYXV0aC1jb3JlLWNvbmZpZ3VyYXRpb24uaW50ZXJmYWNlJztcbmltcG9ydCB7IGNyZWF0ZUp3dENvbmZpZ3VyYXRpb25Qcm92aWRlciB9IGZyb20gJy4vcHJvdmlkZXJzL2NyZWF0ZS1qd3QtY29uZmlndXJhdGlvbi1wcm92aWRlci5mdW5jdGlvbic7XG5pbXBvcnQgeyBjcmVhdGVKd3RSZWZyZXNoQ29uZmlndXJhdGlvblByb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvY3JlYXRlLWp3dC1yZWZyZXNoLWNvbmZpZ3VyYXRpb24tcHJvdmlkZXIuZnVuY3Rpb24nO1xuaW1wb3J0IHtcblx0REVGQVVMVF9KV1RfQ09ORklHVVJBVElPTl9UT0tFTixcblx0REVGQVVMVF9KV1RfUkVGUkVTSF9DT05GSUdVUkFUSU9OX1RPS0VOLFxuXHRKd3RNb2R1bGVDb25maWd1cmF0aW9uUHJvdmlkZXIsXG5cdEp3dE1vZHVsZVJlZnJlc2hDb25maWd1cmF0aW9uUHJvdmlkZXIsXG59IGZyb20gJy4vdG9rZW4vand0LWNvbmZpZ3VyYXRpb24udG9rZW4nO1xuXG4vKipcbiAqIFRoaXMgbW9kdWxlIG5lZWRzIHRvIGJlIGNvbmZpZ3VyZWQgdG8gdXNlLiBTZWUgdGhlXG4gKiB7QGxpbmsgSnd0TW9kdWxlI2ZvclJvb3QgfCBmb3JSb290fSBtZXRob2QgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKlxuICogdG9rZW5zLiBTbyB0aGF0IG90aGVyLCBwbHVnIGluIGNvbmZpZ3JhdGlvbiBtb2R1bGVzIGNhbiBwcm92aWRlIHRoZW0uXG4gKiBMaWtlIE5ncnggYW5kIExvY2FsLiBUaGV5IHRoZW4gdHJhbnNmb3JtIHRoZWlyIGNvbmZpZ3MgaW50byB0aGlzIGNvbW1vbiBvbmUuXG4gKi9cbkBOZ01vZHVsZSh7XG5cdGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxufSlcbmV4cG9ydCBjbGFzcyBKd3RNb2R1bGUge1xuXHQvKipcblx0ICogVG8gZGVmaW5lIHRoZSBpbnRlcmNlcHRvcnMgYW5kIHRoZSB0b2tlbiB3aXRoIHRoZSBwcm92aWRlZCBjb25maWcuXG5cdCAqXG5cdCAqIEBleGFtcGxlXG5cdCAqXG5cdCAqIGBgYHRzXG5cdCAqIChhKU5nTW9kdWxlKHtcblx0ICpcdFx0aW1wb3J0czogW1xuXHQgKlx0XHRcdEp3dE1vZHVsZS5mb3JSb290PEZvbz4oe1xuXHQgKlx0XHRcdFx0XHR1c2VGYWN0b3J5OiAoZm9vKSA9PiBmb28uZ2V0Q29uZigpLFxuXHQgKlx0XHRcdFx0XHRkZXBzOiBbRm9vXSAvLyBpZiBzb21ldGhpbmcgaGFzIHRvIGJlIGluamVjdGVkXG5cdCAqXHRcdFx0fSlcblx0ICpcdFx0XVxuXHQgKlx0fSlcblx0ICpcdGV4cG9ydCBjbGFzcyBDb3JlTW9kdWxlIHt9XG5cdCAqIGBgYFxuXHQgKiBAcGFyYW0gdG9rZW5Qcm92aWRlciBjcmVhdGUgd2l0aCBgY3JlYXRlQXV0aFRva2VuUHJvdmlkZXJgIG9yXG5cdCAqIFx0YGNyZWF0ZVJlZnJlc2hhYmxlQXV0aFRva2VuUHJvdmlkZXJgXG5cdCAqL1xuXHRwdWJsaWMgc3RhdGljIGZvclJvb3QoXG5cdFx0and0TW9kdWxlQ29uZmlndXJhdGlvblByb3ZpZGVyOiBKd3RNb2R1bGVDb25maWd1cmF0aW9uUHJvdmlkZXIsXG5cdCk6IE1vZHVsZVdpdGhQcm92aWRlcnM8Snd0TW9kdWxlPjtcblx0cHVibGljIHN0YXRpYyBmb3JSb290PFJlZnJlc2hSZXF1ZXN0LCBSZWZyZXNoUmVzcG9uc2U+KFxuXHRcdGp3dE1vZHVsZUNvbmZpZ3VyYXRpb25Qcm92aWRlcjogSnd0TW9kdWxlQ29uZmlndXJhdGlvblByb3ZpZGVyLFxuXHRcdGp3dFJlZnJlc2hDb25maWd1cmF0aW9uUHJvdmlkZXI6IEp3dE1vZHVsZVJlZnJlc2hDb25maWd1cmF0aW9uUHJvdmlkZXI8XG5cdFx0XHRSZWZyZXNoUmVxdWVzdCxcblx0XHRcdFJlZnJlc2hSZXNwb25zZVxuXHRcdD4sXG5cdCk6IE1vZHVsZVdpdGhQcm92aWRlcnM8Snd0TW9kdWxlPjtcblx0cHVibGljIHN0YXRpYyBmb3JSb290PFJlZnJlc2hSZXF1ZXN0LCBSZWZyZXNoUmVzcG9uc2U+KFxuXHRcdGp3dE1vZHVsZUNvbmZpZ3VyYXRpb25Qcm92aWRlcjogSnd0TW9kdWxlQ29uZmlndXJhdGlvblByb3ZpZGVyLFxuXHRcdGp3dFJlZnJlc2hDb25maWd1cmF0aW9uUHJvdmlkZXI/OiBKd3RNb2R1bGVSZWZyZXNoQ29uZmlndXJhdGlvblByb3ZpZGVyPFxuXHRcdFx0UmVmcmVzaFJlcXVlc3QsXG5cdFx0XHRSZWZyZXNoUmVzcG9uc2Vcblx0XHQ+LFxuXHQpOiBNb2R1bGVXaXRoUHJvdmlkZXJzPEp3dE1vZHVsZT4ge1xuXHRcdHJldHVybiB7XG5cdFx0XHRuZ01vZHVsZTogSnd0TW9kdWxlLFxuXHRcdFx0cHJvdmlkZXJzOiBbXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRwcm92aWRlOiBIVFRQX0lOVEVSQ0VQVE9SUyxcblx0XHRcdFx0XHR1c2VDbGFzczogSnd0RXJyb3JIYW5kbGluZ0ludGVyY2VwdG9yLFxuXHRcdFx0XHRcdG11bHRpOiB0cnVlLFxuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0cHJvdmlkZTogSFRUUF9JTlRFUkNFUFRPUlMsXG5cdFx0XHRcdFx0dXNlQ2xhc3M6IEp3dEluamVjdG9ySW50ZXJjZXB0b3IsXG5cdFx0XHRcdFx0bXVsdGk6IHRydWUsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdHtcblx0XHRcdFx0XHRwcm92aWRlOiBERUZBVUxUX0pXVF9DT05GSUdVUkFUSU9OX1RPS0VOLFxuXHRcdFx0XHRcdHVzZVZhbHVlOiBERUZBVUxUX0pXVF9DT05GSUcsXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNyZWF0ZUp3dENvbmZpZ3VyYXRpb25Qcm92aWRlcihqd3RNb2R1bGVDb25maWd1cmF0aW9uUHJvdmlkZXIpLFxuXHRcdFx0XHQuLi4oand0UmVmcmVzaENvbmZpZ3VyYXRpb25Qcm92aWRlclxuXHRcdFx0XHRcdD8gW1xuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0cHJvdmlkZTogSFRUUF9JTlRFUkNFUFRPUlMsXG5cdFx0XHRcdFx0XHRcdFx0dXNlQ2xhc3M6IEp3dFJlZnJlc2hJbnRlcmNlcHRvcixcblx0XHRcdFx0XHRcdFx0XHRtdWx0aTogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHByb3ZpZGU6IERFRkFVTFRfSldUX1JFRlJFU0hfQ09ORklHVVJBVElPTl9UT0tFTixcblx0XHRcdFx0XHRcdFx0XHR1c2VWYWx1ZTogREVGQVVMVF9KV1RfUkVGUkVTSF9DT05GSUcsXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGNyZWF0ZUp3dFJlZnJlc2hDb25maWd1cmF0aW9uUHJvdmlkZXI8UmVmcmVzaFJlcXVlc3QsIFJlZnJlc2hSZXNwb25zZT4oXG5cdFx0XHRcdFx0XHRcdFx0and0UmVmcmVzaENvbmZpZ3VyYXRpb25Qcm92aWRlcixcblx0XHRcdFx0XHRcdFx0KSxcblx0XHRcdFx0XHRcdF1cblx0XHRcdFx0XHQ6IFtdKSxcblx0XHRcdF0sXG5cdFx0fTtcblx0fVxufVxuIl19