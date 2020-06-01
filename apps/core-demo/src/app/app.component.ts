import { JwtTokenService } from '@aegis-auth/core';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { BaseDirective } from './component';
import {
	BLACKLISTED_DOMAIN,
	BLACKLISTED_PATH,
	BLACKLISTED_PROTOCOL,
	WHITELISTED_DOMAIN,
	WHITELISTED_PATH,
	WHITELISTED_PROTOCOL,
} from './helper';
import { AuthService } from './service/auth.service';

@Component({
	selector: 'aegis-auth-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends BaseDirective {
	public title = 'core-demo';

	public token$ = this.jwtTokenService.token$;
	public tokenString$ = this.jwtTokenService.tokenString$;

	@ViewChild('lifespan')
	public readonly lifespanInput!: ElementRef<HTMLInputElement>;

	@ViewChild('urlInput')
	public readonly urlInput!: ElementRef<HTMLInputElement>;

	public constructor(
		private readonly auth: AuthService,
		private readonly http: HttpClient,
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

	public requestWhitelistedPathOnWhitelistedDomain(): void {
		this.teardown = this.http
			.get<unknown>(`${WHITELISTED_PROTOCOL}://${WHITELISTED_DOMAIN}/${WHITELISTED_PATH}`)
			.subscribe();
	}

	public requestBlacklistedPathOnWhitelistedDomain(): void {
		this.teardown = this.http
			.get<unknown>(`${WHITELISTED_PROTOCOL}://${WHITELISTED_DOMAIN}/${BLACKLISTED_PATH}`)
			.subscribe();
	}

	public requestOnBlacklistedDomain(): void {
		this.teardown = this.http
			.get<unknown>(`${BLACKLISTED_PROTOCOL}://${BLACKLISTED_DOMAIN}/api/v1/employees`)
			.subscribe();
	}

	public customGet(): void {
		this.teardown = this.http.get<unknown>(this.lifespanInput.nativeElement.value).subscribe();
	}
}
