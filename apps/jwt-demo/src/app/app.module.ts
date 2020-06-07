import { AuthCoreModule, createHeaderProvider } from '@aegis-auth/core';
import { createJwtProvider, JwtModule } from '@aegis-auth/jwt';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { AppComponent } from './app.component';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		RouterModule.forRoot([], { initialNavigation: 'enabled' }),
		AuthCoreModule.forRoot(
			createHeaderProvider({ useValue: { getValue: of('coremod'), header: 'Test' } })
		),
		JwtModule.forRoot(createJwtProvider({ useValue: { getValue: of('jwt'), type: 'basic' } })),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
