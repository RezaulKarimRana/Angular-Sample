import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverGroupListComponent } from './approver-group-list.component';

describe('ApproverGroupListComponent', () => {
  let component: ApproverGroupListComponent;
  let fixture: ComponentFixture<ApproverGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproverGroupListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproverGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
