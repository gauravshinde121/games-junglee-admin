import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccountStatementService } from '../../services/account-statement.service';

@Component({
  selector: 'app-player-pl',
  templateUrl: './player-pl.component.html',
  styleUrls: ['./player-pl.component.scss']
})
export class PlayerPlComponent implements OnInit {

  filterForm:FormGroup;
  plStatement:any = [];

  constructor(private _accountStatementService:AccountStatementService) { }

  ngOnInit(): void {
    this._preConfig();
  }

  _preConfig(){
    this._initForm();
    this.getPlStatement();
  }


  _initForm(){
    this.filterForm = new FormGroup({
      fromDate:new FormControl(new Date()),
      toDate:new FormControl(new Date()),
      game:new FormControl("All"),
      subGame:new FormControl("All"),
      page:new FormControl(1),
      keyword:new FormControl("All"),
      tms:new FormControl("All"),
      type:new FormControl("All"),
      typeName:new FormControl("All")
    })
  }


  getPlStatement(){
    this._accountStatementService._getDownlineAccountsDataApi(this.filterForm.value).subscribe((res:any)=>{
      console.log(res)
      this.plStatement = res.admin
    })
  }


  getOneAccount(pl){
    console.log(pl)
  }

}
