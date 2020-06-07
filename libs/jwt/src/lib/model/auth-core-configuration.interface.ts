import { DEFAULT_HEADER_CONFIG, HeaderConfiguration } from '@aegis-auth/core';

export const DEFAULT_JWT_CONFIG: Partial<JwtConfiguration> = {
	...DEFAULT_HEADER_CONFIG,
	type: 'jwt',
	header: 'Authorization',
	scheme: 'Bearer ',
	handleWithCredentials: true,
};

/**
 * This configuration objects is responsible on how a token should be
 * refreshed.
 *
 * The generic type is meant to describe the shape of the refresh endpoints
 * response. So when you define the `setToken` method you'll get some help.
 */
export interface TokenRefresher<Response> {
	/**
	 * Endpoint to call when the token needs a refresh
	 */
	endpoint: string;

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
	 * 				setToken: (response) => service.accessToken$.next(response.accessToken)
	 * 			}
	 *		}),
	 *		deps: [TokenStorageService],
	 * })
	 * ```
	 *
	 */
	setToken: (response: Response) => boolean;
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
export interface JwtConfiguration<RefreshResponse = unknown> extends HeaderConfiguration {
	/**
	 * The prefix of the token when injecting. Notice thet the trailing
	 * whitespace has to be set here
	 *
	 * @default 'Bearer '
	 */
	scheme: string;

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
	autoRefresher?: TokenRefresher<RefreshResponse>;

	/**
	 * Sets the 'withCredentials' to true along with the token
	 *
	 * @default true
	 */
	handleWithCredentials: boolean;
}
