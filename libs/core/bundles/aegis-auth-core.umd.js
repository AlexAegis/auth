(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('@aegis-auth/core', ['exports', '@angular/common', '@angular/core'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['aegis-auth'] = global['aegis-auth'] || {}, global['aegis-auth'].core = {}), global.ng.common, global.ng.core));
}(this, (function (exports, common, core) { 'use strict';

    var AuthCoreModule = /** @class */ (function () {
        function AuthCoreModule() {
        }
        return AuthCoreModule;
    }());
    AuthCoreModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.AuthCoreModule = AuthCoreModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=aegis-auth-core.umd.js.map
