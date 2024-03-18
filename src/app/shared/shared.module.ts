import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { LeftNavigationComponent } from './components/left-navigation/left-navigation.component';
import { FormsModule } from '@angular/forms';
import { TruncatePipe } from './pipe/truncate.pipe';
import { MarketRateFormaterPipe } from './pipe/market-rate-formater.pipe';
import { TooltipModule } from 'ng2-tooltip-directive';
import { BoxHighlightDirective } from './directives/box-highlight.directive';
import { SortPipe } from './pipe/sort.pipe';
import { SearchPipe } from './pipe/search.pipe';
import { IndianCurrencyPipe } from './pipe/indian-currency.pipe';
import { RoundToHalfPipe } from './pipe/oddFormat.pipe';
import { MatchTimePipe } from './pipe/match-time.pipe';
import { FormattednumberPipe } from './pipe/formattednumber.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    LeftNavigationComponent,
    TruncatePipe,
    MarketRateFormaterPipe,
    BoxHighlightDirective,
    SortPipe,
    FormattednumberPipe,
    SearchPipe,
    IndianCurrencyPipe,
    RoundToHalfPipe,
    MatchTimePipe
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
    TooltipModule,
    BoxHighlightDirective,
    SortPipe,
    FormattednumberPipe,
    SearchPipe,
    IndianCurrencyPipe,
    RoundToHalfPipe,
    MatchTimePipe
  ]
})
export class SharedModule { }
