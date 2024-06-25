import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdvanceSupervisorEntryComponent } from './supervisor-entry.component';

describe('AdvanceSupervisorEntryComponent', () => {
  let component: AdvanceSupervisorEntryComponent;
  let fixture: ComponentFixture<AdvanceSupervisorEntryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceSupervisorEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceSupervisorEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
