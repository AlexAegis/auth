import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppComponent } from './app.component';
import { TargetBlankDirective } from './directives/target-blank.directive';
import { MaterialModule } from './modules/material.module';
import { JwtDemoPageComponent } from './pages/jwt-demo-page.component';
import { TypedocPageComponent } from './pages/typedoc-page.component';

@NgModule({
	declarations: [AppComponent, TypedocPageComponent, TargetBlankDirective],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		MaterialModule,
		FontAwesomeModule,
		RouterModule.forRoot(
			[
				{
					path: 'typedoc',
					component: TypedocPageComponent,
				},
				{
					path: 'jwt',
					component: JwtDemoPageComponent,
				},
			],
			{ initialNavigation: 'enabledBlocking' },
		),
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
