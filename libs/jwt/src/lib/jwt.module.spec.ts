import { TestBed } from '@angular/core/testing';
import { JwtModule } from './jwt.module';
import { JWT_REFRESH_CONFIGURATION_TOKEN } from './token';

describe('JwtModule', () => {
	it('should create without refresh config', () => {
		TestBed.configureTestingModule({
			imports: [JwtModule.forRoot({ useValue: {} })],
		}).compileComponents();
		expect(JwtModule).toBeDefined();
		expect(() => TestBed.inject(JWT_REFRESH_CONFIGURATION_TOKEN)).toThrow();
	});

	it('should create with refresh config', () => {
		TestBed.configureTestingModule({
			imports: [JwtModule.forRoot({ useValue: {} }, { useValue: {} })],
		}).compileComponents();
		expect(JwtModule).toBeDefined();
		const refreshConfig = TestBed.inject(JWT_REFRESH_CONFIGURATION_TOKEN);
		expect(refreshConfig).toBeTruthy();
	});
});
