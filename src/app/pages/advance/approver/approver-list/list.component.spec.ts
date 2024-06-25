import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdvanceApproverListComponent } from './list.component';

describe('AdvanceApproverListComponent', () => {
  let component: AdvanceApproverListComponent;
  let fixture: ComponentFixture<AdvanceApproverListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceApproverListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceApproverListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
