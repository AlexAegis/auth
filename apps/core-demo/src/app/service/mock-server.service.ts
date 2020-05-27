import { JwtTokenPair, JwtTokenPayload } from '@aegis-auth/token';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class MockServerService {
	private header = {
		alg: 'HS256',
		typ: 'JWT',
	};

	public getTokenPair(): JwtTokenPair {
		return {
			accessToken: this.createValidToken(),
			refreshToken: this.createValidToken(360),
		};
	}

	public createValidToken(lifetime = 60): string {
		return [
			this.toBase64(this.header),
			this.toBase64(this.createPayload(lifetime)),
			this.toBase64({}),
		].join('.');
	}

	private createPayload(lifetime = 60): JwtTokenPayload {
		const now = new Date().getTime() / 1000;
		return {
			sub: 'testtoken',
			iat: now,
			exp: now + lifetime,
			iss: 'mockservice',
		};
	}

	private toBase64(o: Record<string, unknown>) {
		return Base64.encode(JSON.stringify(o));
	}
}
