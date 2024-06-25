import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverActionSummaryComponent } from './approver-action-summary.component';

describe('ApproverActionSummaryComponent', () => {
  let component: ApproverActionSummaryComponent;
  let fixture: ComponentFixture<ApproverActionSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproverActionSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproverActionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
