import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverSubGroupUserListComponent } from './approver-sub-group-user-list.component';

describe('ApproverSubGroupUserListComponent', () => {
  let component: ApproverSubGroupUserListComponent;
  let fixture: ComponentFixture<ApproverSubGroupUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproverSubGroupUserListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproverSubGroupUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
