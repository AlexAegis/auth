import { BaseDirective, JwtTokenService } from '@aegis-auth/jwt';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { interval } from 'rxjs';
import { map, mergeMapTo } from 'rxjs/operators';
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

	public tokenString$ = this.jwtTokenService.rawAccessToken$;

	public usernameFromToken$ = this.jwtTokenService.accessToken$.pipe(
		map((token) => token && token.payload.username)
	);

	public defaultLifespan = 5;

	public lifespan: number | undefined;

	public isAccessTokenExpired$ = interval(1000).pipe(
		mergeMapTo(this.jwtTokenService.isAccessTokenExpired$)
	);
	public isRefreshTokenExpired$ = interval(1000).pipe(
		mergeMapTo(this.jwtTokenService.isRefreshTokenExpired$)
	);

	public constructor(
		private readonly auth: AuthService,
		public readonly api: ApiService,
		public readonly jwtTokenService: JwtTokenService<Claims>
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
