import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DefaultProductService {

  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getAutoComplete() {
    return this.http.get<any>(`${this.apiUrl}/get-suggestions`);
  }

  submitConfig(data: any) {
    return this.http.post<any>(`${this.apiUrl}/submit-config`, data);
  }
}
