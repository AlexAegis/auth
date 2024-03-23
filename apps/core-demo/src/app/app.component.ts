import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

@Component({
	selector: 'aegis-auth-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
	faGithub = faGithub;
	homepage = 'https://www.github.com/AlexAegis/auth';
}
