import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class JwtRefreshStateService {
	public readonly refreshLock$ = new BehaviorSubject(false);
}
