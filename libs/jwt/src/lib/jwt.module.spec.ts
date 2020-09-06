import { HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { JwtInjectorInterceptor } from './interceptor/jwt-injector.interceptor';
import { JwtRefreshInterceptor } from './interceptor/jwt-refresh.interceptor';
import { JwtModule } from './jwt.module';
import { JwtConfiguration } from './model/auth-core-configuration.interface';
import {
	JWT_CONFIGURATION_TOKEN,
	JWT_REFRESH_CONFIGURATION_TOKEN,
} from './token/jwt-configuration.token';

describe('JwtModule', () => {
	it('should create without refresh config', async () => {
		await TestBed.configureTestingModule({
			imports: [JwtModule.forRoot({ useValue: {} })],
		}).compileComponents();
		expect(JwtModule).toBeDefined();
		const jwtConfig: JwtConfiguration = TestBed.get(JWT_CONFIGURATION_TOKEN);
		expect(jwtConfig).toBeTruthy();
		const interceptors: HttpInterceptor[] = TestBed.get(HTTP_INTERCEPTORS);
		const jwtInterceptor = interceptors.find((i) => i instanceof JwtInjectorInterceptor);
		expect(jwtInterceptor).toBeTruthy();
		const jwtRefreshInterceptor = interceptors.find((i) => i instanceof JwtRefreshInterceptor);
		expect(jwtRefreshInterceptor).toBeFalsy();
		expect(() => TestBed.get(JWT_REFRESH_CONFIGURATION_TOKEN)).toThrow();
	});

	it('should create with refresh config', async () => {
		await TestBed.configureTestingModule({
			imports: [JwtModule.forRoot({ useValue: {} }, { useValue: {} })],
		}).compileComponents();
		expect(JwtModule).toBeDefined();
		const jwtConfig: JwtConfiguration = TestBed.get(JWT_CONFIGURATION_TOKEN);
		expect(jwtConfig).toBeTruthy();
		const interceptors: HttpInterceptor[] = TestBed.get(HTTP_INTERCEPTORS);
		const jwtInterceptor = interceptors.find((i) => i instanceof JwtInjectorInterceptor);
		expect(jwtInterceptor).toBeTruthy();
		const jwtRefreshInterceptor = interceptors.find((i) => i instanceof JwtRefreshInterceptor);
		expect(jwtRefreshInterceptor).toBeTruthy();
		const refreshConfig = TestBed.get(JWT_REFRESH_CONFIGURATION_TOKEN);
		expect(refreshConfig).toBeTruthy();
	});

	afterEach(() => TestBed.resetTestingModule());
});
