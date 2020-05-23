import { countInString } from '@aegis-auth/token';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
	imports: [CommonModule],
})
export class AuthCoreModule {
	constructor() {
		console.log('AuthCoreModule loaded');
		this.toto();
	}

	toto() {
		const aCount = countInString('aaa', 'a');
		console.log(aCount);
	}
}
