// multi-constraint-generator.component.ts
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConstraintGeneratorService } from '../../services/constraint-generator.service';
import { RatingModalComponent } from '../rating-modal/rating-modal.component';

@Component({
  selector: 'app-multi-constraint-generator',
  templateUrl: './multi-constraint-generator.component.html',
  styleUrls: ['./multi-constraint-generator.component.css']
})
export class MultiConstraintGeneratorComponent {
  selectedFileName = '';
  rulesDescription: any[] = [];
  startRuleNo: number = 0;
  endRuleNo: number = 0;
  customRuleInput = '';
  batchSize = 2;
  batchSizes = [5, 10, 15, 20];
  loading = false;
  progressValue = 0;
  currentBatch = 0;
  totalBatches = 0;
  ruleSelectionMode: 'range' | 'custom' = 'range'; // Default to range selection
  downloadReady = false;
  downloadUrl = '';
  jsonData: any = {};
  totalPromptTokens: number = 0;
  totalTokensUsed: number = 0;
  totalCompletionTokens : number = 0;
  tokensReady: boolean = false;
  averageInputTokensPerBatch : number = 0;
  averageOutputTokensPerBatch : number = 0;
  selectedRuleNumbers!: number[]; 

  constructor(private constraintService: ConstraintGeneratorService,private dialog: MatDialog) { }

  triggerFileInput() {
    document.getElementById('jsonFileInput')?.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFileName = file.name;
    const reader = new FileReader();

    reader.onload = () => {
      try {
        this.jsonData = JSON.parse(reader.result as string);
        this.rulesDescription = this.jsonData['RulesDescription'].filter((rule: any) => rule.RuleNo);
      } catch (error) {
        console.error('Invalid JSON format', error);
      }
    };
    reader.readAsText(file);
  }


  generateConstraints() {
    if (!this.rulesDescription.length) return;
    this.loading = true;
    this.progressValue = 0;
    this.currentBatch = 0;

    let selectedRules = this.getSelectedRules();
    this.totalBatches = Math.ceil(selectedRules.length / this.batchSize);

    this.processBatches(selectedRules);
  }


  getSelectedRules() {
    let selectedRules: any[] = [];

    if (this.ruleSelectionMode === 'range' && this.startRuleNo !== undefined && this.endRuleNo !== undefined) {
        selectedRules = this.rulesDescription.filter(
            rule => rule.RuleNo >= (this.startRuleNo ?? 1) && rule.RuleNo <= (this.endRuleNo ?? 1)
        );
    }

    if (this.ruleSelectionMode === 'custom' && this.customRuleInput) {
        // Extract entered rule numbers as an array
        this.selectedRuleNumbers = this.customRuleInput
            .split(',')
            .map(num => parseInt(num.trim(), 10))
            .filter(num => !isNaN(num)); // Filter out invalid values

        // Match selected rules from JSON data
        selectedRules = this.rulesDescription.filter(rule => this.selectedRuleNumbers.includes(rule.RuleNo));
    }

    console.log("🔹 Selected Rule Numbers:", this.selectedRuleNumbers);
    return selectedRules;
}


async processBatches(rules: any[]) {
  this.totalPromptTokens = 0;
  this.totalCompletionTokens = 0;
  this.totalTokensUsed = 0;
  this.averageInputTokensPerBatch = 0;
  this.averageOutputTokensPerBatch = 0;

  let batchTokenCounts: { input: number; output: number }[] = [];
  const totalRules = rules.length;

  console.log(" Starting Batch Processing... Total Rules:", totalRules);

  for (let i = 0; i < totalRules; i += this.batchSize) {
      this.currentBatch++;
      this.progressValue = (this.currentBatch / this.totalBatches) * 100;
      const batch = rules.slice(i, i + this.batchSize);

      console.log(` Processing Batch ${this.currentBatch} of ${this.totalBatches}`);
      console.log(" Rules in Batch:", batch.map(r => r.RuleNo));

      try {
          //  Pass selectedRuleNumbers in the request payload
          const response = await this.constraintService.generateConstraints(batch, this.jsonData, this.selectedRuleNumbers).toPromise();

          if (response?.file_path) {
              console.log(" Batch Processed Successfully");

              this.totalPromptTokens += response.tokenUsage.totalPromptTokens;
              this.totalCompletionTokens += response.tokenUsage.totalCompletionTokens;
              this.totalTokensUsed += response.tokenUsage.totalTokensUsed;

              batchTokenCounts.push({
                  input: response.tokenUsage.totalPromptTokens,
                  output: response.tokenUsage.totalCompletionTokens
              });

          } else {
              console.error(" Error: No file_path returned from API for this batch.");
          }
      } catch (error) {
          console.error(" API Error in Batch Processing:", error);
      }
  }

  const numBatches = batchTokenCounts.length;
  this.averageInputTokensPerBatch = numBatches > 0 ? Math.round(
      batchTokenCounts.reduce((sum, batch) => sum + batch.input, 0) / numBatches
  ) : 0;

  this.averageOutputTokensPerBatch = numBatches > 0 ? Math.round(
      batchTokenCounts.reduce((sum, batch) => sum + batch.output, 0) / numBatches
  ) : 0;

  this.loading = false;
  this.tokensReady = true;
  this.downloadReady = true;  
  this.downloadUrl = `http://localhost:5000/download-ngc`;

  console.log(" Processing Complete! Download Ready:", this.downloadReady);
}

  downloadFile() {
    if (this.downloadUrl) {
      window.open(this.downloadUrl, "_blank"); // Opens in a new tab to ensure proper behavior
      
      // Open rating modal after download
      this.dialog.open(RatingModalComponent, {
        width: '400px'
      });
    } else {
      console.error('Download URL is not set correctly');
    }
  }

}
