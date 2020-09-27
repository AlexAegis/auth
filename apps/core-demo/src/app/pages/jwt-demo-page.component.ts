import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	templateUrl: './jwt-demo-page.component.html',
	styleUrls: ['./jwt-demo-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JwtDemoPageComponent {
	jwtDemoUrl = this.sanitizer.bypassSecurityTrustResourceUrl('./apps/jwt-demo/');
	constructor(private sanitizer: DomSanitizer) {}
}
