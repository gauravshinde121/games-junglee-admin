import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembersRoutingModule } from './members-routing.module';
import { MembersMainComponent } from './components/members-main/members-main.component';
import { MembersListComponent } from './components/members-list/members-list.component';
import { SharedModule } from '@shared/shared.module';
import { CreateMemberComponent } from './components/create-member/create-member.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MemberDetailsComponent } from './components/member-details/member-details.component';
import { ActivityComponent } from './components/activity/activity.component';
import { BalanceComponent } from './components/balance/balance.component';
import { BetListComponent } from './components/bet-list/bet-list.component';
import { AccountStatementComponent } from './components/account-statement/account-statement.component';
import { TransferStatementsComponent } from './components/transfer-statements/transfer-statements.component';
import { LoginHistoryComponent } from './components/login-history/login-history.component';
import { CommissionComponent } from './components/commission/commission.component';
import { NetExposureComponent } from './components/net-exposure/net-exposure.component';
import { UserAccessComponent } from './components/user-access/user-access.component';


@NgModule({
  declarations: [
    MembersMainComponent,
    MembersListComponent,
    CreateMemberComponent,
    MemberDetailsComponent,
    ActivityComponent,
    BalanceComponent,
    BetListComponent,
    AccountStatementComponent,
    TransferStatementsComponent,
    LoginHistoryComponent,
    CommissionComponent,
    NetExposureComponent,
    UserAccessComponent,
  ],
  imports: [
    CommonModule,
    MembersRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MembersModule { }
