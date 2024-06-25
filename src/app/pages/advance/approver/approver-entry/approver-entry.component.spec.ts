import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdvanceApproverEntryComponent } from './approver-entry.component';

describe('AdvanceApproverEntryComponent', () => {
  let component: AdvanceApproverEntryComponent;
  let fixture: ComponentFixture<AdvanceApproverEntryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceApproverEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceApproverEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
