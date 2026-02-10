import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryBenefitComponent } from './salary-benefit.component';

describe('SalaryBenefitComponent', () => {
  let component: SalaryBenefitComponent;
  let fixture: ComponentFixture<SalaryBenefitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryBenefitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryBenefitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
