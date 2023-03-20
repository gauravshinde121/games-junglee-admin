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

const routes: Routes = [{
  path:'book-management',
  component:BookManagementMainComponent,
  children:[
    {path:'net-exposure', component:NetExposureComponent},
    {path:'advance-workstation/:type/:id',component:NetExposureViewTotalComponent},
    {path:'net-exposure-racing', component:NetExposureRacingComponent},
    {path:'bet-ticker', component:BetTickerComponent},
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
