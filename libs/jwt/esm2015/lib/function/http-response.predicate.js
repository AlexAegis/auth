import { HttpEventType } from '@angular/common/http';
export function isHttpResponse(httpEvent) {
    return httpEvent.type === HttpEventType.Response;
}
//# sourceMappingURL=http-response.predicate.js.map