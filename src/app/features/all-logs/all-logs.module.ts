import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllLogsRoutingModule } from './all-logs-routing.module';
import { AllLogsMainComponent } from './components/all-logs-main/all-logs-main.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ClTransferComponent } from './components/cl-transfer/cl-transfer.component';
import { BetfairRateLogComponent } from './components/betfair-rate-log/betfair-rate-log.component';
import { InvalidBetComponent } from './components/invalid-bet/invalid-bet.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AllLogsMainComponent,
    AnalyticsComponent,
    ReportsComponent,
    ClTransferComponent,
    BetfairRateLogComponent,
    InvalidBetComponent
  ],
  imports: [
    CommonModule,
    AllLogsRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class AllLogsModule { }
