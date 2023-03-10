import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AccountStatementService } from '../../services/account-statement.service';

@Component({
  selector: 'app-my-pl',
  templateUrl: './my-pl.component.html',
  styleUrls: ['./my-pl.component.scss']
})
export class MyPlComponent implements OnInit {

  filterForm:FormGroup;
  plStatement:any = [];

  constructor(private _accountStatementService:AccountStatementService) { }

  ngOnInit(): void {
    this._preconfig();
  }

  _preconfig(){
    this.__initForm()
    this.getPlStatement();
  }

  __initForm(){
    this.filterForm = new FormGroup({
      fromDate:new FormControl(new Date()),
      toDate:new FormControl(new Date()),
      game:new FormControl(new Date()),
      subGame:new FormControl(new FormControl()),
      page:new FormControl(1)
    })
  }

  getPlStatement(){
    this._accountStatementService._getPlBySubgameAPi(this.filterForm.value).subscribe((res:any)=>{
      console.log(res)
      this.plStatement = res.admin;
    })
  }

}
