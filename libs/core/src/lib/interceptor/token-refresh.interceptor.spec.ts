import { TestBed } from '@angular/core/testing';
import { TokenRefreshInterceptor } from './token-refresh.interceptor';

describe('TokenRefreshInterceptor', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [TokenRefreshInterceptor],
		})
	);

	it('should be created', () => {
		const interceptor: TokenRefreshInterceptor = TestBed.inject(TokenRefreshInterceptor);
		expect(interceptor).toBeTruthy();
	});
});
