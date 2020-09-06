import { TestBed } from '@angular/core/testing';
import { NgrxModule } from './ngrx.module';

describe('NgrxModule', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NgrxModule],
		}).compileComponents();
	});

	it('should create', () => expect(NgrxModule).toBeDefined());
});
