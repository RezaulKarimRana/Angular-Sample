import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditApproverGroupComponent } from './add-edit-approver-group.component';

describe('AddEditApproverGroupComponent', () => {
  let component: AddEditApproverGroupComponent;
  let fixture: ComponentFixture<AddEditApproverGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditApproverGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditApproverGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
