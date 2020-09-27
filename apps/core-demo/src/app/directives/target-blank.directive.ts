import { Directive, HostBinding } from '@angular/core';

@Directive({
	// tslint:disable-next-line: directive-selector
	selector: 'a[target=_blank]',
})
export class TargetBlankDirective {
	@HostBinding('attr.rel')
	rel = 'noopener noreferrer';
}
