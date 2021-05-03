import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';

export const isHttpResponse = <T>(httpEvent: HttpEvent<T>): httpEvent is HttpResponse<T> =>
	httpEvent.type === HttpEventType.Response;
