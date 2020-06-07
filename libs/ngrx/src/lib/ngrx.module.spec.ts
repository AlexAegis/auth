import { async, TestBed } from '@angular/core/testing';
import { NgrxModule } from './ngrx.module';

describe('NgrxModule', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [NgrxModule],
		}).compileComponents();
	}));

	it('should create', () => {
		expect(NgrxModule).toBeDefined();
	});
});
