import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class StateService {
	public readonly launchedRequestCount$ = new BehaviorSubject(0);
	public readonly refreshRequestCount$ = new BehaviorSubject(0);
	public readonly loginRequestCount$ = new BehaviorSubject(0);
	public readonly totalRequestCount$ = combineLatest([
		this.launchedRequestCount$,
		this.refreshRequestCount$,
		this.loginRequestCount$,
	]).pipe(
		map(
			([launchedRequestCount, refreshRequestCount, loginRequestCount]) =>
				launchedRequestCount + refreshRequestCount + loginRequestCount
		)
	);

	public readonly successfulResponseCount$ = new BehaviorSubject(0);
	public readonly failedResponseCount$ = new BehaviorSubject(0);
	public readonly totalResponseCount$ = combineLatest([
		this.successfulResponseCount$,
		this.failedResponseCount$,
	]).pipe(
		map(
			([successfulResponseCount, failedResponseCount]) =>
				successfulResponseCount + failedResponseCount
		)
	);
}
