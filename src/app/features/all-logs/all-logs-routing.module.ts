import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllLogsMainComponent } from './components/all-logs-main/all-logs-main.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ClTransferComponent } from './components/cl-transfer/cl-transfer.component';
import { BetfairRateLogComponent } from './components/betfair-rate-log/betfair-rate-log.component';
import { InvalidBetComponent } from './components/invalid-bet/invalid-bet.component';

const routes: Routes = [
  {path:'all-logs',component:AllLogsMainComponent,
children:[
  {path:'analytics',component:AnalyticsComponent},
  {path:'reports',component:ReportsComponent},
  {path:'cl-transfer',component:ClTransferComponent},
  {path:'betfair-rate-log',component:BetfairRateLogComponent},
  {path:'invalid-bet',component:InvalidBetComponent},
]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllLogsRoutingModule { }
