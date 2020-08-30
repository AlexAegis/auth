import { HttpEventType, HttpResponse, HttpSentEvent } from '@angular/common/http';
import { isHttpResponse } from './http-response.predicate';

describe('isHttpResponse', () => {
	const httpSentEvent: HttpSentEvent = {
		type: HttpEventType.Sent,
	};

	it('can recognize a response', () => expect(isHttpResponse(new HttpResponse())).toBeTruthy());
	it('can recognize a sent event as not a response', () =>
		expect(isHttpResponse(httpSentEvent)).toBeFalsy());
});
