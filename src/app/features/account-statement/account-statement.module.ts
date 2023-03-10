import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountStatementRoutingModule } from './account-statement-routing.module';
import { AccountStatementMainComponent } from './components/account-statement-main/account-statement-main.component';
import { TransferStatementComponent } from './components/transfer-statement/transfer-statement.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MyPlComponent } from './components/my-pl/my-pl.component';
import { PlayerPlComponent } from './components/player-pl/player-pl.component';
import { TurnoverComponent } from './components/turnover/turnover.component';
import { CommissionComponent } from './components/commission/commission.component';


@NgModule({
  declarations: [
    AccountStatementMainComponent,
    TransferStatementComponent,
    MyPlComponent,
    PlayerPlComponent,
    TurnoverComponent,
    CommissionComponent
  ],
  imports: [
    CommonModule,
    AccountStatementRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AccountStatementModule { }
