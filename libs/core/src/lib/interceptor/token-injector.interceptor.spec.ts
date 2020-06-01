import { TestBed } from '@angular/core/testing';
import { AuthConfiguration, TypedValueProvider } from '../model';
import { AuthCoreModuleConfigurationService } from '../token';
import { TokenInjectorInterceptor } from './token-injector.interceptor';

describe('TokenInjectorInterceptor', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [],
			providers: [
				TokenInjectorInterceptor,
				{
					provide: AuthCoreModuleConfigurationService,
					useValue: {
						getToken: () => 'fakeToken',
					},
				} as TypedValueProvider<AuthConfiguration>,
			],
		})
	);

	it('should be created', () => {
		const interceptor: TokenInjectorInterceptor = TestBed.inject(TokenInjectorInterceptor);
		expect(interceptor).toBeTruthy();
	});
});
