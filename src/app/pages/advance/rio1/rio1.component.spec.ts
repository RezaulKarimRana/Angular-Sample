import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RIO1Component } from './rio1.component';

describe('RIO1Component', () => {
  let component: RIO1Component;
  let fixture: ComponentFixture<RIO1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RIO1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RIO1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
