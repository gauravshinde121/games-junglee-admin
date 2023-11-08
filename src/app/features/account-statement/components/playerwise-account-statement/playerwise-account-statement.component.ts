import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { AccountStatementService } from '../../services/account-statement.service';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-playerwise-account-statement',
  templateUrl: './playerwise-account-statement.component.html',
  styleUrls: ['./playerwise-account-statement.component.scss']
})
export class PlayerwiseAccountStatementComponent implements OnInit {

  isLoading = false;
  accountStatements:any = [];
  fromDate = new Date().toString();
  toDate = new Date().toString();
  currentDate = new Date().toString();
  accountStmtForm : FormGroup
  dateFormat = "yyyy-MM-dd";
  language = "en";
  sortColumn: string = '';
  sortAscending: boolean = true;// 1: ascending, -1: descending

  fileName= 'TransferStatement'+'_'+new Date()+'.xlsx';
  totalAmount: any;
  playerList:any;

  constructor(
    private _accountsService:AccountStatementService,
    private _sharedService:SharedService
  ) { }

  ngOnInit(): void {
    this._preConfig();
  }

  _preConfig(){
    this._initForm();
    this.getPlayers();
  }

  _initForm(){
    this.accountStmtForm = new FormGroup({
      playerId:new FormControl(null)
    })
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat,this.language);
  }

  getPlayers(){
    this._sharedService._getPlayerListApi().subscribe((res:any)=>{
      this.playerList = res.memberData;
    });
  }

  searchList(event){
    this.isLoading = true;
    let payload = {
      "userId":event.target.value
    }
    this._accountsService._getPlayerAccountStatementApi(payload).subscribe((res:any)=>{
      this.isLoading = false;
      this.accountStatements = res.accountStatement;
    });
  }

  toggleSort(columnName: string) {
    if (this.sortColumn === columnName) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = columnName;
      this.sortAscending = true;
    }
  }

  changePlayer(evt){
    this.accountStmtForm.value.marketId = evt.target.value;
  }

}
