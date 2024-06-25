import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedBudgetDetailsComponent } from './advanced-budget-details.component';

describe('AdvancedBudgetDetailsComponent', () => {
  let component: AdvancedBudgetDetailsComponent;
  let fixture: ComponentFixture<AdvancedBudgetDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedBudgetDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedBudgetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
