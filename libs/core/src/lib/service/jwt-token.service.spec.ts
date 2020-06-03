import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { AuthCoreModule } from '../auth-core.module';
import { AuthTokenConfiguration, DEFAULT_AUTH_TOKEN_CONFIG } from '../model';
import { AuthCoreModuleConfigurationService } from '../token';
import { JwtTokenService } from './jwt-token.service';

describe('JwtTokenService', () => {
	const validToken =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
	let service: JwtTokenService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [AuthCoreModule],
			providers: [
				{
					provide: AuthCoreModuleConfigurationService,
					useValue: {
						...DEFAULT_AUTH_TOKEN_CONFIG,
						type: 'NON OVERRIDDEN',
						getToken: () => validToken,
					} as AuthTokenConfiguration,
				},
			],
		});
	});

	it('should be created', () => {
		service = TestBed.inject(JwtTokenService);
		expect(service).toBeTruthy();
	});

	it('should be some', () => {
		service = TestBed.overrideProvider(AuthCoreModuleConfigurationService, {
			useValue: {
				getToken: () => validToken,
			} as AuthTokenConfiguration,
		}).inject(JwtTokenService);
		return service.token$
			.pipe(
				take(1),
				tap((token) => expect(token).toBeTruthy())
			)
			.toPromise();
	});

	it('should be invalid', () => {
		service = TestBed.overrideProvider(AuthCoreModuleConfigurationService, {
			useValue: {
				getToken: () => 'eyJw5c',
			} as AuthTokenConfiguration,
		}).inject(JwtTokenService);
		return service.token$
			.pipe(
				take(1),
				catchError(() => of(null)),
				tap((token) => expect(token).toBeFalsy())
			)
			.toPromise();
	});
});
