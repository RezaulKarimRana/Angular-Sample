import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditApproverSubGroupComponent } from './add-edit-approver-sub-group.component';

describe('AddEditApproverSubGroupComponent', () => {
  let component: AddEditApproverSubGroupComponent;
  let fixture: ComponentFixture<AddEditApproverSubGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditApproverSubGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditApproverSubGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
