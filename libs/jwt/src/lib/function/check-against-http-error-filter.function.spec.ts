import { HttpErrorResponse } from '@angular/common/http';
import { checkAgainstHttpErrorFilter } from './check-against-http-error-filter.function';

describe('checkAgainstHttpErrorFilter', () => {
	const HTTP_OK = 200;
	const HTTP_UNAUTHORIZED = 401;
	const HTTP_FORBIDDEN = 403;
	const unauthorizedErrorResponse = new HttpErrorResponse({ status: HTTP_UNAUTHORIZED });
	const forbiddenErrorResponse = new HttpErrorResponse({ status: HTTP_FORBIDDEN });
	it('can pass without any rules', () =>
		expect(checkAgainstHttpErrorFilter({}, unauthorizedErrorResponse)).toBeTruthy());

	it('can not pass with a whitelist rule that is not including the status', () =>
		expect(
			checkAgainstHttpErrorFilter(
				{ errorCodeWhitelist: [HTTP_OK] },
				unauthorizedErrorResponse
			)
		).toBeFalsy());

	it('can not pass with a blacklist errorCode rule that is including the status', () =>
		expect(
			checkAgainstHttpErrorFilter(
				{ errorCodeBlacklist: [HTTP_FORBIDDEN] },
				forbiddenErrorResponse
			)
		).toBeFalsy());

	it('can not pass with a blacklist errorCode rule that is including the status, even if it is also whitelisted', () =>
		expect(
			checkAgainstHttpErrorFilter(
				{ errorCodeBlacklist: [HTTP_FORBIDDEN], errorCodeWhitelist: [HTTP_FORBIDDEN] },
				forbiddenErrorResponse
			)
		).toBeFalsy());
});
