import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-constraint-rule',
  templateUrl: './constraint-rule.component.html',
  styleUrl: './constraint-rule.component.css'
})
export class ConstraintRuleComponent {
  @Input() constraint: string = '';
}
