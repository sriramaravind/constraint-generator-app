import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConstraintGeneratorService {
  // Point this to your Flask server:
  private apiURL = 'http://localhost:5000/generate-constraint';

  constructor(private http: HttpClient) {}

  generateConstraint(constraintMessage: string, jsonData: any): Observable<any> {
    const payload = {
      constraintMessage,
      jsonData
    };
    return this.http.post<any>(this.apiURL, payload);
  }
}
