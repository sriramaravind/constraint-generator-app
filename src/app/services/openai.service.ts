import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private apiUrl = 'https://api.openai.com/v1/completions'; // Change to appropriate OpenAI API URL

  constructor(private http: HttpClient) {}

  generateConstraint(prompt: string): Observable<any> {
    const headers = { 'Authorization': `Bearer YOUR_OPENAI_API_KEY` };
    const body = {
      model: 'gpt-3.5-turbo', // Use GPT-4 if available
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 300
    };

    return this.http.post<any>(this.apiUrl, body, { headers });
  }
}
