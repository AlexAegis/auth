import { TestBed } from '@angular/core/testing';
import { MockServerService } from './mock-server.service';

describe('MockServerService', () => {
	let service: MockServerService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.get(MockServerService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
