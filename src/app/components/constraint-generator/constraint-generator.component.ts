import { Component } from '@angular/core';
import { ConstraintGeneratorService } from '../../services/constraint-generator.service';

@Component({
  selector: 'app-constraint-generator',
  templateUrl: './constraint-generator.component.html',
  styleUrls: ['./constraint-generator.component.css']
})
export class ConstraintGeneratorComponent {
  constraintMessage = '';
  uploadedJson: any;
  generatedConstraint = '';
  loading = false;

  constructor(private constraintGeneratorService: ConstraintGeneratorService) {}

  // Handle file upload
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          this.uploadedJson = JSON.parse(e.target.result);
        } catch (error) {
          alert('Error parsing JSON file. Please ensure it is valid JSON.');
        }
      };
      reader.readAsText(file);
    }
  }

  generateConstraint(): void {
    if (!this.constraintMessage) {
      alert('Please enter a constraint message.');
      return;
    }
    if (!this.uploadedJson) {
      alert('Please upload a valid JSON file.');
      return;
    }

    this.loading = true;
    this.generatedConstraint = '';

    // Call the back-end API
    this.constraintGeneratorService.generateConstraint(this.constraintMessage, this.uploadedJson)
      .subscribe({
        next: (res) => {
          this.loading = false;
          if (res.generatedConstraint) {
            this.generatedConstraint = res.generatedConstraint;
          } else {
            alert('No constraint returned from server.');
          }
        },
        error: (err) => {
          this.loading = false;
          console.error('Error:', err);
          alert('An error occurred generating the constraint.');
        }
      });
  }

  copyConstraint(): void {
    if (!this.generatedConstraint) {
      alert('No constraint to copy.');
      return;
    }

    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = this.generatedConstraint;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);

    alert('Constraint code copied to clipboard!');
  }
}