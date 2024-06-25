import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelAuthDetailsComponent } from './travel-auth-details.component';

describe('TravelAuthDetailsComponent', () => {
  let component: TravelAuthDetailsComponent;
  let fixture: ComponentFixture<TravelAuthDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelAuthDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelAuthDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
