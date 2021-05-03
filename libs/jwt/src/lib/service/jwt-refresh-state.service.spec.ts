import { TestBed } from '@angular/core/testing';
import { JwtModule } from '../jwt.module';
import { JwtRefreshStateService } from './jwt-refresh-state.service';

describe('JwtRefreshStateService', () => {
	let service: JwtRefreshStateService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [JwtModule],
			providers: [],
		});
	});

	it('should be created with an unlocked refreshLock', () => {
		service = TestBed.inject(JwtRefreshStateService);
		expect(service).toBeTruthy();
		expect(service.refreshLock$.value).toBeFalsy();
	});
});
