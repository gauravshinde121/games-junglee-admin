import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-invalid-bet',
  templateUrl: './invalid-bet.component.html',
  styleUrls: ['./invalid-bet.component.scss']
})
export class InvalidBetComponent implements OnInit {

  invalidBetForm:FormGroup;
  dateFormat = "yyyy-MM-dd";
  language = "en";

  constructor() { }

  ngOnInit(): void {
    this._initForm();
  }


  _initForm(){
    this.invalidBetForm = new FormGroup({
      sportsId:new FormControl(0),
      matchId:new FormControl(0),
      fromDate:new FormControl(this.formatFormDate(new Date())),
      toDate:new FormControl(this.formatFormDate(new Date())),
    })
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat,this.language);
  }




}
