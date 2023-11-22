import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoBannerSliderComponent } from './video-banner-slider.component';

describe('VideoBannerSliderComponent', () => {
  let component: VideoBannerSliderComponent;
  let fixture: ComponentFixture<VideoBannerSliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoBannerSliderComponent]
    });
    fixture = TestBed.createComponent(VideoBannerSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
