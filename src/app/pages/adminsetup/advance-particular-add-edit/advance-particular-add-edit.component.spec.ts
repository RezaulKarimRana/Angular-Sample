import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceParticularAddEditComponent } from './advance-particular-add-edit.component';

describe('AdvanceParticularAddEditComponent', () => {
  let component: AdvanceParticularAddEditComponent;
  let fixture: ComponentFixture<AdvanceParticularAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceParticularAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceParticularAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
