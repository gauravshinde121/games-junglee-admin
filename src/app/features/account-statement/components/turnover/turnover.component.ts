import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccountStatementService } from '../../services/account-statement.service';

@Component({
  selector: 'app-turnover',
  templateUrl: './turnover.component.html',
  styleUrls: ['./turnover.component.scss']
})
export class TurnoverComponent implements OnInit {

  filterForm:FormGroup;
  plStatement:any = [];

  constructor(private _accountStatementService:AccountStatementService) { }

  ngOnInit(): void {
    this._preConfig();
  }

  _preConfig(){
    this._initForm();
    this.getTurnOver();
  }


  _initForm(){
    this.filterForm = new FormGroup({
      fromDate:new FormControl(new Date()),
      toDate:new FormControl(new Date()),
      page:new FormControl(1),
      subGame:new FormControl("All"),
    })
  }

  getTurnOver(){
    this._accountStatementService._getCategoryForTO(this.filterForm.value).subscribe((res:any)=>{
      console.log(res)
      this.plStatement = res;
      console.log(this.plStatement)
    })
  }


  getTOForMatch(matchId){
    this._accountStatementService._getTOForMatch({matchId:matchId}).subscribe((res:any)=>{
      console.log(res)
    })
  }

}
