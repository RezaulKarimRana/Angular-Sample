import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAdAListComponent } from './t-ad-a-list.component';

describe('TAdAListComponent', () => {
  let component: TAdAListComponent;
  let fixture: ComponentFixture<TAdAListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TAdAListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TAdAListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
