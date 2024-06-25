import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RIO3Component } from './rio3.component';

describe('RIO3Component', () => {
  let component: RIO3Component;
  let fixture: ComponentFixture<RIO3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RIO3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RIO3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
