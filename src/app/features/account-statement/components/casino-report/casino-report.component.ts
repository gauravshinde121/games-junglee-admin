import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccountStatementService } from '../../services/account-statement.service';
import { SharedService } from '@shared/services/shared.service';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-casino-report',
  templateUrl: './casino-report.component.html',
  styleUrls: ['./casino-report.component.scss']
})
export class CasinoReportComponent implements OnInit {

  isLoading = false;
  casinoStatements:any = [];
  fromDate = new Date().toString();
  toDate = new Date().toString();
  currentDate = new Date().toString();
  casinoReportForm : FormGroup
  dateFormat = "yyyy-MM-dd";
  language = "en";
  sortColumn: string = '';
  providerId:any;
  sortAscending: boolean = true;// 1: ascending, -1: descending

  fileName= 'TransferStatement'+'_'+new Date()+'.xlsx';
  totalAmount: any;
  casinoList:any;

  constructor(
    private _accountsService:AccountStatementService,
    private _sharedService:SharedService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._preConfig();
  }

  _preConfig(){
    this._initForm();
    this.getCasinoProviders();
    this.getCasinoReport();
  }

  _initForm(){
    this.casinoReportForm = new FormGroup({
      fromDate:new FormControl(this.formatFormDate(new Date())),
      toDate:new FormControl(this.formatFormDate(new Date())),
      providerId:new FormControl(null)
    })
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat,this.language);
  }

  getCasinoProviders(){
    this._sharedService._getCasinoProviderstApi().subscribe((res:any)=>{
      this.casinoList = res.casinoList;
    });
  }

  getCasinoReport(){
    this.isLoading = true;

    let fromDate = new Date(this.casinoReportForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.casinoReportForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    if(this.casinoReportForm.value.providerId){
      this.providerId = this.casinoReportForm.value.providerId;
    } else {
      this.providerId = null;
    }
    let body = {
      "providerCode":this.providerId,
      "memberId":null,
      "fromDate":fromDate,
      "toDate":toDate
    }
    this._accountsService._getCasinoReportForAdminApi(body).subscribe((res:any)=>{
      this.isLoading = false;
      console.log('res',res);
      this.casinoStatements = res.casinoStatement.finalStatement;
      this.totalAmount = this.casinoStatements.reduce((acc, crnt) => acc + crnt.amount, 0);
    });
  }

  searchList(event){
    this.isLoading = true;
    let payload = {
      "userId":event.target.value
    }
    this._accountsService._getPlayerAccountStatementApi(payload).subscribe((res:any)=>{
      this.isLoading = false;
      this.casinoStatements = res.accountStatement;
      this.totalAmount = this.casinoStatements.reduce((acc, crnt) => acc + crnt.amount, 0);
    });
  }

  getReportDetails(memberId, gameCode){
    this._router.navigate(['/account-statement/casino-report-details/' + memberId + '/' + gameCode]);
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
