import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedService } from '../../../../shared/services/shared.service';
import { AccountStatementService } from '../../services/account-statement.service';

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

  constructor(
    private _accountsService:AccountStatementService
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
      console.log('res',res);
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


}
