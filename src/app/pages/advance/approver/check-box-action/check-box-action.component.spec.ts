import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckBoxActionComponent } from './check-box-action.component';

describe('CheckBoxActionComponent', () => {
  let component: CheckBoxActionComponent;
  let fixture: ComponentFixture<CheckBoxActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckBoxActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckBoxActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
