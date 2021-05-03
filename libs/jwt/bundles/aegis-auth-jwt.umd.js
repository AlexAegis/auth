(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('rxjs/operators'), require('@angular/common/http'), require('@angular/router'), require('js-base64'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('@aegis-auth/jwt', ['exports', '@angular/core', 'rxjs', 'rxjs/operators', '@angular/common/http', '@angular/router', 'js-base64', '@angular/common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['aegis-auth'] = global['aegis-auth'] || {}, global['aegis-auth'].jwt = {}), global.ng.core, global.rxjs, global.rxjs.operators, global.ng.common.http, global.ng.router, global.jsBase64, global.ng.common));
}(this, (function (exports, i0, rxjs, operators, i1, i4, jsBase64, common) { 'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () {
                            return e[k];
                        }
                    });
                }
            });
        }
        n['default'] = e;
        return Object.freeze(n);
    }

    var i0__namespace = /*#__PURE__*/_interopNamespace(i0);
    var i1__namespace = /*#__PURE__*/_interopNamespace(i1);
    var i4__namespace = /*#__PURE__*/_interopNamespace(i4);

    /**
     *
     * @param unixTimestamp seconds from the unix epoch 1970-01-01T00:00:00Z
     * if not supplied it will always be expired
     */
    var isUnixTimestampExpired = function (unixTimestamp) {
        if (unixTimestamp === void 0) { unixTimestamp = -Infinity; }
        return unixTimestamp < Math.floor(new Date().getTime() / 1000);
    };

    var DEFAULT_HEADER_CONFIG = {
        getValue: new rxjs.BehaviorSubject(null),
    };

    var DEFAULT_JWT_HEADER = 'Authorization';
    var DEFAULT_JWT_SCHEME = 'Bearer ';
    var DEFAULT_JWT_CONFIG = Object.assign(Object.assign({}, DEFAULT_HEADER_CONFIG), { header: DEFAULT_JWT_HEADER, scheme: DEFAULT_JWT_SCHEME, handleWithCredentials: true });
    var DEFAULT_JWT_REFRESH_CONFIG_DEFAULT_AUTO_IN_GUARD = true;
    var DEFAULT_JWT_REFRESH_CONFIG = {
        method: 'POST',
        errorCodeWhitelist: [401],
        isAutoRefreshAllowedInLoginGuardByDefault: DEFAULT_JWT_REFRESH_CONFIG_DEFAULT_AUTO_IN_GUARD,
    };

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    /** @deprecated */
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    /** @deprecated */
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    function __spreadArray(to, from) {
        for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
        return to;
    }
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }
    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m")
            throw new TypeError("Private method is not writable");
        if (kind === "a" && !f)
            throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
            throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    var JwtError = /** @class */ (function (_super) {
        __extends(JwtError, _super);
        function JwtError(originalRequest, originalError, message) {
            if (message === void 0) { message = JwtError.type; }
            var _this = _super.call(this, message) || this;
            _this.originalRequest = originalRequest;
            _this.originalError = originalError;
            return _this;
        }
        JwtError.createErrorResponse = function (request, refreshError) {
            return new i1.HttpErrorResponse({
                error: JwtError.createErrorEvent(request, refreshError),
            });
        };
        JwtError.createErrorEvent = function (request, refreshError) {
            return new ErrorEvent(JwtError.type, {
                error: new JwtError(request, refreshError),
            });
        };
        return JwtError;
    }(Error));
    JwtError.type = 'JWT_ERROR';
    /**
     * When both access and refresh tokens are either invalid or expired!
     */
    var JwtCannotRefreshError = /** @class */ (function (_super) {
        __extends(JwtCannotRefreshError, _super);
        function JwtCannotRefreshError(originalRequest, originalError) {
            var _this = _super.call(this, originalRequest, originalError, JwtCannotRefreshError.type) || this;
            _this.originalRequest = originalRequest;
            _this.originalError = originalError;
            return _this;
        }
        JwtCannotRefreshError.createErrorResponse = function (request, refreshError) {
            return new i1.HttpErrorResponse({
                error: JwtCannotRefreshError.createErrorEvent(request, refreshError),
            });
        };
        JwtCannotRefreshError.createErrorEvent = function (request, refreshError) {
            return new ErrorEvent(JwtCannotRefreshError.type, {
                error: new JwtCannotRefreshError(request, refreshError),
            });
        };
        return JwtCannotRefreshError;
    }(JwtError));
    JwtCannotRefreshError.type = 'JWT_CANNOT_REFRESH_ERROR';
    /**
     * When refresh failed
     */
    var JwtCouldntRefreshError = /** @class */ (function (_super) {
        __extends(JwtCouldntRefreshError, _super);
        function JwtCouldntRefreshError(originalRequest, originalError) {
            var _this = _super.call(this, originalRequest, originalError, JwtCouldntRefreshError.type) || this;
            _this.originalRequest = originalRequest;
            _this.originalError = originalError;
            return _this;
        }
        JwtCouldntRefreshError.createErrorResponse = function (request, refreshError) {
            return new i1.HttpErrorResponse({
                error: JwtCouldntRefreshError.createErrorEvent(request, refreshError),
            });
        };
        JwtCouldntRefreshError.createErrorEvent = function (request, refreshError) {
            return new ErrorEvent(JwtCouldntRefreshError.type, {
                error: new JwtCouldntRefreshError(request, refreshError),
            });
        };
        return JwtCouldntRefreshError;
    }(JwtError));
    JwtCouldntRefreshError.type = 'JWT_COULDNT_REFRESH_ERROR';

    var isString = function (stringLike) { return typeof stringLike === 'string'; };

    /**
     * Jwt failures are handled by either calling a callback or if its a string,
     * redirect
     *
     * @internal
     */
    var handleJwtFailure = function (errorCallbackOrRedirect, error, router, redirectParameters) {
        if (isString(errorCallbackOrRedirect)) {
            if (router) {
                var queryParams = redirectParameters;
                if (typeof redirectParameters === 'function') {
                    queryParams = redirectParameters(error);
                }
                router.navigate([errorCallbackOrRedirect], {
                    queryParams: queryParams,
                });
            }
            else {
                // This error is intended to surface as it's a configuration problem
                throw new Error('JWT Refresh configuration error! ' +
                    '`onFailure` is defined as a string, but the ' +
                    'Router is not available! Is @angular/router ' +
                    'installed and the RouterModule imported?');
            }
        }
        else {
            errorCallbackOrRedirect(error);
        }
    };

    var isNotNullish = function (t) { return t !== undefined && t !== null; };

    var handleJwtError = function (wrappedError, jwtConfiguration, jwtRefreshConfiguration, router) {
        var _a;
        var error = (_a = wrappedError.error) === null || _a === void 0 ? void 0 : _a.error;
        if (error instanceof JwtCannotRefreshError || error instanceof JwtCouldntRefreshError) {
            if (jwtRefreshConfiguration && isNotNullish(jwtRefreshConfiguration.onFailure)) {
                // Unset accesstoken
                // jwtRefreshConfiguration.setRefreshedTokens({ accessToken: undefined });
                handleJwtFailure(jwtRefreshConfiguration.onFailure, error, router, jwtRefreshConfiguration.onFailureRedirectParameters);
            }
            // Rethrow the inner error, so observers of the user can see it
            return rxjs.throwError(error);
        }
        else if (error instanceof JwtError) {
            if (isNotNullish(jwtConfiguration.onFailure)) {
                handleJwtFailure(jwtConfiguration.onFailure, error, router, jwtConfiguration.onFailureRedirectParameters);
            }
            return rxjs.throwError(error);
        }
        else {
            // Other errors are left untreated
            return rxjs.throwError(wrappedError);
        }
    };

    var isFunction = function (funlike) { return typeof funlike === 'function'; };

    /**
     * Returns true if the object is truthy and has a `then` and a `catch` function.
     * Using `instanceof` would not be sufficient as Promises can be contructed
     * in many ways, and it's just a specification.
     */
    var isPromise = function (promiseLike) { return !!promiseLike &&
        typeof promiseLike.then === 'function' &&
        typeof promiseLike.catch === 'function'; };

    /**
     * Returns a cold observable from a function, or returns an observable if
     * one is directly passed to it
     */
    var intoObservable = function (getValue) {
        if (rxjs.isObservable(getValue)) {
            return getValue;
        }
        else if (isFunction(getValue)) {
            return rxjs.of(null).pipe(operators.switchMap(function () {
                var result = getValue();
                if (rxjs.isObservable(result)) {
                    return result;
                }
                if (isPromise(result)) {
                    return rxjs.from(result);
                }
                else {
                    return rxjs.of(result);
                }
            }));
        }
        else if (isPromise(getValue)) {
            return rxjs.from(getValue);
        }
        else {
            return rxjs.of(getValue);
        }
    };

    /**
     * It returns an observable which emits instantly a boolean describing if the
     * timestamp is expired or not. If not, it will emit a second time when it
     * will expire.
     *
     * @param timestamp milliseconds
     */
    var isTimestampExpiredNowAndWhenItIs = function (timestamp) {
        // If already expired, just return that
        if (timestamp - new Date().getTime() < 0) {
            return rxjs.of(true);
        }
        else {
            // If not, return that is not and a timer that will emit when it does
            return rxjs.merge(rxjs.of(false), rxjs.timer(new Date(timestamp)).pipe(operators.mapTo(true)));
        }
    };

    /**
     * It returns an observable which emits instantly a boolean describing if the
     * timestamp is expired or not. If not, it will emit a second time when it
     * will expire.
     *
     * @param unixTimestamp seconds from the unix epoch 1970-01-01T00:00:00Z
     * if not supplied it will always be expired
     */
    var isUnixTimestampExpiredNowAndWhenItIs = function (unixTimestamp) { return isTimestampExpiredNowAndWhenItIs(Math.floor(unixTimestamp * 1000)); };

    /**
     * Matches the filter against an error response. Non-existend rulesets
     * automatically pass. **Empty whitelist rulesets never pass.** Empty blacklist
     * rulesets always pass.
     */
    var checkAgainstHttpErrorFilter = function (httpErrorFilter, error) {
        var _a, _b, _c;
        var statusMatcher = function (code) { return code === error.status; };
        var errorCodeWhitelistRulesPass = (_b = (_a = httpErrorFilter.errorCodeWhitelist) === null || _a === void 0 ? void 0 : _a.some(statusMatcher)) !== null && _b !== void 0 ? _b : true;
        var errorCodeBlacklistRulesPass = !((_c = httpErrorFilter.errorCodeBlacklist) === null || _c === void 0 ? void 0 : _c.some(statusMatcher));
        return errorCodeWhitelistRulesPass && errorCodeBlacklistRulesPass;
    };

    var callWhenFunction = function (functionLike) {
        var result;
        if (isFunction(functionLike)) {
            result = functionLike();
        }
        else {
            result = functionLike;
        }
        return result;
    };

    var isHttpResponse = function (httpEvent) { return httpEvent.type === i1.HttpEventType.Response; };

    var doJwtRefresh = function (next, requestBody, jwtRefreshConfiguration, refreshLock, onError, originalAction) {
        var _a;
        var refreshRequest = new i1.HttpRequest((_a = jwtRefreshConfiguration.method) !== null && _a !== void 0 ? _a : 'POST', jwtRefreshConfiguration.refreshUrl, requestBody, callWhenFunction(jwtRefreshConfiguration.refreshRequestInitials));
        refreshLock.next(true); // Lock on refresh
        return next.handle(refreshRequest).pipe(operators.filter(isHttpResponse), operators.map(function (response) { return jwtRefreshConfiguration.transformRefreshResponse(response.body); }), operators.tap(function (refreshResponse) { return jwtRefreshConfiguration.setRefreshedTokens(refreshResponse); }), operators.mergeMap(function (refreshResponse) { return originalAction(refreshResponse); }), operators.finalize(function () { return refreshLock.next(false); }), // Unlock on finish
        operators.catchError(onError));
    };

    var tryJwtRefresh = function (next, originalError, jwtRefreshConfiguration, refreshLock, onError, originalAction) {
        var isRefreshAllowed = typeof originalError === 'string' ||
            checkAgainstHttpErrorFilter(jwtRefreshConfiguration, originalError);
        if (isRefreshAllowed) {
            return intoObservable(jwtRefreshConfiguration.createRefreshRequestBody).pipe(operators.take(1), operators.switchMap(function (requestBody) {
                if (requestBody) {
                    return doJwtRefresh(next, requestBody, jwtRefreshConfiguration, refreshLock, onError, originalAction);
                }
                else {
                    return onError(originalError);
                }
            }));
        }
        else {
            return rxjs.throwError(originalError);
        }
    };

    /**
     *
     * @param str json encoded in Base64
     */
    var decodeJsonLikeBase64 = function (str) {
        try {
            return JSON.parse(jsBase64.Base64.decode(str));
        }
        catch (error) {
            console.error('Invalid Jsonlike Base64 string', error);
            return null;
        }
    };

    var JwtToken = /** @class */ (function () {
        function JwtToken(header, payload, signature) {
            this.header = header;
            this.payload = payload;
            this.signature = signature;
        }
        JwtToken.from = function (token) {
            var convertedSegments = JwtToken.splitTokenString(token);
            if (!convertedSegments) {
                return null;
            }
            var header = decodeJsonLikeBase64(convertedSegments[0]);
            var payload = decodeJsonLikeBase64(convertedSegments[1]);
            var signature = jsBase64.Base64.decode(convertedSegments[2]); // Not used, only for validation
            if (!header || !payload || !signature) {
                return null;
            }
            return new JwtToken(header, payload, signature);
        };
        JwtToken.stripScheme = function (jwtHeaderValue, scheme) {
            return jwtHeaderValue.substring((scheme !== null && scheme !== void 0 ? scheme : '').length);
        };
        JwtToken.splitTokenString = function (token, separator) {
            if (separator === void 0) { separator = JwtToken.JWT_TOKEN_SEPARATOR; }
            var spl = token.split(separator);
            if (spl.length !== 3) {
                return null;
            }
            return spl;
        };
        JwtToken.prototype.isExpired = function () {
            return isUnixTimestampExpired(this.payload.exp);
        };
        return JwtToken;
    }());
    JwtToken.JWT_TOKEN_SEPARATOR = '.';

    var JWT_CONFIGURATION_TOKEN = new i0.InjectionToken('AegisJwtConfiguration');
    var DEFAULT_JWT_CONFIGURATION_TOKEN = new i0.InjectionToken('DefaultAegisJwtConfiguration');
    var JWT_REFRESH_CONFIGURATION_TOKEN = new i0.InjectionToken('AegisJwtRefreshConfiguration');
    var DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN = new i0.InjectionToken('DefaultAegisJwtRefreshConfiguration');

    var JwtRefreshStateService = /** @class */ (function () {
        function JwtRefreshStateService() {
            this.refreshLock$ = new rxjs.BehaviorSubject(false);
        }
        return JwtRefreshStateService;
    }());
    JwtRefreshStateService.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function JwtRefreshStateService_Factory() { return new JwtRefreshStateService(); }, token: JwtRefreshStateService, providedIn: "root" });
    JwtRefreshStateService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root',
                },] }
    ];

    var JwtTokenService = /** @class */ (function () {
        function JwtTokenService(httpHandler, jwtRefreshStateService, rawConfig, rawDefaultConfig, rawDefaultRefreshConfig, rawRefreshConfig, router) {
            var _a;
            this.httpHandler = httpHandler;
            this.jwtRefreshStateService = jwtRefreshStateService;
            this.rawConfig = rawConfig;
            this.rawDefaultConfig = rawDefaultConfig;
            this.rawDefaultRefreshConfig = rawDefaultRefreshConfig;
            this.rawRefreshConfig = rawRefreshConfig;
            this.router = router;
            this.config = Object.assign(Object.assign({}, this.rawDefaultConfig), this.rawConfig);
            this.refreshConfig = this.rawDefaultRefreshConfig && this.rawRefreshConfig
                ? Object.assign(Object.assign({}, this.rawDefaultRefreshConfig), this.rawRefreshConfig) : undefined;
            /**
             * Consider restricting getToken to observables only so things can be cached
             */
            this.rawAccessToken$ = intoObservable(this.config.getToken);
            this.rawRefreshToken$ = ((_a = this.refreshConfig) === null || _a === void 0 ? void 0 : _a.getRefreshToken) ? intoObservable(this.refreshConfig.getRefreshToken)
                : rxjs.of(null);
            this.accessToken$ = this.rawAccessToken$.pipe(operators.map(function (token) {
                if (isString(token)) {
                    var jwtToken = JwtToken.from(token);
                    if (!jwtToken) {
                        throw new Error('Non-valid token observed');
                    }
                    else {
                        return jwtToken;
                    }
                }
                else {
                    return null;
                }
            }));
            this.refreshToken$ = this.rawRefreshToken$.pipe(operators.map(function (refreshToken) {
                if (isString(refreshToken)) {
                    var jwtToken = JwtToken.from(refreshToken);
                    if (!jwtToken) {
                        throw new Error('Non-valid token observed');
                    }
                    else {
                        return jwtToken;
                    }
                }
                else {
                    return null;
                }
            }));
            this.accessTokenHeader$ = this.accessToken$.pipe(operators.map(function (token) { var _a; return (_a = token === null || token === void 0 ? void 0 : token.header) !== null && _a !== void 0 ? _a : null; }));
            this.accessTokenPayload$ = this.accessToken$.pipe(operators.map(function (token) { var _a; return (_a = token === null || token === void 0 ? void 0 : token.payload) !== null && _a !== void 0 ? _a : null; }));
            this.refreshTokenHeader$ = this.refreshToken$.pipe(operators.map(function (token) { var _a; return (_a = token === null || token === void 0 ? void 0 : token.header) !== null && _a !== void 0 ? _a : null; }));
            this.refreshTokenPayload$ = this.refreshToken$.pipe(operators.map(function (token) { var _a; return (_a = token === null || token === void 0 ? void 0 : token.payload) !== null && _a !== void 0 ? _a : null; }));
            this.isAccessTokenExpired$ = this.accessToken$.pipe(operators.switchMap(function (token) { return token ? isUnixTimestampExpiredNowAndWhenItIs(token.payload.exp) : rxjs.of(null); }));
            this.isRefreshTokenExpired$ = this.refreshToken$.pipe(operators.switchMap(function (token) { return token ? isUnixTimestampExpiredNowAndWhenItIs(token.payload.exp) : rxjs.of(null); }));
            this.isAccessTokenValid$ = this.isAccessTokenExpired$.pipe(operators.map(function (isExpired) { return isNotNullish(isExpired) && !isExpired; }));
            this.isRefreshTokenValid$ = this.isRefreshTokenExpired$.pipe(operators.map(function (isExpired) { return isNotNullish(isExpired) && !isExpired; }));
        }
        /**
         * Does a token refresh. Emits false if it failed, or true if succeeded.
         */
        JwtTokenService.prototype.manualRefresh = function () {
            var _this = this;
            if (this.refreshConfig) {
                return tryJwtRefresh(this.httpHandler, 'Access token not valid on guard activation', this.refreshConfig, this.jwtRefreshStateService.refreshLock$, function (refreshError) { return handleJwtError(JwtCouldntRefreshError.createErrorResponse(undefined, refreshError), _this.config, _this.refreshConfig, _this.router).pipe(operators.catchError(function () { return rxjs.of(false); })); }, function () { return rxjs.of(true); });
            }
            else {
                return rxjs.of(false);
            }
        };
        return JwtTokenService;
    }());
    JwtTokenService.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function JwtTokenService_Factory() { return new JwtTokenService(i0__namespace.ɵɵinject(i1__namespace.HttpHandler), i0__namespace.ɵɵinject(JwtRefreshStateService), i0__namespace.ɵɵinject(JWT_CONFIGURATION_TOKEN), i0__namespace.ɵɵinject(DEFAULT_JWT_CONFIGURATION_TOKEN), i0__namespace.ɵɵinject(DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN, 8), i0__namespace.ɵɵinject(JWT_REFRESH_CONFIGURATION_TOKEN, 8), i0__namespace.ɵɵinject(i4__namespace.Router, 8)); }, token: JwtTokenService, providedIn: "root" });
    JwtTokenService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root',
                },] }
    ];
    JwtTokenService.ctorParameters = function () { return [
        { type: i1.HttpHandler },
        { type: JwtRefreshStateService },
        { type: undefined, decorators: [{ type: i0.Inject, args: [JWT_CONFIGURATION_TOKEN,] }] },
        { type: undefined, decorators: [{ type: i0.Inject, args: [DEFAULT_JWT_CONFIGURATION_TOKEN,] }] },
        { type: undefined, decorators: [{ type: i0.Inject, args: [DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,] }, { type: i0.Optional }] },
        { type: undefined, decorators: [{ type: i0.Inject, args: [JWT_REFRESH_CONFIGURATION_TOKEN,] }, { type: i0.Optional }] },
        { type: i4.Router, decorators: [{ type: i0.Optional }] }
    ]; };

    var LoginGuard = /** @class */ (function () {
        function LoginGuard(jwtTokenService) {
            this.jwtTokenService = jwtTokenService;
            this.isAccessTokenValidOnce$ = this.jwtTokenService.isAccessTokenValid$.pipe(operators.take(1));
        }
        LoginGuard.prototype.canActivate = function (route, _state) {
            var data = route.data;
            return this.isValid(data === null || data === void 0 ? void 0 : data.isRefreshAllowed);
        };
        LoginGuard.prototype.canActivateChild = function (childRoute, _state) {
            var data = childRoute.data;
            return this.isValid(data === null || data === void 0 ? void 0 : data.isRefreshAllowed);
        };
        LoginGuard.prototype.canLoad = function (route, _segments) {
            var data = route.data;
            return this.isValid(data === null || data === void 0 ? void 0 : data.isRefreshAllowed);
        };
        LoginGuard.prototype.isValid = function (isRefreshAllowed) {
            var _this = this;
            var _a, _b;
            var allowed = (_b = isRefreshAllowed !== null && isRefreshAllowed !== void 0 ? isRefreshAllowed : (_a = this.jwtTokenService.refreshConfig) === null || _a === void 0 ? void 0 : _a.isAutoRefreshAllowedInLoginGuardByDefault) !== null && _b !== void 0 ? _b : DEFAULT_JWT_REFRESH_CONFIG_DEFAULT_AUTO_IN_GUARD;
            return this.isAccessTokenValidOnce$.pipe(operators.switchMap(function (isValid) {
                if (!isValid && allowed) {
                    return _this.jwtTokenService.manualRefresh();
                }
                else {
                    return rxjs.of(isValid);
                }
            }));
        };
        return LoginGuard;
    }());
    LoginGuard.ɵprov = i0__namespace.ɵɵdefineInjectable({ factory: function LoginGuard_Factory() { return new LoginGuard(i0__namespace.ɵɵinject(JwtTokenService)); }, token: LoginGuard, providedIn: "root" });
    LoginGuard.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root',
                },] }
    ];
    LoginGuard.ctorParameters = function () { return [
        { type: JwtTokenService }
    ]; };

    /**
     * If configured, handles authentication errors with custom callbacks
     * or redirects
     */
    var JwtErrorHandlingInterceptor = /** @class */ (function () {
        function JwtErrorHandlingInterceptor(jwtConfig, defaultJwtConfig, refreshConfig, defaultJwtRefreshConfig, router) {
            this.router = router;
            this.jwtConfiguration = Object.assign(Object.assign({}, defaultJwtConfig), jwtConfig);
            this.jwtRefreshConfiguration =
                defaultJwtRefreshConfig && refreshConfig
                    ? Object.assign(Object.assign({}, defaultJwtRefreshConfig), refreshConfig) : undefined;
        }
        JwtErrorHandlingInterceptor.prototype.intercept = function (request, next) {
            var _this = this;
            return next
                .handle(request)
                .pipe(operators.catchError(function (errorResponse) { return handleJwtError(errorResponse, _this.jwtConfiguration, _this.jwtRefreshConfiguration, _this.router); }));
        };
        return JwtErrorHandlingInterceptor;
    }());
    JwtErrorHandlingInterceptor.decorators = [
        { type: i0.Injectable }
    ];
    JwtErrorHandlingInterceptor.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: i0.Inject, args: [JWT_CONFIGURATION_TOKEN,] }] },
        { type: undefined, decorators: [{ type: i0.Inject, args: [DEFAULT_JWT_CONFIGURATION_TOKEN,] }] },
        { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [JWT_REFRESH_CONFIGURATION_TOKEN,] }] },
        { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,] }] },
        { type: i4.Router, decorators: [{ type: i0.Optional }] }
    ]; };

    var matchRule = function (rule, against) {
        if (isString(rule)) {
            return rule === against;
        }
        else if (against) {
            return rule.test(against);
        }
        else {
            return false;
        }
    };
    /**
     *
     * @param inverse easy negating when composing
     */
    var matchAgainst = function (against, inverse) {
        if (inverse === void 0) { inverse = false; }
        return function (rule) { return (inverse ? !matchRule(rule, against) : matchRule(rule, against)); };
    };

    /**
     * Matches the filter against a separated url. Non-existend rulesets
     * automatically pass. **Empty whitelist rulesets never pass.** Empty blacklist
     * rulesets always pass.
     */
    var checkAgainstUrlFilter = function (urlFilter, _k) {
        var domain = _k.domain, path = _k.path, protocol = _k.protocol;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        var protocolMatcher = matchAgainst(protocol);
        var domainMatcher = matchAgainst(domain);
        var pathMatcher = matchAgainst(path);
        var protocolWhitelistRulesPass = (_b = (_a = urlFilter.protocolWhitelist) === null || _a === void 0 ? void 0 : _a.some(protocolMatcher)) !== null && _b !== void 0 ? _b : true;
        var protocolBlacklistRulesPass = !((_c = urlFilter.protocolBlacklist) === null || _c === void 0 ? void 0 : _c.some(protocolMatcher));
        var domainWhitelistRulesPass = (_e = (_d = urlFilter.domainWhitelist) === null || _d === void 0 ? void 0 : _d.some(domainMatcher)) !== null && _e !== void 0 ? _e : true;
        var domainBlacklistRulesPass = !((_f = urlFilter.domainBlacklist) === null || _f === void 0 ? void 0 : _f.some(domainMatcher));
        var pathWhitelistRulesPass = (_h = (_g = urlFilter.pathWhitelist) === null || _g === void 0 ? void 0 : _g.some(pathMatcher)) !== null && _h !== void 0 ? _h : true;
        var pathBlacklistRulesPass = !((_j = urlFilter.pathBlacklist) === null || _j === void 0 ? void 0 : _j.some(pathMatcher));
        return (protocolWhitelistRulesPass &&
            protocolBlacklistRulesPass &&
            domainWhitelistRulesPass &&
            domainBlacklistRulesPass &&
            pathWhitelistRulesPass &&
            pathBlacklistRulesPass);
    };

    /**
     * Returns the url split into parts, without the separators.
     * Separator between protocol and domain is `://`, and between domain
     * and path is `/`.
     */
    var separateUrl = function (url) {
        var urlMatch = url === null || url === void 0 ? void 0 : url.match(/^((.*):\/\/)?([^/].*?)?(\/(.*))?$/);
        return {
            protocol: urlMatch === null || urlMatch === void 0 ? void 0 : urlMatch[2],
            domain: urlMatch === null || urlMatch === void 0 ? void 0 : urlMatch[3],
            path: urlMatch === null || urlMatch === void 0 ? void 0 : urlMatch[5],
        };
    };

    var JwtInjectorInterceptor = /** @class */ (function () {
        function JwtInjectorInterceptor(jwtConfig, defaultJwtConfig, refreshConfig, defaultJwtRefreshConfig) {
            this.jwtConfiguration = Object.assign(Object.assign({}, defaultJwtConfig), jwtConfig);
            this.jwtRefreshConfiguration = refreshConfig &&
                defaultJwtRefreshConfig && Object.assign(Object.assign({}, defaultJwtRefreshConfig), refreshConfig);
        }
        JwtInjectorInterceptor.prototype.intercept = function (request, next) {
            var _this = this;
            var separatedUrl = separateUrl(request.url);
            return intoObservable(this.jwtConfiguration.getToken).pipe(operators.take(1), operators.switchMap(function (rawToken) {
                if (checkAgainstUrlFilter(_this.jwtConfiguration, separatedUrl)) {
                    var token = rawToken && JwtToken.from(rawToken);
                    var isAccessTokenExpiredOrInvalid = !token || token.isExpired();
                    // If there is a token to inject
                    if (rawToken &&
                        (!isAccessTokenExpiredOrInvalid || _this.jwtRefreshConfiguration)) {
                        var cloned = request.clone({
                            headers: request.headers.set(_this.jwtConfiguration.header, _this.jwtConfiguration.scheme
                                ? _this.jwtConfiguration.scheme + rawToken
                                : rawToken),
                        });
                        if (_this.jwtConfiguration.handleWithCredentials) {
                            cloned = cloned.clone({
                                withCredentials: true,
                            });
                        }
                        return next.handle(cloned);
                    }
                    else {
                        return rxjs.throwError(JwtError.createErrorResponse(request, 'Token is expired or invalid, and refresh is not configured.'));
                    }
                }
                else {
                    return next.handle(request);
                }
            }));
        };
        return JwtInjectorInterceptor;
    }());
    JwtInjectorInterceptor.decorators = [
        { type: i0.Injectable }
    ];
    JwtInjectorInterceptor.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: i0.Inject, args: [JWT_CONFIGURATION_TOKEN,] }] },
        { type: undefined, decorators: [{ type: i0.Inject, args: [DEFAULT_JWT_CONFIGURATION_TOKEN,] }] },
        { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [JWT_REFRESH_CONFIGURATION_TOKEN,] }] },
        { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,] }] }
    ]; };

    var JwtRefreshInterceptor = /** @class */ (function () {
        function JwtRefreshInterceptor(jwtConfig, defaultJwtConfig, refreshConfig, defaultJwtRefreshConfig, jwtRefreshStateService, jwtTokenService) {
            var _a;
            this.jwtConfig = jwtConfig;
            this.defaultJwtConfig = defaultJwtConfig;
            this.refreshConfig = refreshConfig;
            this.defaultJwtRefreshConfig = defaultJwtRefreshConfig;
            this.jwtRefreshStateService = jwtRefreshStateService;
            this.jwtTokenService = jwtTokenService;
            this.jwtConfiguration = Object.assign(Object.assign({}, defaultJwtConfig), jwtConfig);
            this.jwtRefreshConfiguration = Object.assign(Object.assign({}, defaultJwtRefreshConfig), refreshConfig);
            this.rawRefreshToken$ = intoObservable((_a = this.jwtRefreshConfiguration.getRefreshToken) !== null && _a !== void 0 ? _a : (function () { return null; }));
            this.isRawRefreshTokenGetterAvailable = !!this.jwtRefreshConfiguration.getRefreshToken;
        }
        JwtRefreshInterceptor.prototype.handleWithToken = function (request, next, token) {
            var requestWithUpdatedTokens = request.clone({
                headers: request.headers.set(this.jwtConfiguration.header, this.jwtConfiguration.scheme + token),
            });
            return next.handle(requestWithUpdatedTokens);
        };
        JwtRefreshInterceptor.prototype.intercept = function (request, next) {
            var _this = this;
            var separatedUrl = separateUrl(request.url);
            var jwtHeaderValue = request.headers.get(this.jwtConfiguration.header);
            // Only do something if the request is headed towards a protected endpoint.
            // The forRoot method of the module ensures that this interceptor is injected
            // after the token injector interceptor. So by the time this executes, the token should
            // be here.
            // And if the url is not the refresh url itself, and any of the other explicitly
            // filtered urls where refresh is prohibited by config.
            if (jwtHeaderValue &&
                !matchAgainst(request.url)(this.jwtRefreshConfiguration.refreshUrl) &&
                checkAgainstUrlFilter(this.jwtRefreshConfiguration, separatedUrl)) {
                // If locked, instead of refreshing, wait for it and get the new accessToken
                if (this.jwtRefreshStateService.refreshLock$.value) {
                    // When the lock unlocks, retry with the new token
                    return this.jwtRefreshStateService.refreshLock$.pipe(operators.filter(function (lock) { return !lock; }), operators.take(1), operators.withLatestFrom(this.jwtTokenService.rawAccessToken$), operators.switchMap(function (_b) {
                        var _c = __read(_b, 2), accessToken = _c[1];
                        // ...but only if there is actually a token
                        if (accessToken) {
                            return _this.handleWithToken(request, next, accessToken);
                        }
                        else {
                            return rxjs.throwError(JwtError.createErrorResponse(request, 'No access token available after waiting for a refresh'));
                        }
                    }));
                }
                return this.rawRefreshToken$.pipe(operators.take(1), operators.switchMap(function (rawRefreshToken) {
                    var rawToken = JwtToken.stripScheme(jwtHeaderValue, _this.jwtConfiguration.scheme);
                    var token = JwtToken.from(rawToken);
                    var refreshToken = rawRefreshToken ? JwtToken.from(rawRefreshToken) : null;
                    var isAccessTokenExpiredOrInvalid = !token || token.isExpired();
                    var isRefreshTokenExpiredOrInvalid = !refreshToken || refreshToken.isExpired();
                    // If we know beforehand that nothing can be done, panic.
                    if (isAccessTokenExpiredOrInvalid &&
                        _this.isRawRefreshTokenGetterAvailable &&
                        isRefreshTokenExpiredOrInvalid) {
                        return rxjs.throwError(JwtCannotRefreshError.createErrorResponse(request, 'Both access and refresh tokens are expired'));
                    }
                    // If the conversion would fail, that would handle the same as an expired token
                    return (isAccessTokenExpiredOrInvalid
                        ? // If the token is used and is expired, don't even try the request.
                            rxjs.throwError('Expired token, refresh first')
                        : // If it seems okay, try the request
                            next.handle(request)).pipe(operators.catchError(function (error) {
                        // If the request failed, or we failed at the precheck
                        // Acquire a new token, but only if the error is allowing it
                        // If a refresh is already happening, wait for it, and use it's results
                        return tryJwtRefresh(next, error, _this.jwtRefreshConfiguration, _this.jwtRefreshStateService.refreshLock$, function (refreshError) { return rxjs.throwError(JwtCouldntRefreshError.createErrorResponse(request, refreshError)); }, function (refreshResponse) { return _this.handleWithToken(request, next, refreshResponse.accessToken); });
                    }));
                }));
            }
            else {
                return next.handle(request);
            }
        };
        return JwtRefreshInterceptor;
    }());
    JwtRefreshInterceptor.decorators = [
        { type: i0.Injectable }
    ];
    JwtRefreshInterceptor.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: i0.Inject, args: [JWT_CONFIGURATION_TOKEN,] }] },
        { type: undefined, decorators: [{ type: i0.Inject, args: [DEFAULT_JWT_CONFIGURATION_TOKEN,] }] },
        { type: undefined, decorators: [{ type: i0.Inject, args: [JWT_REFRESH_CONFIGURATION_TOKEN,] }] },
        { type: undefined, decorators: [{ type: i0.Inject, args: [DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,] }] },
        { type: JwtRefreshStateService },
        { type: JwtTokenService }
    ]; };

    /**
     * Helps you define a JwtConfigurationProvider
     *
     * @internal
     */
    var createJwtConfigurationProvider = function (tokenConfigurationProvider) { return (Object.assign({ provide: JWT_CONFIGURATION_TOKEN, multi: false }, tokenConfigurationProvider)); };

    /**
     * Helps you define a JwtConfigurationProvider
     *
     * @internal
     */
    var createJwtRefreshConfigurationProvider = function (tokenRefreshConfigurationProvider) { return (Object.assign({ provide: JWT_REFRESH_CONFIGURATION_TOKEN, multi: false }, tokenRefreshConfigurationProvider)); };

    /**
     * This module needs to be configured to use. See the
     * {@link JwtModule#forRoot | forRoot} method for more information.
     *
     * tokens. So that other, plug in configration modules can provide them.
     * Like Ngrx and Local. They then transform their configs into this common one.
     */
    var JwtModule = /** @class */ (function () {
        function JwtModule() {
        }
        JwtModule.forRoot = function (jwtModuleConfigurationProvider, jwtRefreshConfigurationProvider) {
            return {
                ngModule: JwtModule,
                providers: __spread([
                    {
                        provide: i1.HTTP_INTERCEPTORS,
                        useClass: JwtErrorHandlingInterceptor,
                        multi: true,
                    },
                    {
                        provide: i1.HTTP_INTERCEPTORS,
                        useClass: JwtInjectorInterceptor,
                        multi: true,
                    },
                    {
                        provide: DEFAULT_JWT_CONFIGURATION_TOKEN,
                        useValue: DEFAULT_JWT_CONFIG,
                    },
                    createJwtConfigurationProvider(jwtModuleConfigurationProvider)
                ], (jwtRefreshConfigurationProvider
                    ? [
                        {
                            provide: i1.HTTP_INTERCEPTORS,
                            useClass: JwtRefreshInterceptor,
                            multi: true,
                        },
                        {
                            provide: DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN,
                            useValue: DEFAULT_JWT_REFRESH_CONFIG,
                        },
                        createJwtRefreshConfigurationProvider(jwtRefreshConfigurationProvider),
                    ]
                    : [])),
            };
        };
        return JwtModule;
    }());
    JwtModule.decorators = [
        { type: i0.NgModule, args: [{
                    imports: [common.CommonModule],
                },] }
    ];

    // eslint-disable-next-line no-shadow
    exports.HttpMethod = void 0;
    (function (HttpMethod) {
        HttpMethod["GET"] = "GET";
        HttpMethod["HEAD"] = "HEAD";
        HttpMethod["POST"] = "POST";
        HttpMethod["PUT"] = "PUT";
        HttpMethod["DELETE"] = "DELETE";
        HttpMethod["CONNECT"] = "CONNECT";
        HttpMethod["OPTIONS"] = "OPTIONS";
        HttpMethod["TRACE"] = "TRACE";
        HttpMethod["PATCH"] = "PATCH";
    })(exports.HttpMethod || (exports.HttpMethod = {}));

    /**
     * Generated bundle index. Do not edit.
     */

    exports.DEFAULT_HEADER_CONFIG = DEFAULT_HEADER_CONFIG;
    exports.DEFAULT_JWT_CONFIG = DEFAULT_JWT_CONFIG;
    exports.DEFAULT_JWT_HEADER = DEFAULT_JWT_HEADER;
    exports.DEFAULT_JWT_REFRESH_CONFIG = DEFAULT_JWT_REFRESH_CONFIG;
    exports.DEFAULT_JWT_REFRESH_CONFIG_DEFAULT_AUTO_IN_GUARD = DEFAULT_JWT_REFRESH_CONFIG_DEFAULT_AUTO_IN_GUARD;
    exports.DEFAULT_JWT_SCHEME = DEFAULT_JWT_SCHEME;
    exports.JwtModule = JwtModule;
    exports.JwtRefreshStateService = JwtRefreshStateService;
    exports.JwtToken = JwtToken;
    exports.JwtTokenService = JwtTokenService;
    exports.LoginGuard = LoginGuard;
    exports.createJwtConfigurationProvider = createJwtConfigurationProvider;
    exports.createJwtRefreshConfigurationProvider = createJwtRefreshConfigurationProvider;
    exports.isUnixTimestampExpired = isUnixTimestampExpired;
    exports.ɵa = JwtTokenService;
    exports.ɵb = JWT_CONFIGURATION_TOKEN;
    exports.ɵc = DEFAULT_JWT_CONFIGURATION_TOKEN;
    exports.ɵd = JWT_REFRESH_CONFIGURATION_TOKEN;
    exports.ɵe = DEFAULT_JWT_REFRESH_CONFIGURATION_TOKEN;
    exports.ɵf = JwtRefreshStateService;
    exports.ɵg = JwtErrorHandlingInterceptor;
    exports.ɵh = JwtInjectorInterceptor;
    exports.ɵi = JwtRefreshInterceptor;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=aegis-auth-jwt.umd.js.map
