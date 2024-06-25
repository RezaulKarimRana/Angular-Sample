import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalControlDetailsComponent } from './internal-control-details.component';

describe('InternalControlDetailsComponent', () => {
  let component: InternalControlDetailsComponent;
  let fixture: ComponentFixture<InternalControlDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalControlDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalControlDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
