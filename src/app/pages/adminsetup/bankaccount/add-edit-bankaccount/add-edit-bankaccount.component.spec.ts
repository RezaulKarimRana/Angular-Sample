import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBankAccountComponent } from './add-edit-bankaccount.component';

describe('AddEditBankAccountComponent', () => {
  let component: AddEditBankAccountComponent;
  let fixture: ComponentFixture<AddEditBankAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditBankAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditBankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
