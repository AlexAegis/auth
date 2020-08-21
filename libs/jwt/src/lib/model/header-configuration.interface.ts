import { BehaviorSubject, Observable } from 'rxjs';

export const DEFAULT_HEADER_CONFIG: Partial<HeaderConfiguration> = {
	getValue: new BehaviorSubject<string | null | undefined>(null),
};

export interface NormalizedHeaderConfiguration extends HeaderConfiguration {
	value$: Observable<string | null | undefined>;
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
export interface HeaderConfiguration extends UrlFilter {
	/**
	 * A callback or observable that will be called or subscribed to
	 * on every http request and returns a value for the header
	 *
	 * @example getValue: () => localstorage.get('foo')
	 * @example getValue: myTokenService.foo$
	 */
	getValue:
		| Observable<string | null | undefined>
		| (() =>
				| string
				| null
				| undefined
				| Promise<string | null | undefined>
				| Observable<string | null | undefined>);

	/**
	 * Header name to be set
	 */
	header: string;
}

export interface UrlFilter {
	/**
	 * These domains won't recieve this header even if they are listed in the
	 * whitelist.
	 *
	 * If `null` or `undefined`, this category of rules won't take any effect.
	 * If empty, it would mean "No domains are blacklisted", and it won't
	 * take any effect.
	 *
	 * @default undefined
	 * @example ['localhost:3333']
	 * @example [/localhost:[0-9]{4}/]
	 */
	domainBlacklist?: (string | RegExp)[];

	/**
	 * Only domains listed will be recieving header injections
	 *
	 * If `null` or `undefined`, this category of rules won't take any effect.
	 * If empty, it would mean "No domains are whitelisted", so no paths would
	 * recieve tokens!
	 *
	 * @default undefined
	 * @example ['localhost:3333']
	 * @example [/localhost:[0-9]{4}/]
	 */
	domainWhitelist?: (string | RegExp)[];

	/**
	 * These paths won't recieve this header even if they are listed in the
	 * whitelist.
	 *
	 * If `null` or `undefined`, this category of rules won't take any effect.
	 * If empty, it would mean "No paths are blacklisted", and it won't
	 * take any effect.
	 *
	 * @default undefined
	 * @example ['api/v2/users/1']
	 * @example [/users\/.+/]
	 */
	pathBlacklist?: (string | RegExp)[];

	/**
	 * Only paths listed will be recieving this header injection.
	 *
	 * If `null` or `undefined`, this category of rules won't take any effect.
	 * If empty, it would mean "No paths are whitelisted", so no paths would
	 * recieve tokens!
	 *
	 * @default undefined
	 * @example ['api/v2/users/1']
	 * @example [/users\/.+/]
	 */
	pathWhitelist?: (string | RegExp)[];

	/**
	 * These protocols won't recieve this header even if they are listed in
	 * the whitelist.
	 *
	 * If `null` or `undefined`, this category of rules won't take any effect.
	 * If empty, it would mean "No protocols are blacklisted", and it won't
	 * take any effect.
	 *
	 * @default undefined
	 * @example ['http']
	 * @example [/https?/]
	 */
	protocolBlacklist?: (string | RegExp)[];

	/**
	 * Only protocols listed will be recieving this header injections.
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
