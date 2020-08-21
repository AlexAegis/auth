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

export const DEFAULT_JWT_REFRESH_CONFIG: Partial<JwtRefreshConfiguration<unknown, unknown>> = {
	method: 'POST',
	errorCodeWhitelist: [401],
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
 * TODO: optional generic matcher function
 */
export interface HttpErrorFilter {
	/**
	 * The error codes on which an act is allowed to happen,
	 * an empty array means it can't act on anything
	 *
	 * @default [401]
	 */
	errorCodeWhitelist?: number[];

	/**
	 * The error codes on which an act is not allowed to happen,
	 * an empty array (and if undefined) means it can always try a single
	 * act in case of an error
	 *
	 * @default undefined
	 */
	errorCodeBlacklist?: number[];
}

/**
 * Enables the RefreshInterceptor which will automatically tries to
 * refresh the accessToken on expiration or failure of the next request.
 *
 * Because handling refreshes is not standardized, instead of asking for the
 * refresh token directly I ask you to provide the request itself, however you
 * like to. In these callbacks you can access your refreshToken wherever you
 * store it.
 *
 * You can still configure a `getRefreshToken` property but it's optional,
 * not used in the interceptor at all, and is only used in the helper service.
 * If you do not with to interact with the parsed refreshToken (Usually you
 * don't need to) you can leave that out. But it's there if you might need it.
 *
 * The reason it's configured through multiple properties instead of a callback
 * where I let you do the refresh request however you see fit is to make sure the
 * refreshUrl is known to avoid potentional infinite requests when hitting the
 * refresh endpoint. This way you don't have to remember setting this into the
 * url filter manually.
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
export interface JwtRefreshConfiguration<RefreshRequest, RefreshResponse>
	extends UrlFilter,
		HttpErrorFilter {
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
	setRefreshedTokens: (response: JwtRefreshResponse) => void;

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
	createRefreshRequestBody: () => RefreshRequest;
	/**
	 * A callback that should return the defaults on the request
	 */
	refreshRequestInitials?: (() => HttpRequestInit | undefined) | HttpRequestInit;
	/**
	 * This function have to transform the result of your refresh endpoint
	 * into a digestable form. It will be called after successful refreshes.
	 */
	transformRefreshResponse: (response: RefreshResponse) => JwtRefreshResponse;

	/**
	 * Optional!
	 *
	 * Not used in the refresh mechanic! See `createRefreshRequestBody` if you
	 * need to provide the `refreshToken` in the body when making the refresh
	 * request or `refreshRequestInitials` when it's handled in a header!
	 *
	 * A callback or observable that can be used to retrieve the refresh token
	 * Not used in the interceptor! it is only used in the helper service if
	 * you with to interact with the parsed refreshToken throught the helper
	 * observables. If you do not, you don't have to implement this.
	 *
	 * @example getValue: () => localstorage.get('foo')
	 * @example getValue: myTokenService.foo$
	 */
	getRefreshToken?:
		| Observable<string | null | undefined>
		| (() =>
				| string
				| null
				| undefined
				| Promise<string | null | undefined>
				| Observable<string | null | undefined>);
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
export interface JwtConfiguration extends Omit<HeaderConfiguration, 'getValue'> {
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
