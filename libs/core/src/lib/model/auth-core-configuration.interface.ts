import { BehaviorSubject, Observable } from 'rxjs';

export const DEFAULT_AUTH_CONFIG: AuthConfiguration = {
	getToken: new BehaviorSubject(null),
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
export interface AuthConfiguration<RefreshResponse = unknown> {
	/**
	 * A callback or observable that will be called or subscribed to
	 * on every http request and returns a stored token
	 *
	 * @example getToken: () => localstorage.get('accessToken')
	 * @example getToken: myTokenService.accessToken$
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

	/**
	 * These domains won't recieve tokens even if they are listed in the
	 * whitelist.
	 *
	 * If null or undefined, this category of rules won't take any effect.
	 * If empty, it would mean "No domains are blacklisted", and it won't
	 * take any effect.
	 *
	 * @default undefined
	 * @example ['localhost:3333']
	 * @example [/localhost:[0-9]{4}/]
	 */
	domainBlacklist?: (string | RegExp)[];

	/**
	 * Only domains listed will be recieving token injections
	 *
	 * If null or undefined, this category of rules won't take any effect.
	 * If empty, it would mean "No domains are whitelisted", so no paths would
	 * recieve tokens!
	 *
	 * @default undefined
	 * @example ['localhost:3333']
	 * @example [/localhost:[0-9]{4}/]
	 */
	domainWhitelist?: (string | RegExp)[];

	/**
	 * These paths won't recieve tokens even if they are listed in the
	 * whitelist.
	 *
	 * If null or undefined, this category of rules won't take any effect.
	 * If empty, it would mean "No paths are blacklisted", and it won't
	 * take any effect.
	 *
	 * @default undefined
	 * @example ['api/v2/users/1']
	 * @example [/users\/.+/]
	 */
	pathBlacklist?: (string | RegExp)[];

	/**
	 * Only paths listed will be recieving token injections.
	 *
	 * If null or undefined, this category of rules won't take any effect.
	 * If empty, it would mean "No paths are whitelisted", so no paths would
	 * recieve tokens!
	 *
	 * @default undefined
	 * @example ['api/v2/users/1']
	 * @example [/users\/.+/]
	 */
	pathWhitelist?: (string | RegExp)[];

	/**
	 * These protocols won't recieve tokens even if they are listed in the
	 * whitelist.
	 *
	 * If null or undefined, this category of rules won't take any effect.
	 * If empty, it would mean "No protocols are blacklisted", and it won't
	 * take any effect.
	 *
	 * @default undefined
	 * @example ['http']
	 * @example [/https?/]
	 */
	protocolBlacklist?: (string | RegExp)[];

	/**
	 * Only protocols listed will be recieving token injections.
	 *
	 * If empty or undefined, this category of rules won't take any effect.
	 * If empty, it would mean "No protocols are whitelisted", so no protocols
	 * would recieve tokens!
	 *
	 * @default undefined
	 * @example ['http']
	 * @example [/https?/]
	 */
	protocolWhitelist?: (string | RegExp)[];
}
