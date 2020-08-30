import { HttpRequest } from '@angular/common/http';
import { JwtCannotRefreshError, JwtCouldntRefreshError, JwtError } from './jwt-error.class';

describe('JwtError', () => {
	it('should be creatable', () => {
		expect(new JwtError(new HttpRequest('GET', ''), '')).toBeTruthy();
	});
});

describe('JwtCannotRefreshError', () => {
	it('should be creatable', () => {
		expect(new JwtCannotRefreshError(new HttpRequest('GET', ''), '')).toBeTruthy();
	});
});

describe('JwtCouldntRefreshError', () => {
	it('should be creatable', () => {
		expect(new JwtCouldntRefreshError(new HttpRequest('GET', ''), '')).toBeTruthy();
	});
});
