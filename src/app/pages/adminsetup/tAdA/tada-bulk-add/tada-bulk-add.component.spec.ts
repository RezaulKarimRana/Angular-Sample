import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TadaBulkAddComponent } from './tada-bulk-add.component';

describe('TadaBulkAddComponent', () => {
  let component: TadaBulkAddComponent;
  let fixture: ComponentFixture<TadaBulkAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TadaBulkAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TadaBulkAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
