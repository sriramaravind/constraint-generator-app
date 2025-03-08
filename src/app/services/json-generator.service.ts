import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JsonGeneratorService {
  private step1ApiUrl = 'http://127.0.0.1:5000/process-excel'; // Step 1 Flask API URL
  private step2ApiUrl = 'http://127.0.0.1:5000/step2-process'; // Step 2 Flask API URL

  constructor(private http: HttpClient) {}

  // Step 1: Process Excel File
  processExcel(file: File, sheetName: string, columns: string[],): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sheet_name', sheetName);
    formData.append('columns', JSON.stringify(columns)); // Pass columns as JSON string

    return this.http.post<any>(this.step1ApiUrl, formData);
  }

  // Step 2: Process all subprocesses with file, sheet name, and menu type
  processStep2(file: File, sheetName: string, menuType: string, editedData: string[]): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sheet_name', sheetName);
    formData.append('menu_type', menuType);
    formData.append('edited_data', JSON.stringify(editedData));
  
    console.log('FormData Sent:', formData);
    return this.http.post<any>(this.step2ApiUrl, formData);
  }
  

// Step 2 Subprocess: Call individual subprocess dynamically with arguments
processSubProcess(file: File, sheetName: string, menuType: string, pathName: string, editedData: string[], subProcess: string): Observable<any> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('sheet_name', sheetName);
  formData.append('menu_type', menuType);
  formData.append('path_name', pathName);
  formData.append('edited_data', JSON.stringify(editedData));
  formData.append('sub_process', subProcess); // Pass sub-process name

  console.log('FormData Sent:', formData); // Debugging
  return this.http.post<any>(this.step2ApiUrl, formData);
}


downloadJsonFile(): Observable<Blob> {
  const url = 'http://127.0.0.1:5000/download-json'; // Flask API

  return this.http.get(url, { responseType: 'blob' }).pipe(
    tap(response => console.log('JSON file received:', response)),
    catchError(error => {
      console.error(' Error downloading JSON:', error);
      alert('Download failed: Server error or file missing.');
      return throwError(() => new Error('Download failed.'));
    })
  );
}



}