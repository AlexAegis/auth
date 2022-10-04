import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as i0 from "@angular/core";
export class JwtRefreshStateService {
    constructor() {
        this.refreshLock$ = new BehaviorSubject(false);
    }
}
JwtRefreshStateService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.2.4", ngImport: i0, type: JwtRefreshStateService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
JwtRefreshStateService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.2.4", ngImport: i0, type: JwtRefreshStateService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.2.4", ngImport: i0, type: JwtRefreshStateService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiand0LXJlZnJlc2gtc3RhdGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL2xpYnMvand0L3NyYy9saWIvc2VydmljZS9qd3QtcmVmcmVzaC1zdGF0ZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLE1BQU0sQ0FBQzs7QUFLdkMsTUFBTSxPQUFPLHNCQUFzQjtJQUhuQztRQUlpQixpQkFBWSxHQUFHLElBQUksZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzFEOzttSEFGWSxzQkFBc0I7dUhBQXRCLHNCQUFzQixjQUZ0QixNQUFNOzJGQUVOLHNCQUFzQjtrQkFIbEMsVUFBVTttQkFBQztvQkFDWCxVQUFVLEVBQUUsTUFBTTtpQkFDbEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuQEluamVjdGFibGUoe1xuXHRwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIEp3dFJlZnJlc2hTdGF0ZVNlcnZpY2Uge1xuXHRwdWJsaWMgcmVhZG9ubHkgcmVmcmVzaExvY2skID0gbmV3IEJlaGF2aW9yU3ViamVjdChmYWxzZSk7XG59XG4iXX0=