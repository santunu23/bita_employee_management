import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducatioQualificationComponent } from './educatio-qualification.component';

describe('EducatioQualificationComponent', () => {
  let component: EducatioQualificationComponent;
  let fixture: ComponentFixture<EducatioQualificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducatioQualificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducatioQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
