import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiConstraintGeneratorComponent } from './multi-constraint-generator.component';

describe('MultiConstraintGeneratorComponent', () => {
  let component: MultiConstraintGeneratorComponent;
  let fixture: ComponentFixture<MultiConstraintGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiConstraintGeneratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultiConstraintGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
