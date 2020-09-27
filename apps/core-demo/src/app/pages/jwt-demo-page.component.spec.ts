import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtDemoPageComponent } from './jwt-demo-page.component';

describe('JwtDemoPageComponent', () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterTestingModule, HttpClientModule],
			declarations: [JwtDemoPageComponent],
		}).compileComponents();
	});

	it('should create the app', () => {
		const fixture = TestBed.createComponent(JwtDemoPageComponent);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});
});
