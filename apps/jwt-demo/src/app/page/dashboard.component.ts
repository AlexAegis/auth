import { BaseDirective, JwtTokenService } from '@aegis-auth/jwt';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Claims } from '../model/claims.interface';
import { ApiService } from '../service';
import { AuthService } from '../service/auth.service';

@Component({
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent extends BaseDirective {
	public title = 'jwt-demo';

	public token$ = this.jwtTokenService.accessToken$;
	public tokenString$ = this.jwtTokenService.rawAccessToken$;

	public usernameFromToken$ = this.token$.pipe(map((token) => token && token.payload.username));

	public defaultLifespan = 5;

	public lifespan: number | undefined;

	public constructor(
		private readonly auth: AuthService,
		public readonly api: ApiService,
		private readonly jwtTokenService: JwtTokenService<Claims>
	) {
		super();
	}

	public login(): void {
		this.teardown = this.auth.login(this.lifespan || this.defaultLifespan).subscribe();
	}

	public logout(): void {
		this.teardown = this.auth.logout().subscribe();
	}
}
