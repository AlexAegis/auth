import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
	DEFAULT_HEADER_CONFIG,
	HeaderConfiguration,
	UrlFilter,
} from '../model/header-configuration.interface';
import { HttpMethodType } from './http-method.enum';

export const DEFAULT_JWT_HEADER = 'Authorization';
export const DEFAULT_JWT_SCHEME = 'Bearer ';

export const DEFAULT_JWT_CONFIG: Partial<JwtConfiguration> = {
	...DEFAULT_HEADER_CONFIG,
	header: DEFAULT_JWT_HEADER,
	scheme: DEFAULT_JWT_SCHEME,
	handleWithCredentials: true,
};

export interface JwtRefreshResponse {
	accessToken: string;
	refreshToken?: string;
}

export interface HttpRequestInit {
	headers?: HttpHeaders;
	reportProgress?: boolean;
	params?: HttpParams;
	responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
	withCredentials?: boolean;
}

/**
 * Enables the RefreshInterceptor which will automatically tries to
 * refresh the accessToken on expiration or failure on the next request.
 * If left undefined, the refresh feature for this token definition won't
 * do anything. If none of the tokendefinitions have autoRefresh enabled
 * then the RefreshInterceptor won't be loaded.
 * This configuration objects is responsible on how a token should be
 * refreshed.
 *
 * The generic type is meant to describe the shape of the refresh endpoints
 * response. So when you define the `setToken` method you'll get some help.
 *
 * @example configuration.
 * AuthCoreModule.forRoot<TokenStorageService>({
 *		useFactory: (service: TokenStorageService) => ({
 *			getToken: service.accessToken$
 *			autoRefresher: {
 * 				endpoint: `${environment.api}/auth/refresh`,
 * 				setToken: (response) => service.accessToken$.next(response.accessToken)
 * 			}
 *		}),
 *		deps: [TokenStorageService],
 * })
 *
 * @default undefined
 */
export interface JwtRefreshConfiguration<RefreshRequest, RefreshResponse> extends UrlFilter {
	/**
	 * After a successful refresh, this callback will be called.
	 * You need to define a function which will save the the token in a way
	 * that if the interceptor calls `getToken` again, it will get the token
	 * saved with this method.
	 *
	 * @example using `localStorage`
	 * 		setToken: (response) => localStorage.setItem('accessToken', response.accessToken)
	 * @example using a service.
	 *
	 * ```typescript
	 * AuthCoreModule.forRoot<TokenStorageService>({
	 *		useFactory: (service: TokenStorageService) => ({
	 *			getToken: service.accessToken$
	 *			autoRefresher: {
	 * 				endpoint: `${environment.api}/auth/refresh`,
	 * 				setRefreshToken: (response) => service.accessToken$.next(response.accessToken)
	 * 			}
	 *		}),
	 *		deps: [TokenStorageService],
	 * })
	 * ```
	 *
	 */
	setRefreshToken: (response: string) => void;

	/**
	 * Define an observable that returns the refresh token when subscribed to.
	 *
	 */
	getRefreshToken$?: Observable<string | null | undefined>;
	/**
	 * The method for the request, usually it's a POST so that's the default
	 *
	 * @default 'POST'
	 */
	method?: HttpMethodType;
	/**
	 * The endpoint that will be requested for a new token
	 */
	refreshUrl: string;
	/**
	 * A callback that should return the body of the request
	 */
	refreshRequestBody: () => RefreshRequest;
	/**
	 * A callback that should return the defaults on the request
	 */
	refreshRequestInitials?: (() => HttpRequestInit | undefined) | HttpRequestInit;
	/**
	 * This function have to transform the result of your refresh endpoint
	 * into a digestable form. It will be called after successful refreshes.
	 */
	transformRefreshResponse: (response: RefreshResponse) => JwtRefreshResponse;
}

/**
 * Token injection configuration
 *
 * The optional generic defined the refresh endpoints Response type. If you
 * are not using that feature there's no need to define it.
 *
 * Example configuration:
 * ```typescript
 * AuthCoreModule.forRoot<TokenStorageService>({
 *		useFactory: (service: TokenStorageService) => ({
 *			getToken: service.accessToken$
 *			autoRefresher: {
 * 				endpoint: `${environment.api}/auth/refresh`,
 * 				setToken: (response) => service.accessToken$.next(response.accessToken)
 * 			}
 *		}),
 *		deps: [TokenStorageService],
 * })
 * ```
 */
export interface JwtConfiguration<RefreshRequest = unknown, RefreshResponse = unknown>
	extends Omit<HeaderConfiguration, 'getValue'> {
	/**
	 * A callback or observable that will be called or subscribed to
	 * on every http request and returns a value for the header
	 *
	 * @example getValue: () => localstorage.get('foo')
	 * @example getValue: myTokenService.foo$
	 */
	getToken:
		| Observable<string | null | undefined>
		| (() =>
				| string
				| null
				| undefined
				| Promise<string | null | undefined>
				| Observable<string | null | undefined>);

	/**
	 * The prefix of the token when injecting. Notice thet the trailing
	 * whitespace has to be set here
	 *
	 * @default 'Bearer '
	 */
	scheme?: string;

	/**
	 * Header name to be set
	 *
	 * @default 'Authorization'
	 */
	header: string;

	/**
	 * Sets the 'withCredentials' to true along with the token
	 *
	 * @default true
	 */
	handleWithCredentials: boolean;
}
