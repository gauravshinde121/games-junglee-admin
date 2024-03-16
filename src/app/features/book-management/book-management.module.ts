import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClipboardModule } from 'ngx-clipboard';
import { BookManagementRoutingModule } from './book-management-routing.module';
import { BookManagementMainComponent } from './components/book-management-main/book-management-main.component';
import { NetExposureComponent } from './components/net-exposure/net-exposure.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BetTickerFlagFinalComponent } from './components/bet-ticker-flag-final/bet-ticker-flag-final.component';
import { BetTickerPreviousComponent } from './components/bet-ticker-previous/bet-ticker-previous.component';
import { NetExposureRacingComponent } from './components/net-exposure-racing/net-exposure-racing.component';
import { BetTickerComponent } from './components/bet-ticker/bet-ticker.component';
import { PremiumSportsbookComponent } from './components/premium-sportsbook/premium-sportsbook.component';
import { NetExposureViewTotalComponent } from './components/net-exposure/net-exposure-view-total/net-exposure-view-total.component';
import { MarketWatchComponent } from './components/market-watch/market-watch.component';


@NgModule({
  declarations: [
    BookManagementMainComponent,
    NetExposureComponent,
    BetTickerFlagFinalComponent,
    BetTickerPreviousComponent,
    NetExposureRacingComponent,
    BetTickerComponent,
    PremiumSportsbookComponent,
    NetExposureViewTotalComponent,
    MarketWatchComponent
  ],
  imports: [
    CommonModule,
    BookManagementRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule
  ]
})
export class BookManagementModule { }
