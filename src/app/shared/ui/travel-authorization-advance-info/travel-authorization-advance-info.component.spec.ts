import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelAuthorizationAdvanceInfoComponent } from './travel-authorization-advance-info.component';

describe('TravelAuthorizationAdvanceInfoComponent', () => {
  let component: TravelAuthorizationAdvanceInfoComponent;
  let fixture: ComponentFixture<TravelAuthorizationAdvanceInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelAuthorizationAdvanceInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelAuthorizationAdvanceInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
