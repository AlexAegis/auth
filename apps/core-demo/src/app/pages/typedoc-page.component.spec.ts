import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TypedocPageComponent } from './typedoc-page.component';

describe('TypedocPageComponent', () => {
	let component: TypedocPageComponent;
	let fixture: ComponentFixture<TypedocPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TypedocPageComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TypedocPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
