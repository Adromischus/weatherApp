import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HometownComponent } from './hometown.component';

describe('HometownComponent', () => {
  let component: HometownComponent;
  let fixture: ComponentFixture<HometownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HometownComponent]
    });
    fixture = TestBed.createComponent(HometownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
