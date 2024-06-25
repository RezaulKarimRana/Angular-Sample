import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateChangeHistoryComponent } from './date-change-history.component';

describe('DateChangeHistoryComponent', () => {
  let component: DateChangeHistoryComponent;
  let fixture: ComponentFixture<DateChangeHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DateChangeHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DateChangeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
