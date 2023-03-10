import { Component, OnInit } from '@angular/core';
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

  constructor(
    private _accountsService:AccountStatementService
  ) { }

  ngOnInit(): void {
    this._preConfig();
  }


  _preConfig(){
    this.getTransferStatement()
  }


  getTransferStatement(){
    this._accountsService._getTransferStatementApi({fromDate:this.fromDate,toDate:this.toDate,page:1}).subscribe(res=>{
      console.log(res)
      this.transferStatements = res;
    })
  }


}
