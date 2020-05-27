import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import {
	AuthConfiguration,
	AuthCoreModule,
	AuthCoreModuleConfigurationService,
} from '../auth-core.module';
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
						type: 'NON OVERRIDDEN',
						getToken: () => validToken,
					} as AuthConfiguration,
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
			} as AuthConfiguration,
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
			} as AuthConfiguration,
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
