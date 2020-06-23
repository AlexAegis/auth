import { BaseDirective } from '@aegis-auth/jwt';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
	BLACKLISTED_DOMAIN,
	BLACKLISTED_PATH,
	BLACKLISTED_PROTOCOL,
	WHITELISTED_DOMAIN,
	WHITELISTED_PATH,
	WHITELISTED_PROTOCOL,
} from '../constants';

@Injectable({
	providedIn: 'root',
})
export class ApiService extends BaseDirective {
	public constructor(private readonly http: HttpClient) {
		super();
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

	public customGet(url: string): void {
		this.teardown = this.http.get<unknown>(url).subscribe();
	}
}
