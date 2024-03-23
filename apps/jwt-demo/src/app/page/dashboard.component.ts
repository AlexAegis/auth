import { JwtRefreshStateService, JwtTokenService } from '@aegis-auth/jwt';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs/operators';
// TODO: Remove this ignore once this lands: https://github.com/typescript-eslint/typescript-eslint/issues/2972
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Claims } from '../model/claims.interface';
import { ApiService } from '../service';
import { AuthService } from '../service/auth.service';
import { StateService } from '../service/state.service';

@Component({
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
	public title = 'jwt-demo';

	public tokenString$ = this.jwtTokenService.rawAccessToken$;

	public usernameFromToken$ = this.jwtTokenService.accessToken$.pipe(
		map((token) => token?.payload.username),
	);

	public defaultLifespan = 5;

	public lifespan: number | undefined;

	public isAccessTokenExpired$ = this.jwtTokenService.isAccessTokenExpired$;

	public isRefreshTokenExpired$ = this.jwtTokenService.isRefreshTokenExpired$;

	public constructor(
		private readonly auth: AuthService,
		public readonly api: ApiService,
		public readonly state: StateService,
		public readonly jwtRefreshState: JwtRefreshStateService,
		public readonly jwtTokenService: JwtTokenService<Claims>,
	) {}

	public login(): void {
		this.auth.login(this.lifespan || this.defaultLifespan).subscribe();
	}

	public logout(): void {
		this.auth.logout().subscribe();
	}

	public requestWhitelistedPathOnWhitelistedDomain(): void {
		this.api.requestWhitelistedPathOnWhitelistedDomain().subscribe();
	}

	public requestBlacklistedPathOnWhitelistedDomain(): void {
		this.api.requestBlacklistedPathOnWhitelistedDomain().subscribe();
	}

	public requestOnBlacklistedDomain(): void {
		this.api.requestOnBlacklistedDomain().subscribe();
	}

	public customGet(url: string): void {
		this.api.customGet(url).subscribe();
	}
}
