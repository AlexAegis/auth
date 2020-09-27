import { HttpEvent, HttpResponse } from '@angular/common/http';
export declare function isHttpResponse<T>(httpEvent: HttpEvent<T>): httpEvent is HttpResponse<T>;
