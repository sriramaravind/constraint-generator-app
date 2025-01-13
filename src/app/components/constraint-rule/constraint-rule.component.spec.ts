import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstraintRuleComponent } from './constraint-rule.component';

describe('ConstraintRuleComponent', () => {
  let component: ConstraintRuleComponent;
  let fixture: ComponentFixture<ConstraintRuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConstraintRuleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConstraintRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
