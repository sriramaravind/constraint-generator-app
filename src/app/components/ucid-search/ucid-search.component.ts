// Angular UI for UCID Filtering with Azure GPT-4

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ucid-search',
  templateUrl: './ucid-search.component.html',
  styleUrls: ['./ucid-search.component.css']
})
export class UcidSearchComponent implements OnInit {
  ucidList: string[] = [
    '6107362664-01',
    '6107362862-01',
    '6107362662-01'
  ];
  searchQuery: string = '';
  filteredUcids: string[] = [];
  explanation: string = '';
  loading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  searchUCID(): void {
    if (!this.searchQuery) return;
    this.loading = true;
    this.explanation = '';
    this.filteredUcids = [];
  
    this.http.post<any>('http://localhost:5000/search', { query: this.searchQuery }).subscribe(
      (response) => {
        console.log("API Response:", response); // Debug API response
  
        this.filteredUcids = response.matching_ucids || [];
        let explanationData = response.explanation || {};
  
        // 🔹 Format explanation for better readability with line breaks
        this.explanation = Object.keys(explanationData).map(ucid => 
          `<strong>${ucid}</strong><br>` +
          `Cores: ${explanationData[ucid]?.total_cores || 'N/A'}<br>` +
          `Memory: ${explanationData[ucid]?.total_memory || 'N/A'} GB<br>` +
          `Storage: ${explanationData[ucid]?.total_storage || 'N/A'} TB<br>` +
          `Reason: ${explanationData[ucid]?.reason || 'No reason provided'}`
        ).join("<br><br>"); // Double line break for spacing
  
        this.loading = false;
      },
      (error) => {
        console.error('Error searching UCID:', error);
        this.loading = false;
      }
    );
  }
  
  
  
  
  
  
}
