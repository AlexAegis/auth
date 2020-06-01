import { Observable, of } from 'rxjs';

export const DEFAULT_AUTH_CONFIG: AuthConfiguration = {
	getToken: of(null),
	header: 'Authorization',
	scheme: 'Bearer ',
	handleWithCredentials: true,
};

/**
 * Token injection configuration
 */
export interface AuthConfiguration {
	/**
	 * A callback or observable that will be called
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
