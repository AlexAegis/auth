import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { JwtModule } from '../jwt.module';
import { DEFAULT_JWT_CONFIG } from '../model';
import {
	DEFAULT_JWT_CONFIGURATION_TOKEN,
	JwtConfigurationProvider,
	JWT_CONFIGURATION_TOKEN,
} from '../token';
import { JwtTokenService } from './jwt-token.service';

describe('JwtTokenService', () => {
	const validToken =
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
	let service: JwtTokenService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [JwtModule],
			providers: [
				{
					provide: DEFAULT_JWT_CONFIGURATION_TOKEN,
					useValue: DEFAULT_JWT_CONFIG,
				},
				{
					provide: JWT_CONFIGURATION_TOKEN,
					useValue: {
						getToken: () => validToken,
					},
				} as JwtConfigurationProvider,
			],
		});
	});

	it('should be created', () => {
		service = TestBed.inject(JwtTokenService);
		expect(service).toBeTruthy();
	});

	it('should be some', () => {
		service = TestBed.overrideProvider(JWT_CONFIGURATION_TOKEN, {
			useValue: {
				getToken: () => validToken,
			},
		} as JwtConfigurationProvider).inject(JwtTokenService);
		return service.token$
			.pipe(
				take(1),
				tap((token) => expect(token).toBeTruthy())
			)
			.toPromise();
	});

	it('should be invalid', () => {
		service = TestBed.overrideProvider(JWT_CONFIGURATION_TOKEN, {
			useValue: {
				getToken: () => 'eyJw5c',
			},
		} as JwtConfigurationProvider).inject(JwtTokenService);
		return service.token$
			.pipe(
				take(1),
				catchError(() => of(null)),
				tap((token) => expect(token).toBeFalsy())
			)
			.toPromise();
	});
});
