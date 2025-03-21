import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParcelamentosListComponent } from './parcelamentos-list.component';

describe('ParcelamentosComponent', () => {
  let component: ParcelamentosListComponent;
  let fixture: ComponentFixture<ParcelamentosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParcelamentosListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ParcelamentosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
