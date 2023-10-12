import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { BalanceComponent } from './components/balance/balance.component';
import { BetSettingsComponent } from './components/bet-settings/bet-settings.component';
import { SettingsMainComponent } from './components/settings-main/settings-main.component';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatchSettingsComponent } from './components/match-settings/match-settings.component';
import { MarketSettingsComponent } from './components/market-settings/market-settings.component';
import { AppSettingsComponent } from './components/app-settings/app-settings.component';
import { ClipboardModule } from 'ngx-clipboard';




@NgModule({
  declarations: [
    BalanceComponent,
    BetSettingsComponent,
    SettingsMainComponent,
    MatchSettingsComponent,
    MarketSettingsComponent,
    AppSettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule
  ]
})
export class SettingsModule { }
