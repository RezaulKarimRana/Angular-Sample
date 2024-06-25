import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RIO4Component } from './rio4.component';

describe('RIO4Component', () => {
  let component: RIO4Component;
  let fixture: ComponentFixture<RIO4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RIO4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RIO4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
