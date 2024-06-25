import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelAuthorizationAdvanceInfoDetailsComponent } from './travel-authorization-advance-info-details.component';

describe('TravelAuthorizationAdvanceInfoDetailsComponent', () => {
  let component: TravelAuthorizationAdvanceInfoDetailsComponent;
  let fixture: ComponentFixture<TravelAuthorizationAdvanceInfoDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelAuthorizationAdvanceInfoDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelAuthorizationAdvanceInfoDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
