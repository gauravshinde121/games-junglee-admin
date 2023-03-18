import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccountStatementService } from '../../services/account-statement.service';
import { SharedService } from '@shared/services/shared.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-player-pl',
  templateUrl: './player-pl.component.html',
  styleUrls: ['./player-pl.component.scss']
})
export class PlayerPlComponent implements OnInit {

  filterForm:FormGroup;
  plStatement:any = [];
  games:any;
  matchList:any = [];
  marketList:any = [];
  dateFormat = "yyyy-MM-dd";
  language = "en";

  constructor(
    private _accountStatementService:AccountStatementService,
    private _sharedService:SharedService
  ) { }

  ngOnInit(): void {
    this._preConfig();
    this.filterForm.get('sportsId')?.valueChanges.subscribe((selectedValue) => {
      console.log('Selected value: ', selectedValue);
      this._getMatchBySportId(selectedValue);
    });
  }

  _preConfig(){
    this._initForm();
    this._getGames();
    this.getPlStatement();
  }


  _initForm(){
    this.filterForm = new FormGroup({
      fromDate:new FormControl(this.formatFormDate(new Date())),
      toDate:new FormControl(this.formatFormDate(new Date())),
      sportsId:new FormControl("0"),
      matchId:new FormControl("0"),
      page:new FormControl(1),
      keyword:new FormControl("All"),
      tms:new FormControl("All"),
      type:new FormControl("All"),
      typeName:new FormControl("All")
    })
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat,this.language);
  }

  _getGames(){
    this._sharedService._getSports().subscribe((data:any)=>{
      if(data){
        this.games = data;
      }
    });
  }

  getPlStatement(){
    this._accountStatementService._getDownlineAccountsDataApi(this.filterForm.value).subscribe((res:any)=>{
      console.log(res)
      this.plStatement = res.admin
    })
  }

  getOneAccount(pl){
    console.log(pl)
  }

  _getMatchBySportId(sportId){
    this._sharedService.getMatchBySportId(sportId).subscribe((data:any)=>{
      if(data.matchList){
        this.matchList = data.matchList;
        //console.log('data.matchList',data.matchList);
      }
    });
  }

  _getMarketsByMatchId(matchId){
    this._sharedService.getMarketsByMatchId(matchId).subscribe((data:any)=>{
      console.log('match data',data);
      if(data.marketList){
        this.marketList = data.marketList;
        //console.log('data.matchList',data.matchList);
      }
    });
  }

}
