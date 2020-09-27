(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define('@aegis-auth/ngrx', ['exports', '@angular/core', '@angular/common'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['aegis-auth'] = global['aegis-auth'] || {}, global['aegis-auth'].ngrx = {}), global.ng.core, global.ng.common));
}(this, (function (exports, core, common) { 'use strict';

    var NgrxModule = /** @class */ (function () {
        function NgrxModule() {
        }
        return NgrxModule;
    }());
    NgrxModule.decorators = [
        { type: core.NgModule, args: [{
                    imports: [common.CommonModule],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.NgrxModule = NgrxModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=aegis-auth-ngrx.umd.js.map
