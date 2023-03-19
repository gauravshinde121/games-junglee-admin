import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccountStatementService } from '../../services/account-statement.service';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-turnover',
  templateUrl: './turnover.component.html',
  styleUrls: ['./turnover.component.scss']
})
export class TurnoverComponent implements OnInit {

  filterForm:FormGroup;
  plStatement:any = [];
  dateFormat = "yyyy-MM-dd";
  language = "en";
  games:any = [];

  constructor(
    private _accountStatementService:AccountStatementService,
    private _sharedService:SharedService
  ) { }

  ngOnInit(): void {
    this._preConfig();
  }

  _preConfig(){
    this._initForm();
    this.getTurnOver();
    this._getGames();
  }


  _initForm(){
    this.filterForm = new FormGroup({
      fromDate:new FormControl(this.formatFormDate(new Date())),
      toDate:new FormControl(this.formatFormDate(new Date())),
      page:new FormControl(1),
      sportsId:new FormControl("0"),
    })
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat,this.language);
  }

  getTurnOver(){
    this._accountStatementService._getCategoryForTO(this.filterForm.value).subscribe((res:any)=>{
      console.log(res)
      this.plStatement = res;
      console.log(this.plStatement)
    })
  }


  _getGames(){
    this._sharedService._getSports().subscribe((data:any)=>{
      if(data){
        this.games = data;
      }
    });
  }

  getTOForMatch(matchId){
    this._accountStatementService._getTOForMatch({matchId:matchId}).subscribe((res:any)=>{
      console.log(res)
    })
  }

}
