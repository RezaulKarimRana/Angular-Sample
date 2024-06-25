import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceSettlementParticularAddEditComponent } from './advance-settlement-particular-add-edit.component';

describe('AdvanceSettlementParticularAddEditComponent', () => {
  let component: AdvanceSettlementParticularAddEditComponent;
  let fixture: ComponentFixture<AdvanceSettlementParticularAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceSettlementParticularAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceSettlementParticularAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
