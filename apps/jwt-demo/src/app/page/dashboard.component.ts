import { BaseDirective, JwtTokenService } from '@aegis-auth/jwt';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
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

	@ViewChild('lifespan')
	public readonly lifespanInput!: ElementRef<HTMLInputElement>;

	public constructor(
		private readonly auth: AuthService,
		public readonly api: ApiService,
		private readonly jwtTokenService: JwtTokenService
	) {
		super();
	}

	public login(): void {
		this.teardown = this.auth
			.login(parseInt(this.lifespanInput.nativeElement.value || '60', 10))
			.subscribe();
	}

	public logout(): void {
		this.teardown = this.auth.logout().subscribe();
	}
}
