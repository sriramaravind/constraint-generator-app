import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConstraintFormComponent } from './components/constraint-form/constraint-form.component';
import { ConstraintRuleComponent } from './components/constraint-rule/constraint-rule.component';

@NgModule({
  declarations: [
    AppComponent,
    ConstraintFormComponent,
    ConstraintRuleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
