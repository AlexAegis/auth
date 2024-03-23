import { JwtModule } from '@aegis-auth/jwt';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				HttpClientModule,
				FormsModule,
				RouterModule.forRoot([]),
				JwtModule.forRoot(
					{
						useValue: {
							getToken: () => 'authService.accessTokenStorage$',
						},
					},
					{ useValue: {} },
				),
			],
			providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
			declarations: [DashboardComponent],
		}).compileComponents();
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(DashboardComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});

	it("should have as title 'jwt-demo'", () => {
		const fixture = TestBed.createComponent(DashboardComponent);
		const app = fixture.componentInstance;
		expect(app.title).toEqual('jwt-demo');
	});

	it('should render title', () => {
		const fixture = TestBed.createComponent(DashboardComponent);
		fixture.detectChanges();
		const compiled = fixture.nativeElement;
		expect(compiled.querySelector('h1').textContent).toContain('jwt-demo');
	});
});
