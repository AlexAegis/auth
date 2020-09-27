import { Observable } from 'rxjs';
/**
 * Returns a cold observable from a function, or returns an observable if
 * one is directly passed to it
 */
export declare function intoObservable<T>(getValue: T | Observable<T> | Promise<T> | (() => T | Promise<T> | Observable<T>)): Observable<T>;
