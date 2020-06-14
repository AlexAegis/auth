import { BehaviorSubject } from 'rxjs';
import { BaseDirective } from '../component';

export class BaseConfigService<T> extends BaseDirective {
	public readonly config$ = new BehaviorSubject<T>({
		...this.defaultConfig,
		...this.rawConfig,
	});

	public constructor(
		protected readonly rawConfig: T,
		protected readonly defaultConfig: Partial<T>
	) {
		super();
	}
}
