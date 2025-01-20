import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstraintGeneratorComponent } from './constraint-generator.component';

describe('ConstraintGeneratorComponent', () => {
  let component: ConstraintGeneratorComponent;
  let fixture: ComponentFixture<ConstraintGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstraintGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConstraintGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
