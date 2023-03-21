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
  isLoading:boolean = false;
  currentPage: number = 1;
  totalPages: number = 0;
  pageSize:number = 10;

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
      sportsId:new FormControl(null),
    })
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat,this.language);
  }

  getTurnOver(){
    this.isLoading = true;

    let fromDate = new Date(this.filterForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.filterForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    let body = {
      fromDate: fromDate,
      toDate: fromDate,
      sportsId:this.filterForm.value.sportsId,
      pageNo: this.currentPage,
      limit: 50,
    }
    this._accountStatementService._getCategoryForTO(body).subscribe((res:any)=>{
      this.plStatement = res;
      this.isLoading = false;
      this.totalPages = Math.ceil(this.plStatement.length / this.pageSize);
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

  next(): void {
    this.currentPage++;
    this.getTurnOver();
  }

  prev(): void {
    this.currentPage--;
    this.getTurnOver();
  }


}
