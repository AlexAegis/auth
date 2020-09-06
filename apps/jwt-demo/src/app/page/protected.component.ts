import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	templateUrl: './protected.component.html',
	styleUrls: ['./protected.component.css'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProtectedComponent {}
