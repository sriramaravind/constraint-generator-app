import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConstraintGeneratorComponent } from './components/constraint-generator/constraint-generator.component';
import { MultiConstraintGeneratorComponent } from './components/multi-constraint-generator/multi-constraint-generator.component';
import { JsonGeneratorComponent } from './components/json-gen/json-generator/json-generator.component';
import { DefaultProductComponent } from './components/default-product/default-product.component';
import { UcidSearchComponent } from './components/ucid-search/ucid-search.component';

const routes: Routes = [
  { path: 'oca/constraint-generator', component: ConstraintGeneratorComponent, data: { title: 'Single Constraint Generator' } },
  { path: 'oca/multi-constraint-generator', component: MultiConstraintGeneratorComponent, data: { title: 'Multi Constraint Generator' } },
  { path: 'oca/JSON-generator', component: JsonGeneratorComponent, data: { title: 'JSON Generator' } },
  { path: 'oca/default-product', component: DefaultProductComponent, data: { title: 'Default Product' } },
  { path: 'oca/ucid-search', component: UcidSearchComponent, data: { title: 'AI Search' } },
  { path: '', redirectTo: '', pathMatch: 'full'},
  { path: '**', redirectTo: 'oca/constraint-generator' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
