import { HttpRequest } from '@angular/common/http';
import { JwtCannotRefreshError, JwtCouldntRefreshError, JwtError } from './jwt-error.class';

const REQUEST = new HttpRequest('GET', '');

describe('JwtError', () => {
	it('should be creatable', () => {
		expect(new JwtError(REQUEST, '')).toBeTruthy();
		expect(JwtError.createErrorResponse(REQUEST, '')).toBeTruthy();
	});
});

describe('JwtCannotRefreshError', () => {
	it('should be creatable', () => {
		expect(new JwtCannotRefreshError(new HttpRequest('GET', ''), '')).toBeTruthy();
		expect(JwtCannotRefreshError.createErrorResponse(REQUEST, '')).toBeTruthy();
	});
});

describe('JwtCouldntRefreshError', () => {
	it('should be creatable', () => {
		expect(new JwtCouldntRefreshError(new HttpRequest('GET', ''), '')).toBeTruthy();
		expect(JwtCouldntRefreshError.createErrorResponse(REQUEST, '')).toBeTruthy();
	});
});
