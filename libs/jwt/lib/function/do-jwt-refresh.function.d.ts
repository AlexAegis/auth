import { HttpHandler } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { JwtRefreshConfiguration, JwtRefreshResponse } from '../model/auth-core-configuration.interface';
export declare const doJwtRefresh: <Req, Res, Ret>(next: HttpHandler, requestBody: Req, jwtRefreshConfiguration: JwtRefreshConfiguration<Req, Res>, refreshLock: BehaviorSubject<boolean>, onError: (refreshError: unknown) => Observable<Ret>, originalAction: (refreshResponse: JwtRefreshResponse) => Observable<Ret>) => Observable<Ret>;
