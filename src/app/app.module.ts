// app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Angular Material Imports
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Optional
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TextFieldModule } from '@angular/cdk/text-field';

import { AppComponent } from './app.component';
import { ConstraintGeneratorComponent } from './components/constraint-generator/constraint-generator.component';
import { JsonGeneratorComponent } from './components/json-gen/json-generator/json-generator.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppRoutingModule } from './app-routing.module'

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';

import { RouterModule } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';

// Angular Material modules
import { MatSelectModule } from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MultiConstraintGeneratorComponent } from './components/multi-constraint-generator/multi-constraint-generator.component';
import { RatingModalComponent } from './components/rating-modal/rating-modal.component';
import { DefaultProductComponent } from './components/default-product/default-product.component';
import { UcidSearchComponent } from './components/ucid-search/ucid-search.component';


// If you have a service, import it here as well.

@NgModule({
  declarations: [
    AppComponent,
    ConstraintGeneratorComponent,
    JsonGeneratorComponent,
    MultiConstraintGeneratorComponent,
    RatingModalComponent,
    DefaultProductComponent,
    UcidSearchComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,  // Required for Angular Material
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ScrollingModule,
    TextFieldModule,
    MatProgressSpinnerModule,
    AppRoutingModule,  // Keep this
    MatToolbarModule,
    MatMenuModule,
    MatRadioModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatSelectModule,
    MatProgressBarModule,
    MatDialogModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatTableModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [RouterModule],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
