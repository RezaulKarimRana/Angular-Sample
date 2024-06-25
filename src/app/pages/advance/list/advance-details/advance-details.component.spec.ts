import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceDetailsComponent } from './advance-details.component';

describe('AdvanceDetailsComponent', () => {
  let component: AdvanceDetailsComponent;
  let fixture: ComponentFixture<AdvanceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
