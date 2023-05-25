import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SettingsService } from '../services/settings.service';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-market-settings',
  templateUrl: './market-settings.component.html',
  styleUrls: ['./market-settings.component.scss']
})
export class MarketSettingsComponent implements OnInit {

  filterForm: FormGroup;
  matchSettingsForm: FormGroup;
  display: any = 'none';
  marketSettingsList: any = [];
  isLoading = false;
  language = "en";
  sports: any;
  toggleValue: boolean = false;
  selectedMatchSettings: any;
  tournamentList:any;
  matchList: any;
  sportId:any;

  constructor(
    private settingsService: SettingsService,
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this._preConfig()
  }

  _preConfig() {
    this._initForm();
    this._getAllSports();
    this.getMarketSettingsList();
  }

  _initForm() {
    this.filterForm = new FormGroup({
      status: new FormControl(null),
      sportName: new FormControl(null),
      matchName: new FormControl(),
      tournamentId : new FormControl()
    })

    this.matchSettingsForm = new FormGroup({
      matchOddsMaxBet: new FormControl(null),
      matchOddsMinBet: new FormControl(null),
      bookmakerMaxBet: new FormControl(null),
      bookmakerMinBet: new FormControl(null),
      fancyMaxBet: new FormControl(null),
      fancyMinBet: new FormControl(null),
      matchOddDelay: new FormControl(null),
      bookmakerDelay: new FormControl(null),
      fancyDelay: new FormControl(null),
    })
  }

  getMarketSettingsList() {
    if(this.filterForm.value.sportId == null || this.filterForm.value.sportId== "null"){
      this.filterForm.value.tournamentId = null;
    }
    this.isLoading = true;
    this.marketSettingsList = [];
    if (this.filterForm.value.memberName == null) {
      this.filterForm.patchValue({ 'memberName': null });
    }
    var status: any;
    if (this.filterForm.value.status) {
      if (this.filterForm.value.status == 1) {
        status = true;
      } else {
        status = false;
      }
    } else {
      status = this.filterForm.value.status;
    }

    if(this.filterForm.value.sportsId == 'null'){
      this.filterForm.value.sportsId = null;
    }
    if(this.filterForm.value.tournamentId == 'null'){
      this.filterForm.value.tournamentId = null;
    }
    let body = {
      marketIsActive: status,
      sportId: this.filterForm.value.sportName?+this.filterForm.value.sportName:null,
      matchId: this.filterForm.value.matchName,
      tournamentId: this.filterForm.value.tournamentId?+this.filterForm.value.tournamentId:null
    }

    this.settingsService._getMarketForAdminMarketSettingsListApi(body).subscribe((data: any) => {
      this.isLoading = false;
      this.marketSettingsList = data.markets;
    })
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

  onToggleChange(event: Event, marketId) {
    const checkbox = event.target as HTMLInputElement;
    checkbox.classList.toggle('active', checkbox.checked);
    let body = {
      marketId: marketId,
      marketIsActive: checkbox.checked
    }
    this.settingsService._setMarketStatusForMarketSettingsApi(body).subscribe((data: any) => {
      this._sharedService.getToastPopup("Settings updated.", 'Market Settings', 'success');
    })
  }

  // changeGame(evt) {
  //   // this.sportsId = evt.target.value;
  //   console.log("changegame",evt.target.value);
  //   this.filterForm.value.sportsId = evt.target.value;
  //   if(evt.target.value == null) {
  //     this.filterForm.value.tournamentId = null;
  //   }
  // }

}
