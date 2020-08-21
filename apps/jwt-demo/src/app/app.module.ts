import { JwtModule } from '@aegis-auth/jwt';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { BLACKLISTED_DOMAIN, JWT_HEADER, JWT_SCHEME, WHITELISTED_DOMAIN } from './constants';
import { FakeBackendInterceptor } from './interceptor/fake-backend.interceptor';
import { RefreshRequest, RefreshResponse } from './model';
import { DashboardComponent } from './page/dashboard.component';
import { AuthService } from './service';

@NgModule({
	declarations: [AppComponent, DashboardComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
		FormsModule,
		RouterModule.forRoot(
			[
				{
					path: '',
					component: DashboardComponent,
				},
			],
			{ initialNavigation: 'enabled' }
		),
		JwtModule.forRoot<RefreshRequest, RefreshResponse>(
			{
				useFactory: (authService: AuthService) => ({
					getToken: authService.accessTokenStorage$,
					// Same as the default: 'Bearer '
					scheme: JWT_SCHEME,
					// The default is 'Authorization' but here it's changed to it doesn't interfere
					header: JWT_HEADER,
					domainWhitelist: ['localhost', WHITELISTED_DOMAIN],
					domainBlacklist: [BLACKLISTED_DOMAIN],
					pathBlacklist: [/api\/something\/.*/],
					pathWhitelist: [/api\/users\/.*/],
					protocolBlacklist: environment.production ? ['http'] : undefined,
				}),
				deps: [AuthService],
			},
			{
				useFactory: (authService: AuthService) => ({
					getRefreshToken: authService.refreshTokenStorage$,
					setRefreshedTokens: (refreshResponse) => {
						authService.accessTokenStorage$.next(refreshResponse.accessToken);
						authService.refreshTokenStorage$.next(refreshResponse.refreshToken);
					},
					// endpoint to hit to refresh
					refreshUrl: `http://localhost/refresh`,
					// This is not needed here, it's just for reference, refreshUrl is already
					// excluded. But in case you do something fancy with your interceptors, having
					// explicit control over on what url will be refreshed and what not, is useful.
					pathBlacklist: [/refresh/],
					// The default is POST, but you can override
					method: 'POST',
					// The result of this will be passed to the initials object of HttpRequest
					createRefreshRequestBody: () => ({
						refreshToken: authService.refreshTokenStorage$.value,
						lifespan: 4,
					}), // Already has the correct shape, so it's just an identity function
					transformRefreshResponse: (response) => {
						console.log('transformRefreshResponse', response);
						return response;
					},
				}),
				deps: [AuthService],
			}
		),
	],
	providers: [
		{
			provide: HTTP_INTERCEPTORS,
			useClass: FakeBackendInterceptor,
			multi: true,
		},
	],
	bootstrap: [AppComponent],
})
export class AppModule {}
