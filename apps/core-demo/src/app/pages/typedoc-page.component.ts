import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	templateUrl: './typedoc-page.component.html',
	styleUrls: ['./typedoc-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TypedocPageComponent {
	typedocUrl = this.sanitizer.bypassSecurityTrustResourceUrl('./typedoc/');
	constructor(private sanitizer: DomSanitizer) {}
}
