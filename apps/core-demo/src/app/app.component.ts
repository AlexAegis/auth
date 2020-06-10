import { BaseDirective } from '@aegis-auth/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'aegis-auth-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends BaseDirective {
	public title = 'core-demo';
}
