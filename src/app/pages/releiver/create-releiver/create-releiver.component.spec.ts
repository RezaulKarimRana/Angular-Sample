import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReleiverComponent } from './create-releiver.component';

describe('CreateReleiverComponent', () => {
  let component: CreateReleiverComponent;
  let fixture: ComponentFixture<CreateReleiverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateReleiverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateReleiverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
