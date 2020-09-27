import { DEFAULT_HEADER_CONFIG, } from '../model/header-configuration.interface';
export const DEFAULT_JWT_HEADER = 'Authorization';
export const DEFAULT_JWT_SCHEME = 'Bearer ';
export const DEFAULT_JWT_CONFIG = Object.assign(Object.assign({}, DEFAULT_HEADER_CONFIG), { header: DEFAULT_JWT_HEADER, scheme: DEFAULT_JWT_SCHEME, handleWithCredentials: true });
export const DEFAULT_JWT_REFRESH_CONFIG_DEFAULT_AUTO_IN_GUARD = true;
export const DEFAULT_JWT_REFRESH_CONFIG = {
    method: 'POST',
    errorCodeWhitelist: [401],
    isAutoRefreshAllowedInLoginGuardByDefault: DEFAULT_JWT_REFRESH_CONFIG_DEFAULT_AUTO_IN_GUARD,
};
//# sourceMappingURL=auth-core-configuration.interface.js.map