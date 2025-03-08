import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConstraintGeneratorService {
  private apiURL = 'http://localhost:5000/generate-constraint'; // Single & Multi-constraint API

  constructor(private http: HttpClient) {}

  generateConstraint(constraintMessage: string, jsonData: any): Observable<any> {
    const payload = {
      constraintMessage,
      jsonData,
      multiConstraint: false // Default: Single constraint processing
    };
    return this.http.post<any>(this.apiURL, payload);
  }

  generateConstraints(batch: any, jsonData: any, selectedRuleNumbers: number[]): Observable<any> {
    const payload = {
        constraintMessage: batch.map((rule: { RulesDesc: any; }) => rule.RulesDesc).join("\n"),
        jsonData: jsonData,
        multiConstraint: true,
        selectedRuleNumbers: selectedRuleNumbers // ✅ Ensure this is sent
    };

    console.log("📡 Sending API Request:", payload);

    return this.http.post<any>(this.apiURL, payload);
}


}

export interface TokenUsage {
  totalPromptTokens: number;
  totalCompletionTokens: number;
  totalTokensUsed: number;
  averageInputTokensPerBatch: number;   // Added
  averageOutputTokensPerBatch: number;  // Added
}
