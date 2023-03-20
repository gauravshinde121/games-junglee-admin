import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss']
})
export class CommissionComponent implements OnInit {

  currentDate = new Date();

  commisionForm : FormGroup;
  dateFormat = "yyyy-MM-dd";
  language = "en";

  constructor(private _fb: FormBuilder,) { }

  ngOnInit(): void {

    this._initForm();
  }

  _initForm(){
    this.commisionForm = this._fb.group({
      fromDate : this.formatFormDate(new Date()),
      toDate : this.formatFormDate(new Date()),
    });
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat,this.language);
  }

  searchActivity(){
    let body = {
      fromDate : this.commisionForm.value.fromDate,
      toDate : this.commisionForm.value.toDate
    }
  }



}
