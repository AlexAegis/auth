import { JwtTokenPair, JwtTokenPayload } from '@aegis-auth/jwt';
import { Injectable } from '@angular/core';
import { Base64 } from 'js-base64';
import { Claims } from '../model';

@Injectable({
	providedIn: 'root',
})
export class MockServerService {
	private header = {
		alg: 'HS256',
		typ: 'JWT',
	};

	/**
	 * Refresh tokens lifetime will be twice that the access's
	 *
	 * @param lifetime seconds
	 */
	public getTokenPair(lifetime = 60): JwtTokenPair {
		return {
			accessToken: this.createValidToken(lifetime),
			refreshToken: this.createValidToken(lifetime * 3),
		};
	}

	/**
	 * This token is not actually signed, it's for demonstration only.
	 *
	 * @param lifetime seconds
	 */
	public createValidToken(lifetime = 60): string {
		return [
			this.toBase64(this.header),
			this.toBase64(this.createPayload(lifetime)),
			this.toBase64({}),
		].join('.');
	}

	/**
	 *
	 * @param lifetime seconds
	 */
	private createPayload(lifetime = 60): JwtTokenPayload & Claims {
		const now = Math.floor(new Date().getTime() / 1000);
		return {
			sub: 'testtoken',
			iat: now,
			exp: now + lifetime,
			iss: 'mockservice',
			username: 'testuser',
			privilegeLevel: 3,
		};
	}

	private toBase64(o: unknown): string {
		return Base64.encode(JSON.stringify(o), true);
	}
}
