import { async, TestBed } from '@angular/core/testing';
import { JwtModule } from './jwt.module';

describe('JwtModule', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [JwtModule],
		}).compileComponents();
	}));

	it('should create', () => {
		expect(JwtModule).toBeDefined();
	});
});
