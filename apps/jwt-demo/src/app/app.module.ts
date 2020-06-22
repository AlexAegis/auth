import { JwtModule } from '@aegis-auth/jwt';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { map } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { BLACKLISTED_DOMAIN, WHITELISTED_DOMAIN } from './helper';
import { FakeBackendInterceptor } from './interceptor/fake-backend.interceptor';
import { DashboardComponent } from './page/dashboard.component';
import { AuthService } from './service';

@NgModule({
	declarations: [AppComponent, DashboardComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
		RouterModule.forRoot(
			[
				{
					path: '',
					component: DashboardComponent,
				},
			],
			{ initialNavigation: 'enabled' }
		),
		JwtModule.forRoot<AuthService>({
			useFactory: (authService) => ({
				getToken: authService.accessTokenStorage$,
				domainWhitelist: ['localhost', WHITELISTED_DOMAIN],
				domainBlacklist: [BLACKLISTED_DOMAIN],
				pathBlacklist: [/api\/something\/.*/],
				pathWhitelist: [/api\/users\/.*/],
				protocolBlacklist: environment.production ? ['http'] : undefined,
				autoRefresher: {
					getRefreshToken$: authService.refreshTokenStorage$,
					setRefreshToken: (refreshToken) =>
						authService.refreshTokenStorage$.next(refreshToken),
					refresh: () =>
						authService.login().pipe(
							map((res) => {
								return {
									accessToken: res.accessToken,
									refreshToken: res.refreshToken,
								};
							})
						),
				},
			}),
			deps: [AuthService],
		}),
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
