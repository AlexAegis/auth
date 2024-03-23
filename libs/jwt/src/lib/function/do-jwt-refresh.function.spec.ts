import { HttpClientModule, HttpErrorResponse, HttpHandler } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { BehaviorSubject, Observer, of } from 'rxjs';
import { JwtRefreshConfiguration } from '../model/auth-core-configuration.interface';
import { JwtRefreshStateService } from '../service/jwt-refresh-state.service';
import { doJwtRefresh } from './do-jwt-refresh.function';

describe('doJwtRefresh', () => {
	const mockTransformRefreshResponse = jest.fn();
	const mockSetRefreshedTokens = jest.fn();
	const jwtRefreshConfig = {
		refreshUrl: 'refresh',
		transformRefreshResponse: mockTransformRefreshResponse,
		setRefreshedTokens: mockSetRefreshedTokens,
	} as unknown as JwtRefreshConfiguration<unknown, unknown>;

	const mockOriginalAction = jest.fn();
	const mockOnError = jest.fn();
	const requestBody = {};

	const mockObserver: Observer<unknown> = {
		next: jest.fn(),
		error: jest.fn(),
		complete: jest.fn(),
	};

	let jwtRefreshStateService: JwtRefreshStateService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule, HttpClientTestingModule],
			providers: [
				{
					provide: JwtRefreshStateService,
					useValue: {
						refreshLock$: new BehaviorSubject(false),
					} as JwtRefreshStateService,
				},
			],
		});
	});

	afterEach(() => jest.clearAllMocks());
	afterEach(inject([HttpTestingController], (htc: HttpTestingController) => htc.verify()));

	it('should call onError and continue with the result of that when the request fails', () => {
		const httpHandler = TestBed.inject(HttpHandler);
		const httpTestingController = TestBed.inject(HttpTestingController);
		jwtRefreshStateService = TestBed.inject(JwtRefreshStateService);
		const fallback = 'fallback';
		const errorEvent = new ErrorEvent('error');

		mockOnError.mockImplementationOnce((errorResponse: HttpErrorResponse) => {
			expect(errorResponse.error).toBe(errorEvent);
			return of(fallback);
		});

		doJwtRefresh(
			httpHandler,
			requestBody,
			jwtRefreshConfig,
			jwtRefreshStateService.refreshLock$,
			mockOnError,
			mockOriginalAction,
		).subscribe(mockObserver);

		const mockRequest = httpTestingController.expectOne(jwtRefreshConfig.refreshUrl);
		mockRequest.error(errorEvent);

		expect(mockTransformRefreshResponse).toHaveBeenCalledTimes(0);
		expect(mockSetRefreshedTokens).toHaveBeenCalledTimes(0);
		expect(mockOriginalAction).toHaveBeenCalledTimes(0);
		expect(mockOnError).toHaveBeenCalledTimes(1);
		expect(mockObserver.next).toHaveBeenCalledTimes(1);
		expect(mockObserver.next).toHaveBeenCalledWith(fallback);
		expect(mockObserver.error).toHaveBeenCalledTimes(0);
		expect(mockObserver.complete).toHaveBeenCalledTimes(1);
	});

	it('should call return with the result of the original action when the refresh succeeds', () => {
		const httpHandler = TestBed.inject(HttpHandler);
		const httpTestingController = TestBed.inject(HttpTestingController);
		jwtRefreshStateService = TestBed.inject(JwtRefreshStateService);
		const token = 'token';
		const returnValue = 'returnValue';

		mockTransformRefreshResponse.mockReturnValueOnce(token);
		mockOriginalAction.mockReturnValueOnce(of(returnValue));

		doJwtRefresh(
			httpHandler,
			requestBody,
			jwtRefreshConfig,
			jwtRefreshStateService.refreshLock$,
			mockOnError,
			mockOriginalAction,
		).subscribe(mockObserver);

		const mockRequest = httpTestingController.expectOne(jwtRefreshConfig.refreshUrl);
		mockRequest.flush({ token });

		expect(mockTransformRefreshResponse).toHaveBeenCalledTimes(1);
		expect(mockSetRefreshedTokens).toHaveBeenCalledTimes(1);
		expect(mockSetRefreshedTokens).toHaveBeenCalledWith(token);
		expect(mockOriginalAction).toHaveBeenCalledTimes(1);
		expect(mockOnError).toHaveBeenCalledTimes(0);
		expect(mockObserver.next).toHaveBeenCalledTimes(1);
		expect(mockObserver.next).toHaveBeenCalledWith(returnValue);
		expect(mockObserver.error).toHaveBeenCalledTimes(0);
		expect(mockObserver.complete).toHaveBeenCalledTimes(1);
	});

	it('does set the refreshlock when starting and then unsets if when finished', async () => {
		const httpHandler = TestBed.inject(HttpHandler);
		const httpTestingController = TestBed.inject(HttpTestingController);

		jwtRefreshStateService = TestBed.inject(JwtRefreshStateService);
		const token = 'token';
		const returnValue = 'returnValue';

		mockTransformRefreshResponse.mockReturnValueOnce(token);
		mockOriginalAction.mockReturnValueOnce(of(returnValue));
		const lockSpy = jest.spyOn(jwtRefreshStateService.refreshLock$, 'next');

		expect(jwtRefreshStateService.refreshLock$.value).toBe(false);
		const doJwtRefreshObservable = doJwtRefresh(
			httpHandler,
			requestBody,
			jwtRefreshConfig,
			jwtRefreshStateService.refreshLock$,
			mockOnError,
			mockOriginalAction,
		);
		expect(lockSpy).toHaveBeenLastCalledWith(true);
		doJwtRefreshObservable.subscribe();
		const mockRequest = httpTestingController.expectOne(jwtRefreshConfig.refreshUrl);
		mockRequest.flush({ token });
		expect(lockSpy).toHaveBeenCalledTimes(2);
		expect(lockSpy).toHaveBeenLastCalledWith(false);
	});
});
