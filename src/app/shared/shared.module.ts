import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { LeftNavigationComponent } from './components/left-navigation/left-navigation.component';
import { FormsModule } from '@angular/forms';
import { TruncatePipe } from './pipe/truncate.pipe';
import { MarketRateFormaterPipe } from './pipe/market-rate-formater.pipe';
import { TooltipModule } from 'ng2-tooltip-directive';

@NgModule({
  declarations: [
    HeaderComponent,
    LeftNavigationComponent,
    TruncatePipe,
    MarketRateFormaterPipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TooltipModule
  ],
  exports: [
    HeaderComponent,
    LeftNavigationComponent,
    TruncatePipe,
    MarketRateFormaterPipe,
    TooltipModule
  ]
})
export class SharedModule { }
