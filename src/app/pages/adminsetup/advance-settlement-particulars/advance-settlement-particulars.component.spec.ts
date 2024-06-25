import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceSettlementParticularsComponent } from './advance-settlement-particulars.component';

describe('AdvanceSettlementParticularsComponent', () => {
  let component: AdvanceSettlementParticularsComponent;
  let fixture: ComponentFixture<AdvanceSettlementParticularsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceSettlementParticularsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceSettlementParticularsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
