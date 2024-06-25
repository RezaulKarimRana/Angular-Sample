import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelAuthDashboardComponent } from './travel-auth-dashboard.component';

describe('TravelAuthDashboardComponent', () => {
  let component: TravelAuthDashboardComponent;
  let fixture: ComponentFixture<TravelAuthDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelAuthDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelAuthDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
