import { TestBed } from '@angular/core/testing';
import { TokenInjectorInterceptor } from './token-injector.interceptor';

describe('TokenInjectorInterceptor', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			providers: [TokenInjectorInterceptor],
		})
	);

	it('should be created', () => {
		const interceptor: TokenInjectorInterceptor = TestBed.inject(TokenInjectorInterceptor);
		expect(interceptor).toBeTruthy();
	});
});
