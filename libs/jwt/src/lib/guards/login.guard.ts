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
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { JwtTokenService } from '../service/jwt-token.service';

@Injectable({
	providedIn: 'root',
})
export class LoginGuard implements CanActivate, CanActivateChild, CanLoad {
	private isAccessTokenValid$ = this.jwtTokenService.isAccessTokenValid$.pipe(take(1));
	public constructor(private readonly jwtTokenService: JwtTokenService) {}

	public canActivate(
		_route: ActivatedRouteSnapshot,
		_state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.isAccessTokenValid$;
	}

	public canActivateChild(
		_childRoute: ActivatedRouteSnapshot,
		_state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.isAccessTokenValid$;
	}

	public canLoad(
		_route: Route,
		_segments: UrlSegment[]
	): Observable<boolean> | Promise<boolean> | boolean {
		return this.isAccessTokenValid$;
	}
}
