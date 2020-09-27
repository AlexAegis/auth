import { HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtRefreshConfiguration, JwtRefreshResponse } from '../model/auth-core-configuration.interface';
export declare function doJwtRefresh<Req, Res, Ret>(next: HttpHandler, requestBody: Req, jwtRefreshConfiguration: JwtRefreshConfiguration<Req, Res>, onError: (refreshError: unknown) => Observable<Ret>, originalAction: (refreshResponse: JwtRefreshResponse) => Observable<Ret>): Observable<Ret>;
