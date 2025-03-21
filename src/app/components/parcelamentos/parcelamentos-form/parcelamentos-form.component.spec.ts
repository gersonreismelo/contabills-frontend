import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelamentosFormComponent } from './parcelamentos-form.component';

describe('ParcelamentosFormComponent', () => {
  let component: ParcelamentosFormComponent;
  let fixture: ComponentFixture<ParcelamentosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelamentosFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ParcelamentosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
