import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'aegis-auth-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
	public title = 'core-demo';
}
