import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
export class ApiService {
	public constructor(private readonly http: HttpClient) {}

	public requestWhitelistedPathOnWhitelistedDomain(): Observable<unknown> {
		return this.http.get<unknown>(
			`${WHITELISTED_PROTOCOL}://${WHITELISTED_DOMAIN}/${WHITELISTED_PATH}`
		);
	}

	public requestBlacklistedPathOnWhitelistedDomain(): Observable<unknown> {
		return this.http.get<unknown>(
			`${WHITELISTED_PROTOCOL}://${WHITELISTED_DOMAIN}/${BLACKLISTED_PATH}`
		);
	}

	public requestOnBlacklistedDomain(): Observable<unknown> {
		return this.http.get<unknown>(
			`${BLACKLISTED_PROTOCOL}://${BLACKLISTED_DOMAIN}/api/v1/employees`
		);
	}

	public customGet(url: string): Observable<unknown> {
		return this.http.get<unknown>(url);
	}
}
