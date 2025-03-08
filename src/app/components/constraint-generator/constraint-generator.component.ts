import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { ConstraintGeneratorService } from '../../services/constraint-generator.service';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ActivatedRoute } from '@angular/router';
import { RatingModalComponent } from '../rating-modal/rating-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-constraint-generator',
  templateUrl: './constraint-generator.component.html',
  styleUrls: ['./constraint-generator.component.css']
})
export class ConstraintGeneratorComponent implements OnInit {
  @ViewChild('jsonFileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  selectedFileName = '';
  constraintMessage = '';
  uploadedJson: any;
  generatedConstraint = '';
  loading = false;

  constructor(
    private constraintGeneratorService: ConstraintGeneratorService,
    private route: ActivatedRoute, // Inject ActivatedRoute here
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameters
    this.route.params.subscribe((params: any) => {
      console.log('Route parameters:', params);
    });
  }

  onConstraintGenerated(constraint: string) {
    this.generatedConstraint = constraint;

    // After updating the text, trigger auto-resize
    setTimeout(() => {
      this.autosize.resizeToFitContent(true);
    }, 0);
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
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

          // Open rating modal after download
     this.dialog.open(RatingModalComponent, {
        width: '400px'
    });

    alert('Constraint code copied to clipboard!');
  }
}
