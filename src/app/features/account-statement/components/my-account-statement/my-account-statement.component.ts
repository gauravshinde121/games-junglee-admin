import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AccountStatementService } from '../../services/account-statement.service';
import { SharedService } from '@shared/services/shared.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { MembersService } from 'src/app/features/members/services/members.service';

@Component({
  selector: 'app-my-account-statement',
  templateUrl: './my-account-statement.component.html',
  styleUrls: ['./my-account-statement.component.scss']
})
export class MyAccountStatementComponent implements OnInit {

  filterForm: FormGroup;
  plStatement: any = [];
  games: any;
  matchList: any = [];
  marketTypeList: any = [];
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

  fileName= 'Account_Statement.xlsx';

  sortColumn: string = '';
  sortAscending: boolean = true;// 1: ascending, -1: descending
  memberId;
  limit: number = 25;

  constructor(
    private _accountStatementService: AccountStatementService,
    private _sharedService: SharedService,
    private _router: Router,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this._preconfig();
  }



  _preconfig() {
    this._initForm();
    this.getPlStatement();
  }


  _initForm(){
    this.filterForm = this._fb.group({
      fromDate : this.formatFormDate(new Date()),
      toDate : this.formatFormDate(new Date()),
      sportsId: null,
      matchId: null,
      marketId: null,
      memberId : null
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
      userId : null
    };

    this._accountStatementService._getAdminAccountStatementApi(body).subscribe((res: any) => {
      this.isLoading = false;
      if (res.accountStatement.length > 0) {
        this.plStatement = res.accountStatement;
        this.totalPages = Math.ceil(res.totalRecords / this.pageSize);
      }
      // this.currentTotalPage = Math.ceil(this.currentPage  / this.totalPages);
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
    };

    this._accountStatementService._getAdminAccountStatementApi(payload).subscribe((res: any) => {
      this.isLoading = false;
      console.log(res)
      this.plStatement = res.accountStatement;
      this.totalPages = Math.ceil(res.totalRecords / this.pageSize);
    
    },(err)=>{
      this._sharedService.getToastPopup("Internal server error","","error")
    });
  }


  openAllBets(matchId){
    if(matchId){
      this._router.navigate(['/account-statement/all-bets/'+matchId]);
    }
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
      console.log("pl",element);
      pL.push({
        Date :  moment(element.date).format("MMM D, YYYY, h:mm:ss a"),
        Credit: element.credit,
        Debit:element.debit,
        Balance : element.balance,
        Remark :element.remark,
        
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
