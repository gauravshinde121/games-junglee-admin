import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveillanceRoutingModule } from './surveillance-routing.module';
import { SurveillanceMainComponent } from './components/surveillance-main/surveillance-main.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    SurveillanceMainComponent
  ],
  imports: [
    CommonModule,
    SurveillanceRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class SurveillanceModule { }
