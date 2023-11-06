import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-games-settings',
  templateUrl: './games-settings.component.html',
  styleUrls: ['./games-settings.component.scss']
})
export class GamesSettingsComponent implements OnInit {

  filterForm: FormGroup;
  gamesSettingsForm: FormGroup;
  tournamentList:any;
  matchList: any;
  sportId:any;
  sports:any;
  isLoading = false;
  marketList:any;

  constructor(
    private _sharedService : SharedService,
    private settingsService : SettingsService
  ) { }

  ngOnInit(): void {
    this._preConfig()
  }

  _preConfig() {
    this._getAllSports();
    this._initForm();
  }

  _initForm() {
    this.filterForm = new FormGroup({
      status: new FormControl(null),
      sportName: new FormControl(null),
      matchName: new FormControl(),
      tournamentId : new FormControl(),
      marketType : new FormControl(0)
    })

    this.gamesSettingsForm = new FormGroup({
      matchOddsMaxBet: new FormControl(null,Validators.required),
      matchOddsMinBet: new FormControl(null,Validators.required)
    });

  }

  _getAllSports() {
    this._sharedService._getSports().subscribe((data: any) => {
      if (data) {
        this.sports = data;
      }
    });
  }

  _onSportSelect(){
    if(this.sportId == null ||this.sportId == 'null' ) {
      this.filterForm.value.tournamentId = null;
    }
    this.filterForm.patchValue({tournamentId:null, matchName:null});
    var sportId = this.filterForm.value.sportName;
    if(!sportId) return
    this._sharedService.getTournamentBySportIdApi(sportId).subscribe((data:any)=>{
      if(data){
        this.tournamentList = data;
      }
    });

  }

  _onTournamentSelect(){
    var tournamentId = this.filterForm.value.tournamentId;
    if(!tournamentId) return
    this.filterForm.patchValue({ matchName:null});
    this._sharedService.getMatchByTournamentIdApi(tournamentId).subscribe((data:any)=>{
      if(data){
        this.matchList = data;
      }
    });
  }

  getMarketByMatchId(marketTypeId){
    let body = {
      marketIsActive: null,
      sportId: this.filterForm.value.sportName?+this.filterForm.value.sportName:null,
      matchId: this.filterForm.value.matchName,
      tournamentId: this.filterForm.value.tournamentId?+this.filterForm.value.tournamentId:null
    }

    this.settingsService._getMarketForAdminMarketSettingsListApi(body).subscribe((data: any) => {
      this.isLoading = false;
      const filteredMarketData = data.markets.filter((item) => item.marketTypeId === Number(marketTypeId.value));
      /*const parsedMarketData = filteredMarketData.map(item => {
        const parsedRunner = JSON.parse(item.runners);
        return { ...item, runners: parsedRunner };
      });*/
      this.marketList = filteredMarketData;
    })
  }

  toggleRunnerStatus(market, runner) {
    runner.isSuspended = runner.isSuspended === 1 ? 0 : 1;
    if(runner.isSuspended === 0){
      market.isMarketSuspended = false;
    }
    this.toggleStatusMainFunc(market);

  }

  toggleMarketStatus(market) {
    market.isMarketSuspended = !market.isMarketSuspended;
    this.toggleStatusMainFunc(market);
  }

  toggleStatusMainFunc(market){
    let body = {
      marketId: market.marketId,
      isMarketSuspended: market.isMarketSuspended,
      runners: market.runnerStatus
    }
    this.settingsService._suspendMarketApi(body).subscribe();
  }

}
