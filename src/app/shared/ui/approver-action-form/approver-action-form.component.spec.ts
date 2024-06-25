import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverActionFormComponent } from './approver-action-form.component';

describe('ApproverActionFormComponent', () => {
  let component: ApproverActionFormComponent;
  let fixture: ComponentFixture<ApproverActionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproverActionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproverActionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
