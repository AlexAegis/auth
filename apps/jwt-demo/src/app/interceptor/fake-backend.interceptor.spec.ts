import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FakeBackendInterceptor } from './fake-backend.interceptor';

describe('FakeBackendInterceptor', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [HttpClientModule],
			providers: [FakeBackendInterceptor],
		}),
	);

	it('should be created', () => {
		const interceptor: FakeBackendInterceptor = TestBed.inject(FakeBackendInterceptor);
		expect(interceptor).toBeTruthy();
	});
});
