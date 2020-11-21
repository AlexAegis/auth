import { HttpParams } from '@angular/common/http';
import { Params, Router } from '@angular/router';
/**
 * Jwt failures are handled by either calling a callback or if its a string,
 * redirect
 *
 * @internal
 */
export declare const handleJwtFailure: <E>(errorCallbackOrRedirect: string | ((e: E) => void), error: E, router?: Router | undefined, redirectParameters?: HttpParams | Params | ((e: E) => HttpParams | Params) | undefined) => void;
