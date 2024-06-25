import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeSettlementComponent } from './make-settlement.component';

describe('MakeSettlementComponent', () => {
  let component: MakeSettlementComponent;
  let fixture: ComponentFixture<MakeSettlementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeSettlementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeSettlementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
