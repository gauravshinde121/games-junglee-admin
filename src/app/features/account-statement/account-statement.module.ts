import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from 'ngx-clipboard';
import { AccountStatementRoutingModule } from './account-statement-routing.module';
import { AccountStatementMainComponent } from './components/account-statement-main/account-statement-main.component';
import { TransferStatementComponent } from './components/transfer-statement/transfer-statement.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MyPlComponent } from './components/my-pl/my-pl.component';
import { PlayerPlComponent } from './components/player-pl/player-pl.component';
import { TurnoverComponent } from './components/turnover/turnover.component';
import { CommissionComponent } from './components/commission/commission.component';
import { AllBetsComponent } from './components/all-bets/all-bets.component';
import { MyAccountStatementComponent } from './components/my-account-statement/my-account-statement.component';
import { PlayerAccountStatementComponent } from './components/player-account-statement/player-account-statement.component';
import { PlayerwiseAccountStatementComponent } from './components/playerwise-account-statement/playerwise-account-statement.component';


@NgModule({
  declarations: [
    AccountStatementMainComponent,
    TransferStatementComponent,
    MyPlComponent,
    PlayerPlComponent,
    TurnoverComponent,
    CommissionComponent,
    AllBetsComponent,
    MyAccountStatementComponent,
    PlayerAccountStatementComponent,
    PlayerwiseAccountStatementComponent
  ],
  imports: [
    CommonModule,
    AccountStatementRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule
  ]
})
export class AccountStatementModule { }
