import { ConfigService } from '@aegis-auth/core';
import { JwtTokenService } from '@aegis-auth/jwt';
import { Component } from '@angular/core';

@Component({
	selector: 'aegis-auth-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent {
	title = 'jwt-demo';
	constructor(private readonly core: ConfigService, private readonly jwt: JwtTokenService) {}
}
