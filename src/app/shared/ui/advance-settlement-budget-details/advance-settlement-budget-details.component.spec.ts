import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceSettlementBudgetDetailsComponent } from './advance-settlement-budget-details.component';

describe('AdvanceSettlementBudgetDetailsComponent', () => {
  let component: AdvanceSettlementBudgetDetailsComponent;
  let fixture: ComponentFixture<AdvanceSettlementBudgetDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceSettlementBudgetDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceSettlementBudgetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
