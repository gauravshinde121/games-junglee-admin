import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss']
})
export class CommissionComponent implements OnInit {

  filterForm:FormGroup;

  constructor() { }

  ngOnInit(): void {
    this._preConfig();
  }

  _preConfig(){
    this._initForm();
  }


  _initForm(){
    this.filterForm = new FormGroup({
      fromDate:new FormControl(new Date()),
      toDate:new FormControl(new FormControl(new Date())),
      player:new FormControl(new FormControl("All"))
    })
  }


  searchCommission(){

  }

}
