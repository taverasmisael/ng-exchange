import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestPageComponent } from './latest-page.component';

describe('LatestPageComponent', () => {
  let component: LatestPageComponent;
  let fixture: ComponentFixture<LatestPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
