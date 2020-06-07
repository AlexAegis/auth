import { TestBed } from '@angular/core/testing';
import { JwtRefreshInterceptor } from './jwt-refresh.interceptor';

describe('JwtRefreshInterceptor', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [JwtRefreshInterceptor],
		})
	);

	it('should be created', () => {
		const interceptor: JwtRefreshInterceptor = TestBed.inject(JwtRefreshInterceptor);
		expect(interceptor).toBeTruthy();
	});
});
