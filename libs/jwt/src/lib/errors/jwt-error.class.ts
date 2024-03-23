import { HttpErrorResponse, HttpRequest } from '@angular/common/http';

export class JwtError extends Error {
	static type = 'JWT_ERROR';

	public constructor(
		public readonly originalRequest: HttpRequest<unknown> | undefined,
		public readonly originalError: unknown,
		message = JwtError.type,
	) {
		super(message);
	}

	static createErrorResponse(
		request: HttpRequest<unknown> | undefined,
		refreshError: unknown,
	): HttpErrorResponse {
		return new HttpErrorResponse({
			error: JwtError.createErrorEvent(request, refreshError),
		});
	}

	static createErrorEvent(
		request: HttpRequest<unknown> | undefined,
		refreshError: unknown,
	): ErrorEvent {
		return new ErrorEvent(JwtError.type, {
			error: new JwtError(request, refreshError),
		});
	}
}

/**
 * When both access and refresh tokens are either invalid or expired!
 */
export class JwtCannotRefreshError extends JwtError {
	static type = 'JWT_CANNOT_REFRESH_ERROR';

	public constructor(
		public readonly originalRequest: HttpRequest<unknown> | undefined,
		public readonly originalError: unknown,
	) {
		super(originalRequest, originalError, JwtCannotRefreshError.type);
	}

	static createErrorResponse(
		request: HttpRequest<unknown> | undefined,
		refreshError: unknown,
	): HttpErrorResponse {
		return new HttpErrorResponse({
			error: JwtCannotRefreshError.createErrorEvent(request, refreshError),
		});
	}

	static createErrorEvent(
		request: HttpRequest<unknown> | undefined,
		refreshError: unknown,
	): ErrorEvent {
		return new ErrorEvent(JwtCannotRefreshError.type, {
			error: new JwtCannotRefreshError(request, refreshError),
		});
	}
}

/**
 * When refresh failed
 */
export class JwtCouldntRefreshError extends JwtError {
	static type = 'JWT_COULDNT_REFRESH_ERROR';

	public constructor(
		public readonly originalRequest: HttpRequest<unknown> | undefined,
		public readonly originalError: unknown,
	) {
		super(originalRequest, originalError, JwtCouldntRefreshError.type);
	}

	static createErrorResponse(
		request: HttpRequest<unknown> | undefined,
		refreshError: unknown,
	): HttpErrorResponse {
		return new HttpErrorResponse({
			error: JwtCouldntRefreshError.createErrorEvent(request, refreshError),
		});
	}

	static createErrorEvent(
		request: HttpRequest<unknown> | undefined,
		refreshError: unknown,
	): ErrorEvent {
		return new ErrorEvent(JwtCouldntRefreshError.type, {
			error: new JwtCouldntRefreshError(request, refreshError),
		});
	}
}
