import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JsonParserService {

  parseJson(jsonString: string) {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error('Invalid JSON format:', e);
      return null;
    }
  }
}
