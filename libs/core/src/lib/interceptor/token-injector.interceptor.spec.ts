import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthTokenConfiguration, TypedValueProvider } from '../model';
import { AuthCoreModuleConfigurationService } from '../token';
import { TokenInjectorInterceptor } from './token-injector.interceptor';

describe('TokenInjectorInterceptor', () => {
	let http: HttpTestingController;
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			providers: [
				TokenInjectorInterceptor,
				{
					provide: AuthCoreModuleConfigurationService,
					useValue: {
						getToken: () => 'fakeToken',
					},
				} as TypedValueProvider<AuthTokenConfiguration>,
			],
		});

		http = TestBed.inject(HttpTestingController);
	});

	it('should be created', () => {
		const interceptor: TokenInjectorInterceptor = TestBed.inject(TokenInjectorInterceptor);
		expect(interceptor).toBeTruthy();
	});

	it('should be TODO', () => {
		const interceptor: TokenInjectorInterceptor = TestBed.inject(TokenInjectorInterceptor);

		expect(interceptor).toBeTruthy();
	});

	afterEach(() => {
		http.verify();
	});
});
