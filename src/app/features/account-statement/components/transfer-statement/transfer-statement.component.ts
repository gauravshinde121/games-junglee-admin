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

    let payload = {
      fromDate : this.transferStmtForm.value.fromDate,
      toDate : this.transferStmtForm.value.toDate,
      page : 1
    }

    this._accountsService._getTransferStatementApi(payload).subscribe(res=>{
      console.log(res)
      this.transferStatements = res;
    })
  }


}
