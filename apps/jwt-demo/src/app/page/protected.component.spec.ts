import { APP_BASE_HREF } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ProtectedComponent } from './protected.component';

describe('ProtectedComponent', () => {
	let component: ProtectedComponent;
	let fixture: ComponentFixture<ProtectedComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RouterModule.forRoot([])],
			providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
			declarations: [ProtectedComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ProtectedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => expect(component).toBeTruthy());
});
