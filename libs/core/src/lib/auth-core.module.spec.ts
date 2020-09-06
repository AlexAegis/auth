import { TestBed } from '@angular/core/testing';
import { AuthCoreModule } from './auth-core.module';

describe('AuthCoreModule', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [AuthCoreModule],
		}).compileComponents();
	});

	it('should create', () => expect(AuthCoreModule).toBeDefined());
});
