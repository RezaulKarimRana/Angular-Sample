import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverEntryComponent } from './approver-entry.component';

describe('ApproverEntryComponent', () => {
  let component: ApproverEntryComponent;
  let fixture: ComponentFixture<ApproverEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproverEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproverEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
