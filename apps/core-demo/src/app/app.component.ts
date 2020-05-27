import { JwtTokenService } from '@aegis-auth/core';
import { Component } from '@angular/core';
import { AuthService } from './service/auth.service';

@Component({
	selector: 'aegis-auth-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'core-demo';

	token$ = this.jwtTokenService.token$;
	tokenString$ = this.jwtTokenService.tokenString$;

	public constructor(
		private readonly auth: AuthService,
		private readonly jwtTokenService: JwtTokenService
	) {
		console.log('AppComponent loaded!', jwtTokenService);
	}

	login(): void {
		console.log('Login!');
		this.auth.login();
	}
}
