import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedService } from '../../../../shared/services/shared.service';
import { AccountStatementService } from '../../services/account-statement.service';
import * as moment from 'moment';
@Component({
  selector: 'app-transfer-statement',
  templateUrl: './transfer-statement.component.html',
  styleUrls: ['./transfer-statement.component.scss']
})
export class TransferStatementComponent implements OnInit {

  isLoading = false;
  transferStatements:any = [];
  fromDate = new Date().toString();
  toDate = new Date().toString();
  currentDate = new Date().toString();
  transferStmtForm : FormGroup
  dateFormat = "yyyy-MM-dd";
  language = "en";
  currentPage: number = 1;
  totalPages: number = 0;
  pageSize:number = 10;
  limit:number = 50;

  fileName= 'TransferStatement.xlsx';

  constructor(
    private _accountsService:AccountStatementService,
    private _sharedService:SharedService,
  ) { }

  ngOnInit(): void {
    this._preConfig();
  }

  _preConfig(){
    this._initForm();
    this.getTransferStatement()
  }

  _initForm(){
    this.transferStmtForm = new FormGroup({
      fromDate:new FormControl(this.formatFormDate(new Date())),
      toDate:new FormControl(this.formatFormDate(new Date())),
    })
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat,this.language);
  }


  getTransferStatement(){
    this.isLoading = true;

    let fromDate = new Date(this.transferStmtForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.transferStmtForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    let payload = {
      fromDate : fromDate,
      toDate : toDate,
      pageNo: this.currentPage,
      limit: this.limit,
    }

    this._accountsService._getTransferStatementApi(payload).subscribe((res:any)=>{
      this.isLoading = false;
      this.transferStatements = res.transferStatement;
      this.totalPages = Math.ceil(this.transferStatements.length / this.pageSize);
    });
  }

  next(): void {
    this.currentPage++;
    this.getTransferStatement();
  }

  prev(): void {
    this.currentPage--;
    this.getTransferStatement();
  }

  exportExcel(){
    let transfetStatemnt : any = []
    this.transferStatements.forEach(element => {
      transfetStatemnt.push({
        Date :  moment(element.createdDate).format("MMM D, YYYY, h:mm:ss a"),
        FromUser: element.fromUsername,
        Touser:element.toUsername,
        Amount : element.amount,
        TransactionType:element.isGiven,
      })
    });
    this._sharedService.exportExcel(transfetStatemnt,this.fileName);
    // this._sharedService.exportExcel(this.transferStatements,this.fileName);
 }

}
