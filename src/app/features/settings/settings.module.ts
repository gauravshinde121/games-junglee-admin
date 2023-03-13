import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { BalanceComponent } from './components/balance/balance.component';
import { BetSettingsComponent } from './components/bet-settings/bet-settings.component';
import { SettingsMainComponent } from './components/settings-main/settings-main.component';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    BalanceComponent,
    BetSettingsComponent,
    SettingsMainComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SettingsModule { }
