import { Component, OnInit } from '@angular/core';
import { DefaultProductService } from '../../services/default-product.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-default-product',
  templateUrl: './default-product.component.html',
  styleUrls: ['./default-product.component.css']
})
export class DefaultProductComponent implements OnInit {
  generation = new FormControl('');
  serverFamily = new FormControl('');
  modelNumber = new FormControl('');
  userDownloadPath = new FormControl('');
  finalDownloadPath = '';
  showConsolidatedTable = false;

  components: any[] = [];

  // AutoComplete Options
  generationOptions: string[] = [];
  serverFamilyOptions: string[] = [];
  modelNumberOptions: string[] = [];
  componentTypeOptions: string[] = [];
  supportedCountriesOptions: string[] = [];

  filteredGenerationOptions!: Observable<string[]>;
  filteredServerFamilyOptions!: Observable<string[]>;
  filteredModelNumberOptions!: Observable<string[]>;
  filteredComponentTypes: Observable<string[]>[] = [];
  filteredCountries: Observable<string[]>[] = [];

  componentTypes: string[] = [];  // ✅ Store extracted component types

  constructor(private appService: DefaultProductService) {}

  ngOnInit() {
    this.loadAutoComplete();

    this.generation.valueChanges.subscribe(() => this.updateDownloadPath());
    this.serverFamily.valueChanges.subscribe(() => this.updateDownloadPath());
    this.userDownloadPath.valueChanges.subscribe(() => this.updateDownloadPath());

    this.filteredGenerationOptions = this.generation.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value as string, this.generationOptions))
    );

    this.filteredServerFamilyOptions = this.serverFamily.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value as string, this.serverFamilyOptions))
    );

    this.filteredModelNumberOptions = this.modelNumber.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value as string, this.modelNumberOptions))
    );
  }

  // ✅ Load autoComplete data from API
  loadAutoComplete() {
    this.appService.getAutoComplete().subscribe(data => {
      this.generationOptions = data.generations || [];
      this.serverFamilyOptions = data.serverFamilies || [];
      this.modelNumberOptions = data.modelNumbers || [];
      this.componentTypeOptions = data.componentTypes || [];
      this.supportedCountriesOptions = data.supportedCountries || [];
    });
  }

  // ✅ Fix autocomplete filtering per row
  initializeFilters() {
    this.filteredComponentTypes = [];
    this.filteredCountries = [];

    this.components.forEach((component, index) => {
      if (!component.typeControl || !component.countryControl) {
        console.error(`Component at index ${index} is missing FormControls!`);
        return; // Prevent accessing undefined properties
      }

      this.filteredComponentTypes[index] = component.typeControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value as string, this.componentTypeOptions))
      );

      this.filteredCountries[index] = component.countryControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value as string, this.supportedCountriesOptions))
      );
    });
  }

  // ✅ Search filter function
  private _filter(value: unknown, options: string[]): string[] {
    const filterValue = (value as string || '').toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }

  addComponent() {
    const newComponent = {
      typeControl: new FormControl(''),  // ✅ Correct FormControl setup
      countryControl: new FormControl(''),
      productNumberControl: new FormControl(''),
      quantityControl: new FormControl(1)
    };

    this.components.push(newComponent);
    this.initializeFilters();
  }

  removeComponent(index: number) {
    this.components.splice(index, 1);
  }

  updateDownloadPath() {
    let basePath = this.userDownloadPath.value?.trim() || ''; 
    let generation = this.generation.value?.trim() || '';
    let serverFamily = this.serverFamily.value?.trim() || '';
  
    if (basePath && generation && serverFamily) {
      // ✅ Fix: Use correct path separator based on OS
      this.finalDownloadPath = `${basePath}\\${generation}\\${serverFamily}.json`;
    } else {
      this.finalDownloadPath = ''; // Reset if any field is missing
    }
  }
  

  consolidatedComponents: any = {}; // ✅ Store component details

  

submitConfig() {
  this.updateDownloadPath();

  const payload = {
    generation: this.generation.value ?? '',
    serverFamily: this.serverFamily.value ?? '',
    modelNumber: this.modelNumber.value ?? '',
    downloadPath: this.finalDownloadPath ?? '',
    components: this.components.map(component => ({
      type: component.typeControl?.value || '',      
      countries: component.countryControl?.value || '', 
      productNumber: component.productNumberControl?.value || '',
      quantity: component.quantityControl?.value || 1
    }))
  };

  console.log('📌 JSON Payload Before Sending:', JSON.stringify(payload, null, 2));

  this.appService.submitConfig(payload).subscribe({
    next: response => {
      console.log('✅ Full Server Response:', response);
  
      const serverData = response[payload.serverFamily] ?? {};
      const modelData = serverData[payload.modelNumber] ?? {};
  
      if (Object.keys(modelData).length > 0) {
        this.consolidatedComponents = {};
  
        // ✅ Fix: Ensure correct data mapping
        Object.keys(modelData).forEach(componentType => {
          const componentData = modelData[componentType];
  
          // ✅ Convert object structure to an array for Angular Material Table
          this.consolidatedComponents[componentType] = [
            {
              "Supported Countries": componentData["Supported Countries"] || "WW",
              "Product Number": componentData["Product Number"] || "",
              "Quantity": componentData["Quantity"] || "1"
            }
          ];
        });
  
        console.log("📌 Extracted Consolidated Data:", this.consolidatedComponents);
      } else {
        console.warn("❌ No component types found for the selected model.");
        this.consolidatedComponents = {};
      }
    },
    error: error => {
      console.error("❌ Failed to submit JSON:", error);
    }
  });
  
}

// ✅ Fix: Get object keys safely
getObjectKeys(obj: any): string[] {
  return obj ? Object.keys(obj) : [];
}

// ✅ Fix: Convert object values to an array for mat-table
getComponentList(obj: any): any[] {
  return obj ? Object.values(obj) : [];
}


  
}
