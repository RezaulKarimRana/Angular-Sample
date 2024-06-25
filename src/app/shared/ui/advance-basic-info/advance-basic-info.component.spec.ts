import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceBasicInfoComponent } from './advance-basic-info.component';

describe('AdvanceBasicInfoComponent', () => {
  let component: AdvanceBasicInfoComponent;
  let fixture: ComponentFixture<AdvanceBasicInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceBasicInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
