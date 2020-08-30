import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';

export function isHttpResponse<T>(httpEvent: HttpEvent<T>): httpEvent is HttpResponse<T> {
	return httpEvent.type === HttpEventType.Response;
}
