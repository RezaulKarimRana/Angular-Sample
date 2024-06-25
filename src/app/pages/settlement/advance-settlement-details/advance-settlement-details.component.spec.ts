import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceSettlementDetailsComponent } from './advance-settlement-details.component';

describe('AdvanceSettlementDetailsComponent', () => {
  let component: AdvanceSettlementDetailsComponent;
  let fixture: ComponentFixture<AdvanceSettlementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceSettlementDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceSettlementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
