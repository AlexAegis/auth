import { BehaviorSubject } from 'rxjs';
import { HeaderConfiguration } from '../model';

export class BaseConfigService {
	public readonly configs$ = new BehaviorSubject<HeaderConfiguration[]>(
		this.rawConfigs.map((rawConfig) => ({
			...this.defaultConfig,
			...rawConfig,
		}))
	);

	/*
	public readonly vals$ = this.configs$.pipe(
		switchMap(configs => {

			configs.map(config => config.)
	);*/

	public constructor(
		protected readonly rawConfigs: HeaderConfiguration[] = [],
		protected readonly defaultConfig: Partial<HeaderConfiguration>
	) {}
}
