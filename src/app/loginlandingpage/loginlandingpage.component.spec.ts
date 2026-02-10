import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginlandingpageComponent } from './loginlandingpage.component';

describe('LoginlandingpageComponent', () => {
  let component: LoginlandingpageComponent;
  let fixture: ComponentFixture<LoginlandingpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginlandingpageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginlandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
