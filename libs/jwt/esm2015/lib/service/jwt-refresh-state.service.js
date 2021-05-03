import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class JwtRefreshStateService {
    constructor() {
        this.refreshLock$ = new BehaviorSubject(false);
    }
}
JwtRefreshStateService.ɵprov = i0.ɵɵdefineInjectable({ factory: function JwtRefreshStateService_Factory() { return new JwtRefreshStateService(); }, token: JwtRefreshStateService, providedIn: "root" });
JwtRefreshStateService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
            },] }
];
//# sourceMappingURL=jwt-refresh-state.service.js.map