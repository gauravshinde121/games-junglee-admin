import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountStatementMainComponent } from './components/account-statement-main/account-statement-main.component';
import { TransferStatementComponent } from './components/transfer-statement/transfer-statement.component';
import { MyPlComponent } from './components/my-pl/my-pl.component';
import { PlayerPlComponent } from './components/player-pl/player-pl.component';
import { TurnoverComponent } from './components/turnover/turnover.component';
import { CommissionComponent } from './components/commission/commission.component';
import { AllBetsComponent } from './components/all-bets/all-bets.component';

const routes: Routes = [
  {path:'account-statement',component:AccountStatementMainComponent,
children:[
  {path:'transfer-statement',component:TransferStatementComponent},
  {path:'my-pl',component:MyPlComponent,
    children:[{path:'/account-statement/my-pl/all-bets/:matchId',component:AllBetsComponent}]
  },
  {path:'player-pl',component:PlayerPlComponent},
  {path:'turnover',component:TurnoverComponent},
  {path:'commission',component:CommissionComponent},

]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountStatementRoutingModule { }
