import { BehaviorSubject } from 'rxjs';
export declare class JwtRefreshStateService {
    readonly refreshLock$: BehaviorSubject<boolean>;
}
