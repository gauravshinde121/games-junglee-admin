import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountStatementMainComponent } from './components/account-statement-main/account-statement-main.component';
import { TransferStatementComponent } from './components/transfer-statement/transfer-statement.component';
import { MyPlComponent } from './components/my-pl/my-pl.component';
import { PlayerPlComponent } from './components/player-pl/player-pl.component';
import { TurnoverComponent } from './components/turnover/turnover.component';
import { AllBetsComponent } from './components/all-bets/all-bets.component'
import { MyAccountStatementComponent } from './components/my-account-statement/my-account-statement.component';
import { PlayerAccountStatementComponent } from './components/player-account-statement/player-account-statement.component';
import { PlayerwiseAccountStatementComponent } from './components/playerwise-account-statement/playerwise-account-statement.component';
import { CasinoReportComponent } from './components/casino-report/casino-report.component';
import { CasinoReportDetailsComponent } from './components/casino-report-details/casino-report-details.component';
import { CommissionLenaDenaComponent } from './components/commission-lena-dena/commission-lena-dena.component';
import { AccountListComponent } from './components/account-list/account-list.component';

const routes: Routes = [{
    path: 'account-statement', component: AccountStatementMainComponent,
    children: [
      { path: 'transfer-statement', component: TransferStatementComponent },
      { path: 'account-list', component: AccountListComponent },
      { path: 'my-pl', component: MyPlComponent },
      { path: 'commission', component: CommissionLenaDenaComponent },
      { path: 'all-bets/:matchId', component: AllBetsComponent },
      { path: 'player-pl', component: PlayerPlComponent },
      { path: 'turnover', component: TurnoverComponent },
      { path: 'my-account-statement', component: MyAccountStatementComponent },
      { path: 'player-account-statement', component: PlayerAccountStatementComponent },
      { path: 'playerwise-account-statement', component: PlayerwiseAccountStatementComponent },
      { path: 'casino-report', component: CasinoReportComponent },
      { path: 'casino-report-details/:userId/:gameCode', component: CasinoReportDetailsComponent }
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountStatementRoutingModule { }
