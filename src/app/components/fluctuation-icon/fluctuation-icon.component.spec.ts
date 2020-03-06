import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluctuationIconComponent } from './fluctuation-icon.component';

describe('FluctuationIconComponent', () => {
  let component: FluctuationIconComponent;
  let fixture: ComponentFixture<FluctuationIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluctuationIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluctuationIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
