# jwt

<!-- markdownlint-disable MD013 -->

[![NG9 NPM Version](https://img.shields.io/npm/v/@aegis-auth/jwt/ng9)](https://www.npmjs.com/package/@aegis-auth/jwt/v/ng9)

<!-- markdownlint-enable MD013 -->

Handles common JWT use-cases, like adding the access token to
requests **and automatically refreshing it when needed**.

It consists of a `JwtModule` with two configurable Interceptors, and a helper
service to access your parsed and typed tokens.

It also provides a way to handle cases where a refresh cannot happen
(For example: both token expired) with a redirection (As thats the most
common recovery method) or a completely custom function for more advanced
use-cases.

## Installation

Using npm

```sh
npm i @aegis-auth/jwt
```

Using yarn

```sh
yarn add @aegis-auth/jwt
```

## Usage

For an example app visit the [jwt-demo](../../apps/jwt-demo) application.
It's small and simple.

### Configuration

The heart of the library is the `JwtModule` and it's `forRoot` method which
helps you configure it's providers.

#### Basic usage

For simple usecases, where you only want to have the access token injected
into your http headers, you only need to configure the first provider, like so.

> The provider definitions in this project are typed! While configuring it
> you will always have knowledge on what you can configure and how, right
> there! There is JSDoc hint for each!

This is the simplest possible configuration, where you put your tokens into
localstorage. Remember that the library will call **this `getToken`** function
every time it needs to use the token!

```ts
JwtModule.forRoot({
  useValue: {
    getToken: () => localStorage.getItem('accessToken'),
  },
});
```

I recommend using a `BehaviorSubject` in a service, so it can stay in memory,
it still can be initialized from the `localStorage` and with a subscription
you can always save the changes.
([Example](../../apps/jwt-demo/src/app/service/auth.service.ts))

For this, you would use a factory provider with this service as it's
dependency:

```ts
JwtModule.forRoot({
  useFactory: (authService: AuthService) => ({
    getToken: authService.accessTokenStorage$,
    domainWhitelist: ['localhost'],
  }),
  deps: [AuthService],
});
```

Configuring this provider causes an HTTP Interceptor to be activated. It will
append the acquired token in a configurable header on every request where it's
applicable.

##### Configuration options

```ts
interface JwtConfiguration extends UrlFilter {
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

  /**
   * This option is only used when the `onFailure` option is a string
   * so it's handled as a redirect. When this happens, you can define
   * the queryparams to be used with this redirect.
   */
  onFailureRedirectParameters?:
    | ((error: JwtError) => HttpParams | Params)
    | HttpParams
    | Params;
}
```

These properties are available on the configuration, and are used to control
what Urls can or can not recieve the token

```ts
interface UrlFilter {
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
```

#### Refreshing usage

You can optionally configure a second provider. If you do, another HTTP
Interceptor will make sure that if an endpoint that needs to recieve an
`accessToken`, and the provided one is expired, it first visits the
configured refresh endpoint, optionally refreshes your storage, and retries the
originally intended request with the newly acquired, fresh access token.

It can also do the same if the original token wasn't expired, but the server
rejected it (For example, the server can have a blacklist mechanic on login).
It only retries once, and by default it only does the retry if the error
status was `401`, Unauthorized.

##### Refresh configuration options

Because handling refreshes is not standardized instead of asking for the
refresh token directly I ask you to provide the request itself, however you
like to. In these callbacks you can access your refreshToken wherever you
store it.

The reason it's configured through multiple properties instead of a callback
where I let you do the refresh request however you see fit is to make sure the
refreshUrl is known to avoid potentional infinite requests when hitting the
refresh endpoint. This way you don't have to remember setting this into the
url filter manually.

````ts
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
   *    setToken: (response) => localStorage.setItem('accessToken', response.accessToken)
   * @example using a service.
   *
   * ```typescript
   * AuthCoreModule.forRoot<TokenStorageService>({
   *    useFactory: (service: TokenStorageService) => ({
   *      getToken: service.accessToken$
   *      autoRefresher: {
   *         endpoint: `${environment.api}/auth/refresh`,
   *         setRefreshToken: (response) => service.accessToken$.next(response.accessToken)
   *       }
   *    }),
   *    deps: [TokenStorageService],
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
  refreshRequestInitials?:
    | (() => HttpRequestInit | undefined)
    | HttpRequestInit;
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
  onFailure?:
    | string
    | ((error: JwtCouldntRefreshError | JwtCannotRefreshError) => void);

  onFailureRedirectParameters?:
    | ((
        error: JwtCouldntRefreshError | JwtCannotRefreshError
      ) => HttpParams | Params)
    | HttpParams
    | Params;

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
````

All options on the URLFilter are also available here too to further restrict
what endpoint can be refreshed.

Additionally, it can filter on the return status of a failed request

```ts
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
```

### The helper service

The provided
[`JwtTokenService<Claims>`](./src/lib/service/jwt-token.service.ts) is a
service consisting of Observable pipelines all originating from the
getToken property in your configuration provided by you.

There are observables to acquire the raw tokens:

- `rawAccessToken$: Observable<string | null | undefined>`
- `rawRefreshToken$: Observable<string | null | undefined>`

The parsed tokens:

- `accessToken$: Observable<JwtToken<Claims> | null>`
- `refreshToken$: Observable<JwtToken<Claims> | null>`

Where `JwtToken<Claims>` is:

```ts
class JwtToken<Claims extends {}> {
  header: JwtTokenHeader, // Based on RFC 7519
  payload: JwtTokenPayload & Claims, // Based on RFC 7519
  signature: string,
  isExpired: () => boolean
}
```

The headers:

- `accessTokenHeader$: Observable<JwtTokenHeader | null>`
- `refreshTokenHeader$: Observable<JwtTokenHeader | null>`

The payloads:

- `accessTokenHeader$: Observable<(JwtTokenPayload & Claims) | null>`
- `refreshTokenHeader$: Observable<(JwtTokenPayload & RefreshClaims) | null>`

And if they are expired or not:

- `isAccessTokenExpired$: Observable<boolean>`
- `isRefreshTokenExpired$: Observable<boolean>`

The payload is used to carry custom claims. These can be defined by you and
passed to the service on injection as a generic. Though often not used, the
second generic allows to define the extra claims on the refresh token.

```ts
export interface MyClaims {
  username: string;
}

export class MyService {
  constructor(private readonly jwtTokenService: JwtTokenService<MyClaims>) {
    this.jwtTokenService.accessToken$.pipe(
      map((token) => token?.payload.username) // Here, `username` is a string
    );
  }
}
```

Remember, that the helper service has to inject the configuration inside it,
so if you would try to inject this service into any of the dependencies of the
configurations provider of the JwtModule, you would get a cyclic dependency.

But since this helper servise does not contain any functions, you can't pass
any more information to it. That means it can be used independently.

If you do need to use your original dependency and this helper service together
I recommend making that original dependency into a simple storage with
2 `BehaviorSubject`s, and making another service where you can inject both.

In the example application, the `AuthService` acts both as the storage of the
tokens, and some methods on doing `login`, `refresh` and `logout`.

This demo `AuthService` only has to manage the token storage, the library
will always use the latest values.

### The LoginGuard

Using the LoginGuard on a route means that the route and all of its children
cannot open unless there is a valid accessToken available. Since tokens are
only refreshed on-demand it's possible that after an idle time that is longer
than the accessTokens lifetime, that on guard activation the token is expired.

For this reason, the guard does a `manualRefresh` if the token is invalid.

The autorefreshing is controllable with a configuration option on the refresh
configuration and per route with route data. See `LoginGuardData` for what is
available.

```ts
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
```

If you need something more custom, I highly recommend implementing your own
guard as `LoginGuard` itself is also really simple.
