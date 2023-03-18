import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedService } from '../../../../shared/services/shared.service';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-bet-settings',
  templateUrl: './bet-settings.component.html',
  styleUrls: ['./bet-settings.component.scss']
})
export class BetSettingsComponent implements OnInit {

  betList:any = [];
  isLoading = false;
  games:any = [];
  events:any = [];
  matchList:any = [];
  betSettingForm:FormGroup;
  dateFormat = "yyyy-MM-dd";
  language = "en";
  allBets: any;
  gameId: any = null;
  matchId: any = null;
  marketTypeId: any = null;

  constructor(private _sharedService:SharedService,private _settingService:SettingsService) { }

  ngOnInit(): void {
    this._preConfig();

    this.betSettingForm.get('sportsId')?.valueChanges.subscribe((selectedValue) => {
      console.log('Selected value: ', selectedValue);
      this._getMatchBySportId(selectedValue);
    });

    this.getAllUserBets();
  }


  _preConfig(){
    this._initForm();
    this._getGames();

  }

  _initForm(){
    this.betSettingForm = new FormGroup({
      sportsId:new FormControl(0),
      matchId:new FormControl(0),
      fromDate:new FormControl(this.formatFormDate(new Date())),
      toDate:new FormControl(this.formatFormDate(new Date()))
    })
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat,this.language);
  }


  _getGames(){
    this._sharedService._getSports().subscribe((data:any)=>{
      console.log('events',data)
      if(data){
        this.games = data;
      }
    });
  }

  _getMatchBySportId(sportId){
    this._sharedService.getMatchBySportId(sportId).subscribe((data:any)=>{
      console.log(data)
      if(data.matchList){
        this.matchList = data.matchList;
      }
    });
  }


  onGameSelected(sportId){
    console.log(sportId)
    this._getMatchBySportId(sportId);
  }


  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [day, month, year].join('/');
  }


  onSubmitBetListForm(){
    console.log(this.betSettingForm.value)
  }

  getAllUserBets(){
    let payload = {
      sportId: null,
      matchId: null,
      userId: null,
      fromDate : null,
      toDate : null

    }
    this._settingService._getAllUserBetsApi(payload).subscribe((res:any)=>{
      console.log(res);

      this.allBets = res.data;
    },(err)=>{
      console.log(err);
      this._sharedService.getToastPopup("Internal server error","","error")
    });

  }

  searchList() {
    let payload = {
      sportId: this.gameId,
      matchId: this.matchId,
      fromDate : this.betSettingForm.value.fromDate,
      toDate : this.betSettingForm.value.toDate
    }

    this._settingService._getAllUserBetsApi(payload).subscribe((res:any)=>{
      console.log(res);

      this.allBets = res.data;

    },(err)=>{
      console.log(err);
      this._sharedService.getToastPopup("Internal server error","","error")
    });
  }

}
