import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveillanceMainComponent } from './components/surveillance-main/surveillance-main.component';

const routes: Routes = [
  {path:'surveillance',component:SurveillanceMainComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveillanceRoutingModule { }
