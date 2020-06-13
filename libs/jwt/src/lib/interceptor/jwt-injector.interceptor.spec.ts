import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { JwtModule } from '../jwt.module';
import { JwtInjectorInterceptor } from './jwt-injector.interceptor';

describe('TokenInjectorInterceptor', () => {
	let http: HttpTestingController;
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientModule,
				HttpClientTestingModule,
				JwtModule.forRoot({
					useValue: {
						getToken: () => 'asd',
					},
				}),
			],
			providers: [],
		});

		http = TestBed.inject(HttpTestingController);
	});

	it('should be created', () => {
		const interceptors = TestBed.inject(HTTP_INTERCEPTORS);
		const jwtInterceptor = interceptors.find((i) => i instanceof JwtInjectorInterceptor);
		expect(jwtInterceptor).toBeTruthy();
	});

	it('should be TODO', () => {
		const interceptors = TestBed.inject(HTTP_INTERCEPTORS);
		const jwtInterceptor = interceptors.find((i) => i instanceof JwtInjectorInterceptor);
		expect(jwtInterceptor).toBeTruthy();
	});
	afterEach(() => {
		http.verify();
	});
});
