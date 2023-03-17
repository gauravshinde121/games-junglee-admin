import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { nameValidator } from '@shared/classes/validator';

@Component({
  selector: 'app-surveillance-main',
  templateUrl: './surveillance-main.component.html',
  styleUrls: ['./surveillance-main.component.scss']
})
export class SurveillanceMainComponent implements OnInit {

  filterForm:FormGroup;
  surveillanceData:any = [];

  constructor(    private _fb: FormBuilder,
    ) { }

  ngOnInit(): void {
    this._preConfig()
  }


  _preConfig(){
    this._initForm()
  }

  _initForm(){
    this.filterForm =this._fb.group({
      // member:new FormControl(),
      memberName: [
        "",
        {
          validators: [nameValidator("Member Name", 1, 25)],
          updateOn: "change",
        },
      ],
      subGame:new FormControl(),
      event:new FormControl(),
      marketType:new FormControl(),
      stakesFrom:new FormControl('All'),
      stakesTo:new FormControl('All'),
      currencyType:new FormControl()
    })
  }


  getSurveillanceData(){

  }

  clearMembers(){
    this.filterForm.controls['memberName'].reset()
  }

}
