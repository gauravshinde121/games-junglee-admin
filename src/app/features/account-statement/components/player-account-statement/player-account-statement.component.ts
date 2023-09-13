import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AccountStatementService } from '../../services/account-statement.service';
import { Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import * as moment from 'moment';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-player-account-statement',
  templateUrl: './player-account-statement.component.html',
  styleUrls: ['./player-account-statement.component.scss']
})
export class PlayerAccountStatementComponent implements OnInit {

  filterForm: FormGroup;
  plStatement: any = [];
  dateFormat = "yyyy-MM-dd";
  language = "en";

  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 0;
  isLoading = false;
  marketList: any;
  sportsId: any = null;
  matchId: any = null;
  marketTypeId: any = null;
  //currentTotalPage:any;

  fileName= 'P/L Statement.xlsx';

  sortColumn: string = '';
  sortAscending: boolean = true;// 1: ascending, -1: descending


  constructor(
    private _accountStatementService: AccountStatementService,
    private _sharedService: SharedService,
    private _router: Router,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this._preconfig();

    this.getPlStatement();

  }


  _preconfig() {

    this._initForm();
    // this.getPlStatement();
  }

  _initForm(){
    this.filterForm = this._fb.group({
      fromDate : this.formatFormDate(new Date()),
      toDate : this.formatFormDate(new Date()),
      sportsId: null,
      matchId: null,
      marketId: null,
    });
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat, this.language);
  }


  getPlStatement() {
    this.isLoading = true;
    this.plStatement = [];
    let fromDate = new Date(this.filterForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.filterForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    let body = {
      fromDate:fromDate,
      toDate:toDate,
      sportId: null,
      matchId: null,
      marketId : null,
      pageNo: this.currentPage,
      limit: 50,
    };

    this._accountStatementService._getPlBySubgameAPi(body).subscribe((res: any) => {
      this.isLoading = false;
      // if (res.admin.finalResult.length > 0) {
        this.plStatement = res.admin.finalResult;
        this.totalPages = Math.ceil(res.admin.totalNoOfRecords / this.pageSize);
      // }
      //this.currentTotalPage = Math.ceil(this.currentPage  / this.totalPages);
    },(err)=>{
      this._sharedService.getToastPopup("Internal server error","","error")
    });
  }


  searchList(){
    if(this.filterForm.value.sportsId == null || this.filterForm.value.sportsId== "null"){
      this.filterForm.value.matchId = null;
    }

    this.isLoading = true;
    this.plStatement = [];
    let fromDate = new Date(this.filterForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.filterForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    if(this.filterForm.value.sportsId == 'null'){
      this.filterForm.value.sportsId = null;
    }
    if(this.filterForm.value.matchId == 'null'){
      this.filterForm.value.matchId = null;
    }
    if(this.filterForm.value.marketId == 'null'){
      this.filterForm.value.marketId = null;
    }


    let payload = {
      fromDate:fromDate,
      toDate:toDate,
      sportId: this.filterForm.value.sportsId,
      matchId: this.filterForm.value.matchId,
      marketId: this.filterForm.value.marketId,
      pageNo: this.currentPage,
      limit: 50,
    };

    this._accountStatementService._getPlBySubgameAPi(payload).subscribe((res: any) => {
      this.isLoading = false;
      // if (res.admin.finalResult.length > 0) {
        this.plStatement = res.admin.finalResult;
        this.totalPages = Math.ceil(res.admin.totalNoOfRecords / this.pageSize);
      // }
      //this.currentTotalPage = Math.ceil(this.currentPage  / this.totalPages);
    },(err)=>{
      this._sharedService.getToastPopup("Internal server error","","error")
    });
  }


  next(): void {
    this.currentPage++;
    this.getPlStatement();
  }

  prev(): void {
    this.currentPage--;
    this.getPlStatement();
  }

  exportExcel(){
    let pL : any = []
    this.plStatement.forEach(element => {
      pL.push({
        Date :  moment(element.createdAt).format("MMM D, YYYY, h:mm:ss a"),
        Game: element.gameName,
        SubGame:element.subGame,
        Event : element.eventName,
        Win_Loss :element.win,
        Commision:element.commission,
        NetAmount:element.netAmount,
        UserCount:element.userCount,
        BetCount:element.userBetCount
      })
    });
    this._sharedService.exportExcel(pL,this.fileName);
 }

 toggleSort(columnName: string) {
  if (this.sortColumn === columnName) {
    this.sortAscending = !this.sortAscending;
  } else {
    this.sortColumn = columnName;
    this.sortAscending = true;
  }
}

}
