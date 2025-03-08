import { Component } from '@angular/core';
import { JsonGeneratorService } from '../../../services/json-generator.service';

@Component({
  selector: 'app-json-generator',
  templateUrl: './json-generator.component.html',
  styleUrls: ['./json-generator.component.css'],
})
export class JsonGeneratorComponent {
  file: File | null = null;
  fileName: string | null = null;
  sheetName: string = '';
  pathName: string = '';
  selectedOption: string = '';
  menuOptions = [
    { label: 'ISS', columns: ['I', 'J'] },
    { label: 'Storage', columns: ['K', 'L'] },
  ];

  extractedData: string[] | null = null;
  paginatedData: string[] = [];
  editableData: string = '';
  isEditMode: boolean = false;

  currentPage: number = 0;
  itemsPerPage: number = 10;
  totalPages: number = 0;

  step1Time: number = 0;  // Time taken for Step 1 (Data Extraction)
  totalProcessingTime: number = 0; // Track the total time taken

  isDownloadReady: boolean = false; // Track if all subprocesses are completed
  

  // Progress Tracker
  step1Status: string = 'notStarted';

  // Progress Tracker - Add timeTaken property
  step2Processes: Step2Process[] = [
    { name: 'Category Grouping', status: 'notStarted', startTime: 0, endTime: 0, timeTaken: 0 },
    { name: 'Highlighting Titles', status: 'notStarted', startTime: 0, endTime: 0, timeTaken: 0 },
    { name: 'Remove Other Grouping', status: 'notStarted', startTime: 0, endTime: 0, timeTaken: 0 },
    { name: 'Rules Organizer', status: 'notStarted', startTime: 0, endTime: 0, timeTaken: 0 },
    { name: 'Attribute Collection', status: 'notStarted', startTime: 0, endTime: 0, timeTaken: 0 },
    { name: 'Replace Attributes', status: 'notStarted', startTime: 0, endTime: 0, timeTaken: 0 },
    { name: 'ConfigandLoc Check', status: 'notStarted', startTime: 0, endTime: 0, timeTaken: 0 },
    { name: 'Rules Grouping', status: 'notStarted', startTime: 0, endTime: 0, timeTaken: 0 },
    { name: 'Class Collection', status: 'notStarted', startTime: 0, endTime: 0, timeTaken: 0 },
    { name: 'Excel to JSON', status: 'notStarted', startTime: 0, endTime: 0, timeTaken: 0 },
    { name: 'Sanitize JSON', status: 'notStarted', startTime: 0, endTime: 0, timeTaken: 0 },
  ];

  constructor(private dataService: JsonGeneratorService) { }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.file = file;
      this.fileName = file.name;
    }
  }

  processFile(): void {
    if (this.file && this.sheetName && this.selectedOption) {

      if (!this.file || !this.sheetName || !this.selectedOption) {
        alert('Please complete all required fields: File, Sheet Name, and Product Line.');
        return;
      }

      this.step1Status = 'inProgress';

      const selectedMenu = this.menuOptions.find((option) => option.label === this.selectedOption);
      if (!selectedMenu) {
        alert('Invalid menu type selected!');
        return;
      }

      this.dataService.processExcel(this.file, this.sheetName, selectedMenu.columns).subscribe(
        (response) => {
          //console.log('Response from Flask /process-excel:', response); // Debug log
          //const endTime = performance.now();
         // this.step1Time = ((endTime - startTime) / 1000).toFixed(2); // Calculate time in seconds
          if (response.data) {
            this.extractedData = response.data;
            this.editableData = this.extractedData ? this.extractedData.join('\n') : ''; // Safely handle null
            this.setupPagination(); // Initialize pagination
            this.step1Status = 'completed';
          } else {
            this.step1Status = 'error';
            alert('No data returned from the server.');
          }
        },
        (error) => {
          console.error('Error during /process-excel API call:', error); // Log errors
          this.step1Status = 'error';
          alert('An error occurred during Step 1.');
        }
      );
    } else {
      alert('Please complete all fields!');
    }
  }

  saveData(): void {
    if (!this.extractedData) {
      alert('No data to save!');
      return;
    }

    // Update extractedData with the edited data
    this.extractedData = this.editableData.split('\n');
    //console.log('Edited Data:', this.extractedData); // Debug edited data

    this.isEditMode = false;

    // Reinitialize pagination after saving edited data
    this.setupPagination();

    // After saving the edited data, start Step 2 processing
    this.startStep2();
  }

  startStep2(index: number = 0): void {
    if (index >= this.step2Processes.length) {
      alert(`All Step 2 processes completed successfully in ${this.totalProcessingTime.toFixed(2)} seconds!`);
      this.isDownloadReady = true; // Enable download button
      return;
    }
  
    const process = this.step2Processes[index];
    process.startTime = performance.now(); // Start time

    // Immediately update UI for the current process
    this.updateProcessStatus(process.name, 'inProgress');
  
    // Call Flask API for subprocess
    this.dataService.processSubProcess(this.file!, this.sheetName, this.selectedOption, this.pathName, this.extractedData!, process.name)
      .subscribe(
        (response) => {
          process.endTime = performance.now(); // End time
          process.timeTaken = (process.endTime - process.startTime) / 1000; // Convert ms to seconds
  
          this.totalProcessingTime += process.timeTaken; // Accumulate total time
  
          // Pass the number directly (no need to convert to string)
          this.updateProcessStatus(process.name, 'completed', process.timeTaken);
  
          // Move to the next process
          //this.startStep2(index + 1);
           // Move to the next process after a short delay for UI updates
          setTimeout(() => this.startStep2(index + 1), 500);
        },
        (error) => {
          this.updateProcessStatus(process.name, 'error');
          alert(`Error during ${process.name} processing.`);
        }
      );
  }  
  
  
  // Modify the updateProcessStatus method to track time
  updateProcessStatus(processName: string, status: string, timeTaken: number = 0): void {
    const process = this.step2Processes.find((p) => p.name === processName);
    if (process) {
      process.status = status;
      if (status === 'completed') {
        process.timeTaken = timeTaken; // Store time as a number
      }
    }
  }  
  
  setupPagination(): void {
    if (this.extractedData) {
      this.totalPages = Math.ceil(this.extractedData.length / this.itemsPerPage);
      this.paginateData(); // Slice the data into pages
    }
  }

  paginateData(): void {
    if (this.extractedData) {
      const startIndex = this.currentPage * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedData = this.extractedData.slice(startIndex, endIndex); // Slice the data correctly
      //console.log('Paginated Data:', this.paginatedData);
    }
  }


  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.paginateData();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.paginateData();
    }
  }

  enableEditMode(): void {
    this.isEditMode = true;
    this.editableData = this.extractedData?.join('\n') || ''; // Prepare data for editing
    //console.log('Entering Edit Mode. Data to Edit:', this.editableData); // Debug editable data
  }


  cancelEdit(): void {
    this.editableData = this.extractedData?.join('\n') || ''; // Revert to original data
    this.isEditMode = false;
  }

  getFormattedTotalTime(): string {
    const minutes = Math.floor(this.totalProcessingTime / 60);
    const seconds = (this.totalProcessingTime % 60).toFixed(2);
    return `${minutes} min ${seconds} sec`;
  }


downloadJson(): void {
  this.dataService.downloadJsonFile().subscribe(
    (blob) => {
      console.log(' JSON Blob:', blob);

      if (!blob || blob.size === 0) {
        console.error(' Error: Empty JSON file received.');
        alert('Failed to download: JSON file is empty or missing.');
        return;
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sanitized_Final.json'; // Ensure correct filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    
      // Reload the page after closing the modal
    setTimeout(() => {
      window.location.reload();
    }, 500); // Adding a slight delay for smooth transition
    
    },
    (error) => {
      console.error(' Error downloading JSON:', error);
      alert('Failed to download JSON. Check console for details.');
    }
    
  );
}
  
}

interface Step2Process {
  name: string;
  status: string;
  startTime: number;
  endTime: number;
  timeTaken: number;
}

