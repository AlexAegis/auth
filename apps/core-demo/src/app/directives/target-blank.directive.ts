import { Directive, HostBinding } from '@angular/core';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'a[target=_blank]',
})
export class TargetBlankDirective {
	@HostBinding('attr.rel')
	rel = 'noopener noreferrer';
}
