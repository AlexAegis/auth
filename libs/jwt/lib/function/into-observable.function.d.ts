import { Observable } from 'rxjs';
/**
 * Returns a cold observable from a function, or returns an observable if
 * one is directly passed to it
 */
export declare const intoObservable: <T>(getValue: T | Observable<T> | Promise<T> | (() => T | Observable<T> | Promise<T>)) => Observable<T>;
