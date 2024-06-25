import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RIO2Component } from './rio2.component';

describe('RIO2Component', () => {
  let component: RIO2Component;
  let fixture: ComponentFixture<RIO2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RIO2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RIO2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
