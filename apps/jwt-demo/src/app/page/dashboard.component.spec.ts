import { JwtModule } from '@aegis-auth/jwt';
import { HttpClientModule } from '@angular/common/http';
import { async, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientModule,
				JwtModule.forRoot(
					{
						useValue: {
							getToken: () => 'authService.accessTokenStorage$',
						},
					},
					{ useValue: {} }
				),
			],
			declarations: [DashboardComponent],
		}).compileComponents();
	}));

	it('should create the app', () => {
		const fixture = TestBed.createComponent(DashboardComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});

	it(`should have as title 'jwt-demo'`, () => {
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
