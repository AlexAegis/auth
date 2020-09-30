import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtCannotRefreshError, JwtCouldntRefreshError, JwtError } from '../errors/jwt-error.class';
import { HeaderConfiguration, UrlFilter } from '../model/header-configuration.interface';
import { HttpMethodType } from './http-method.enum';
export declare const DEFAULT_JWT_HEADER = "Authorization";
export declare const DEFAULT_JWT_SCHEME = "Bearer ";
export declare const DEFAULT_JWT_CONFIG: Partial<JwtConfiguration>;
export declare const DEFAULT_JWT_REFRESH_CONFIG_DEFAULT_AUTO_IN_GUARD = true;
export declare const DEFAULT_JWT_REFRESH_CONFIG: Partial<JwtRefreshConfiguration<unknown, unknown>>;
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
export interface JwtRefreshConfiguration<RefreshRequest, RefreshResponse> extends UrlFilter, HttpErrorFilter {
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
     * A callback or observable that can be used to retrieve the body of the
     * request. If it's null or undefined, the refresh won't be executed. This
     * can be utilized to not do a refresh on a logged out state.
     *
     * @example getValue: () => localstorage.get('foo')
     * @example getValue: myTokenService.foo$
     */
    createRefreshRequestBody: Observable<RefreshRequest | null | undefined> | (() => RefreshRequest | null | undefined | Promise<RefreshRequest | null | undefined> | Observable<RefreshRequest | null | undefined>);
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
     * This callback is called when a refresh either failed or cannot be done.
     * This marks the point where both tokens are invalid and the user needs to
     * relog. Because this is usually done through a login page, aside from a
     * regular callback, a string can also be supplied which will act as the
     * target of navigation. Check `onFailureRedirectParameters` if you wish
     * to supply query parameters. For more advanced usage, consider
     * implementing it as a custom function, the error object is available
     * there too!
     */
    onFailure?: string | ((error: JwtCouldntRefreshError | JwtCannotRefreshError) => void);
    onFailureRedirectParameters?: ((error: JwtCouldntRefreshError | JwtCannotRefreshError) => HttpParams | Params) | HttpParams | Params;
    /**
     * Optional!
     *
     * The refresh mechanic only uses this to determine if it's expired or not
     * and so potentionally saving a request that would fail anyway. It is
     * also used in the helper service if you with to interact with the
     * parsed refreshToken throught the helper observables. If you do not
     * need either of these, you don't have to implement this.
     *
     * A callback or observable that can be used to retrieve the refresh token
     * Not used in the interceptor!
     *
     * @example getValue: () => localstorage.get('foo')
     * @example getValue: myTokenService.foo$
     */
    getRefreshToken?: Observable<string | null | undefined> | (() => string | null | undefined | Promise<string | null | undefined> | Observable<string | null | undefined>);
    /**
     * When using the LoginGuard this setting will determine the default
     * value. So instead of disabling the autoRefresh behavior on every
     * route with the data option, or writing your own guard (Which would
     * be really simple) just set this to false. You can still override it
     * using route data.
     *
     * See the LoginGuardData helper interface to see what it can utilize.
     *
     * @default true
     */
    isAutoRefreshAllowedInLoginGuardByDefault?: boolean;
}
/**
 * This is a helper interface because they look the same on both
 * `JwtConfiguration` and `JwtRefreshConfiguration`. They are re-defined
 * on them to provide better documentation.
 *
 * In the case where you wish to implement them both in a separate object
 * then spread it back to both to reduce code-duplication, this type can
 * be utilized.
 */
export interface JwtErrorHandling {
    /**
     * If it's a string, instead of calling it, a redirection will happen,
     * with `onFailureRedirectParameters` as it's queryParams.
     */
    onFailure?: string | ((jwtError: JwtError | JwtCouldntRefreshError | JwtCannotRefreshError) => void);
    /**
     * This option is only used when the `onFailure` option is a string
     * so it's handled as a redirect. When this happens, you can define
     * the queryparams to be used with this redirect.
     *
     * When implemented as a function, the JwtError will be forwarded to it.
     * All JwtErrors have the `originalRequest` available in them, so it's
     * trivial to acquire the failed url.
     */
    onFailureRedirectParameters?: ((error: JwtError | JwtCouldntRefreshError | JwtCannotRefreshError) => HttpParams | Params) | HttpParams | Params;
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
export interface JwtConfiguration extends Omit<HeaderConfiguration, 'getValue'>, JwtErrorHandling {
    /**
     * A callback or observable that will be called or subscribed to
     * on every http request and returns a value for the header
     *
     * @example getValue: () => localstorage.get('foo')
     * @example getValue: myTokenService.foo$
     */
    getToken: Observable<string | null | undefined> | (() => string | null | undefined | Promise<string | null | undefined> | Observable<string | null | undefined>);
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
    /**
     * This callback is called when the request fails and there is no
     * RefreshConfiguration, or when the access token is simply missing.
     * `getToken` returned a nullish value. If the RefreshConfiguration is
     * available, then the error handling continues in the same fashion on
     * the other configuration.
     *
     * Both have the same names and signature for
     * both the error handling configuration options `onFailure` and
     * `onFailureRedirectParameters`, so if you wish to use the same for both
     * implement them outside, and spread them back. You can use the
     * `JwtErrorHandling` interface to help you with the typing. Although
     * thats a bit wider when it comes to the error types.
     *
     * If it's a string, instead of calling it, a redirection will happen,
     * with `onFailureRedirectParameters` as it's queryParams.
     */
    onFailure?: string | ((jwtError: JwtError) => void);
    onFailureRedirectParameters?: ((error: JwtError) => HttpParams | Params) | HttpParams | Params;
}
