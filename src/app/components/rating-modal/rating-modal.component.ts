import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-rating-modal',
  templateUrl: './rating-modal.component.html',
  styleUrls: ['./rating-modal.component.css']
})
export class RatingModalComponent {
  userRating: number = 0;
  menuName = '';
  revisionNumber = 0;
  ruleNumber = 0;
  userComment = '';

  constructor(
    public dialogRef: MatDialogRef<RatingModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  setRating(star: number) {
    this.userRating = star;
    if (star === 5) {
      // If user selects 5 stars, clear the other fields
      this.menuName = '';
      this.revisionNumber = 0;
      this.ruleNumber = 0;
      this.userComment = '';
    }
  }

  submitFeedback() {
    console.log('Feedback Submitted:', {
      rating: this.userRating,
      menuName: this.menuName,
      revisionNumber: this.revisionNumber,
      ruleNumber: this.ruleNumber,
      comments: this.userComment
    });
  
    this.dialogRef.close(); // Close the modal
  
    // Reload the page after closing the modal
    setTimeout(() => {
      window.location.reload();
    }, 500); // Adding a slight delay for smooth transition
  }
  
}
