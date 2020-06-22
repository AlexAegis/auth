import { Observable } from 'rxjs';
import {
	DEFAULT_HEADER_CONFIG,
	HeaderConfiguration,
} from '../model/header-configuration.interface';

export const DEFAULT_JWT_CONFIG: Partial<JwtConfiguration> = {
	...DEFAULT_HEADER_CONFIG,
	header: 'Authorization',
	scheme: 'Bearer ',
	handleWithCredentials: true,
};

export interface JwtRefreshResponse {
	accessToken: string;
	refreshToken?: string;
}
/**
 * This configuration objects is responsible on how a token should be
 * refreshed.
 *
 * The generic type is meant to describe the shape of the refresh endpoints
 * response. So when you define the `setToken` method you'll get some help.
 */
export interface TokenRefresher {
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
	 * Define a method that somehow refreshes the token,
	 * It's usually an http request. Map the response so only
	 * the new token(s) are returned. This function will be called
	 * automatically when a refresh is needed.
	 */
	refresh: () => Observable<JwtRefreshResponse>;
	/**
	 * Define an observable that returns the refresh token when subscribed to.
	 *
	 */
	getRefreshToken$?: Observable<string | null | undefined>;
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
	 * Enables the RefreshInterceptor which will automatically tries to
	 * refresh the accessToken on expiration or failure on the next request.
	 * If left undefined, the refresh feature for this token definition won't
	 * do anything. If none of the tokendefinitions have autoRefresh enabled
	 * then the RefreshInterceptor won't be loaded.
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
	autoRefresher: TokenRefresher | undefined;

	/**
	 * Sets the 'withCredentials' to true along with the token
	 *
	 * @default true
	 */
	handleWithCredentials: boolean;
}
