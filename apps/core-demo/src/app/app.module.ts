import { AuthCoreModule } from '@aegis-auth/core';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { BLACKLISTED_DOMAIN, WHITELISTED_DOMAIN } from './helper';
import { AuthService } from './service/auth.service';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
		RouterModule.forRoot([], { initialNavigation: 'enabled' }),
		AuthCoreModule.forRoot<AuthService>({
			useFactory: (authService) => ({
				getToken: authService.accessTokenStorage$,
				domainWhitelist: ['localhost', WHITELISTED_DOMAIN],
				domainBlacklist: [BLACKLISTED_DOMAIN],
				pathBlacklist: [/api\/something\/.*/],
				pathWhitelist: [/api\/users\/.*/],
				protocolBlacklist: environment.production ? ['http'] : undefined,
			}),
			deps: [AuthService],
		}),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
