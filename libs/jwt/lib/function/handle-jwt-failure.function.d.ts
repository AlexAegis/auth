import { HttpParams } from '@angular/common/http';
import { Params, Router } from '@angular/router';
/**
 * Jwt failures are handled by either calling a callback or if its a string,
 * redirect
 *
 * @internal
 */
export declare function handleJwtFailure<E>(errorCallbackOrRedirect: string | ((error: E) => void), error: E, router?: Router, redirectParameters?: ((error: E) => HttpParams | Params) | HttpParams | Params): void;
