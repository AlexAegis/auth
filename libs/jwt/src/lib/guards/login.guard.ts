import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	CanActivateChild,
	CanLoad,
	Route,
	RouterStateSnapshot,
	UrlSegment,
	UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { DEFAULT_JWT_REFRESH_CONFIG_DEFAULT_AUTO_IN_GUARD } from '../model/auth-core-configuration.interface';
import { JwtTokenService } from '../service/jwt-token.service';

/**
 * This interface is for your convinience to use with Route data to see what
 * you can configure on the LoginGuard
 */
export interface LoginGuardData {
	/**
	 * Explicitly enable or disable auto refreshing on the route.
	 */
	isRefreshAllowed: boolean;
}

@Injectable({
	providedIn: 'root',
})
export class LoginGuard implements CanActivate, CanActivateChild, CanLoad {
	private isAccessTokenValidOnce$ = this.jwtTokenService.isAccessTokenValid$.pipe(take(1));

	public constructor(private readonly jwtTokenService: JwtTokenService) {}

	private isValid(isRefreshAllowed: boolean | undefined): Observable<boolean> {
		let allowed = isRefreshAllowed;

		if (isRefreshAllowed === undefined) {
			if (this.jwtTokenService.refreshConfig) {
				allowed = this.jwtTokenService.refreshConfig
					.isAutoRefreshAllowedInLoginGuardByDefault;
			} else {
				allowed = DEFAULT_JWT_REFRESH_CONFIG_DEFAULT_AUTO_IN_GUARD;
			}
		}

		return this.isAccessTokenValidOnce$.pipe(
			switchMap((isValid) => {
				if (!isValid && allowed) {
					return this.jwtTokenService.manualRefresh();
				} else {
					return of(isValid);
				}
			})
		);
	}

	public canActivate(
		route: ActivatedRouteSnapshot,
		_state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		const data = route.data as LoginGuardData | undefined;
		return this.isValid(data && data.isRefreshAllowed);
	}

	public canActivateChild(
		childRoute: ActivatedRouteSnapshot,
		_state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		const data = childRoute.data as LoginGuardData | undefined;
		return this.isValid(data && data.isRefreshAllowed);
	}

	public canLoad(
		route: Route,
		_segments: UrlSegment[]
	): Observable<boolean> | Promise<boolean> | boolean {
		const data = route.data as LoginGuardData | undefined;
		return this.isValid(data && data.isRefreshAllowed);
	}
}
