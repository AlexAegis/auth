import { Inject, Injectable, Optional } from '@angular/core';
import { take, tap } from 'rxjs/operators';
import { HeaderConfiguration } from '../model';
import {
	DefaultHeaderConfigurationToken,
	HeaderConfigurationToken,
} from '../token/core-configuration.token';
import { BaseConfigService } from './base-config-service.class';

@Injectable({
	providedIn: 'root',
})
export class ConfigService extends BaseConfigService {
	public constructor(
		@Inject(HeaderConfigurationToken)
		protected readonly rawConfigs: HeaderConfiguration[] = [],
		@Optional()
		@Inject(DefaultHeaderConfigurationToken)
		protected readonly defaultBasicConfig?: Partial<HeaderConfiguration>
	) {
		super(rawConfigs, defaultConfig);
		// TODO: refactor to an array configs
		console.log('rawConfig', this.rawConfigs);
		this.configs$
			.pipe(
				take(1),
				tap((configs) => console.log('CORE ConfigService', configs))
			)
			.subscribe();

		console.log('CORE ConfigService injected default config:', this.defaultConfig);
	}
}
