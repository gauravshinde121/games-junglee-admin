import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-surveillance-main',
  templateUrl: './surveillance-main.component.html',
  styleUrls: ['./surveillance-main.component.scss']
})
export class SurveillanceMainComponent implements OnInit {

  filterForm:FormGroup;
  surveillanceData:any = [];

  constructor() { }

  ngOnInit(): void {
    this._preConfig()
  }


  _preConfig(){
    this._initForm()
  }

  _initForm(){
    this.filterForm = new FormGroup({
      member:new FormControl(),
      subGame:new FormControl(),
      event:new FormControl(),
      marketType:new FormControl(),
      fromStake:new FormControl(),
      toStake:new FormControl(),
      currencyType:new FormControl()
    })
  }


  getSurveillanceData(){

  }

}
