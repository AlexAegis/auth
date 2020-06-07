/*import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { JwtTokenService } from './jwt-token.service';
import { JwtModule } from '../jwt.module';

describe('JwtTokenService', () => {
	const validToken =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
	let service: JwtTokenService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [JwtModule],
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
*/
