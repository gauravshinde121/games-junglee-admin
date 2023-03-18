import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
@Component({
  selector: 'app-transfer-statements',
  templateUrl: './transfer-statements.component.html',
  styleUrls: ['./transfer-statements.component.scss']
})
export class TransferStatementsComponent implements OnInit {

  transferStatements: any;
  currentDate = new Date();
  fromDate = new Date().toString();
  toDate = new Date().toString();
  userId:any = null;
  filterForm:FormGroup;

  constructor(
    private _memberService: MembersService,
    private route: ActivatedRoute,
    private _sharedService: SharedService) {

    this.route.params.subscribe(params => {
      this.userId = +params['id'];
    })
   }

  ngOnInit(): void {
    this._preConfig();
  }

  _initForm(){
    this.filterForm = new FormGroup({
      fromDate:new FormControl(new Date()),
      toDate:new FormControl(new Date()),
      page:new FormControl(1)
    })
  }

  _preConfig(){
    this._initForm();
    this.getTransferStatement();
  }

  getTransferStatement() {

    const payload= {
      fromDate:this.filterForm.value['fromDate'],
      toDate:this.filterForm.value['toDate'],
      userId:this.userId
    }

    this._memberService._getTransferStatementForUserApi(payload).subscribe((data: any) => {
      console.log(data)
      this.transferStatements = data;
    })
  }

  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [day, month, year].join('/');
  }


}
