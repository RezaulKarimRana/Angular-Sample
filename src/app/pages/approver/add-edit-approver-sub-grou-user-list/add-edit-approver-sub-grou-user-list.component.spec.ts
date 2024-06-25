import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditApproverSubGrouUserListComponent } from './add-edit-approver-sub-grou-user-list.component';

describe('AddEditApproverSubGrouUserListComponent', () => {
  let component: AddEditApproverSubGrouUserListComponent;
  let fixture: ComponentFixture<AddEditApproverSubGrouUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditApproverSubGrouUserListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditApproverSubGrouUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
