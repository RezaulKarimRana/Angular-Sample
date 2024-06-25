import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverSubGroupListComponent } from './approver-sub-group-list.component';

describe('ApproverSubGroupListComponent', () => {
  let component: ApproverSubGroupListComponent;
  let fixture: ComponentFixture<ApproverSubGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproverSubGroupListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproverSubGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
