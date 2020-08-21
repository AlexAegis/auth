import { HttpRequest } from '@angular/common/http';

export class JwtError extends Error {
	public constructor(
		public readonly originalRequest: HttpRequest<unknown>,
		public readonly originalError: unknown
	) {
		super();
	}
}

/**
 * When both access and refresh tokens are either invalid or expired!
 */
export class JwtCannotRefreshError extends JwtError {}

/**
 * When refresh failed
 */
export class JwtCouldntRefreshError extends JwtError {}
