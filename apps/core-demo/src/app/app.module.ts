import { AuthCoreModule } from '@aegis-auth/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AppComponent } from './app.component';
import { AuthService } from './service/auth.service';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		RouterModule.forRoot([], { initialNavigation: 'enabled' }),
		AuthCoreModule.forRoot<AuthService>({
			useFactory: (authService) => ({
				getToken: (): Observable<string> => authService.accessTokenStorage$,
			}),
			deps: [AuthService],
		}),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
