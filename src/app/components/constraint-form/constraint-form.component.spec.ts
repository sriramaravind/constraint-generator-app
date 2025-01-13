import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstraintFormComponent } from './constraint-form.component';

describe('ConstraintFormComponent', () => {
  let component: ConstraintFormComponent;
  let fixture: ComponentFixture<ConstraintFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstraintFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConstraintFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
