import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditTAdAComponent } from './add-edit-t-ad-a.component';

describe('AddEditTAdAComponent', () => {
  let component: AddEditTAdAComponent;
  let fixture: ComponentFixture<AddEditTAdAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditTAdAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditTAdAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
