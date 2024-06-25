import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceparticularComponent } from './advanceparticular.component';

describe('AdvanceparticularComponent', () => {
  let component: AdvanceparticularComponent;
  let fixture: ComponentFixture<AdvanceparticularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceparticularComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceparticularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
