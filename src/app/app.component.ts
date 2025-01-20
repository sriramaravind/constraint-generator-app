import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `<app-constraint-generator></app-constraint-generator>`,
  styleUrl: './app.component.css'
})
export class AppComponent {
  generatedConstraint: string = '';
}
