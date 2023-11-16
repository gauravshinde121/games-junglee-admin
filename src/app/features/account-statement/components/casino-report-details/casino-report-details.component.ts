import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccountStatementService } from '../../services/account-statement.service';
import { SharedService } from '@shared/services/shared.service';
import { formatDate } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-casino-report-details',
  templateUrl: './casino-report-details.component.html',
  styleUrls: ['./casino-report-details.component.scss']
})
export class CasinoReportDetailsComponent implements OnInit {

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
  userId: string;
  gameCode: string;
  fileName= 'TransferStatement'+'_'+new Date()+'.xlsx';
  totalAmount: any;
  casinoList:any;

  constructor(
    private _accountsService:AccountStatementService,
    private _sharedService:SharedService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._preConfig();
  }

  _preConfig(){
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      this.gameCode = params['gameCode'];
    });
    this._initForm();
    this.getCasinoReportDetail();
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

  getCasinoReportDetail(){
    this.isLoading = true;

    let fromDate = new Date(this.casinoReportForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.casinoReportForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    let body = {
      "gameCode":this.gameCode,
      "memberId":this.userId,
      "fromDate":fromDate,
      "toDate":toDate
    }
    this._accountsService._getCasinoReportDetailForAdminApi(body).subscribe((res:any)=>{
      this.isLoading = false;
      console.log('res',res);
      this.casinoStatements = res.accountDetails.accountStatement;
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
    });
  }

  getReportDetails(){
    console.log('getReportDetails called');
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
