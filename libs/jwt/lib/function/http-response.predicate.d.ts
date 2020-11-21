import { HttpEvent, HttpResponse } from '@angular/common/http';
export declare const isHttpResponse: <T>(httpEvent: HttpEvent<T>) => httpEvent is HttpResponse<T>;
