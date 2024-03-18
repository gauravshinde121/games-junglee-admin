import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookManagementMainComponent } from './components/book-management-main/book-management-main.component';
import { NetExposureComponent } from './components/net-exposure/net-exposure.component';
import { BetTickerFlagFinalComponent } from './components/bet-ticker-flag-final/bet-ticker-flag-final.component';
import { NetExposureRacingComponent } from './components/net-exposure-racing/net-exposure-racing.component';
import { BetTickerComponent } from './components/bet-ticker/bet-ticker.component';
import { PremiumSportsbookComponent } from './components/premium-sportsbook/premium-sportsbook.component';
import { BetTickerPreviousComponent } from './components/bet-ticker-previous/bet-ticker-previous.component';
import { NetExposureViewTotalComponent } from './components/net-exposure/net-exposure-view-total/net-exposure-view-total.component';
import { MarketWatchComponent } from './components/market-watch/market-watch.component';
import { MarketListComponent } from './components/market-list/market-list.component';

const routes: Routes = [{
  path:'book-management',
  component:BookManagementMainComponent,
  children:[
    {path:'net-exposure', component:NetExposureComponent},
    {path:'advance-workstation-market/:marketIds',component:NetExposureViewTotalComponent},
    {path:'advance-workstation-match/:matchId',component:NetExposureViewTotalComponent},
    {path:'net-exposure-racing', component:NetExposureRacingComponent},
    {path:'bet-ticker', component:BetTickerComponent},
    {path:'market-watch', component:MarketWatchComponent},
    {path:'market-list/:sports/:tourId/:matchId',component:MarketListComponent},
    {path:'bet-ticker-flag-final', component:BetTickerFlagFinalComponent},
    {path:'bet-ticker-previous', component:BetTickerPreviousComponent},
    {path:'premium-sportsbook', component:PremiumSportsbookComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookManagementRoutingModule { }
