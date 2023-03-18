import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedService } from '../../../../shared/services/shared.service';

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

  constructor(private _sharedService:SharedService) { }

  ngOnInit(): void {
    this._preConfig();

    this.betSettingForm.get('sportsId')?.valueChanges.subscribe((selectedValue) => {
      console.log('Selected value: ', selectedValue);
      this._getMatchBySportId(selectedValue);
    });
  }


  _preConfig(){
    this._initForm();
    this._getGames();

  }

  _initForm(){
    this.betSettingForm = new FormGroup({
      sportsId:new FormControl(0),
      matchId:new FormControl(0),
      fromDate:new FormControl(this.formatDate(new Date())),
      toDate:new FormControl(this.formatDate(new Date()))
    })
  }


  _getGames(){
    this._sharedService._getSports().subscribe((data:any)=>{
      console.log('events',data.gamesList)
      if(data.gamesList){
        this.games = data.gamesList;
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

}
