import { TestBed } from '@angular/core/testing';
import { AuthStoreService } from './auth-store.service';

describe('AuthStoreService', () => {
	let service: AuthStoreService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(AuthStoreService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
