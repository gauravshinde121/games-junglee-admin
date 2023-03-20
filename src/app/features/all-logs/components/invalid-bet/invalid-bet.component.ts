import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MembersService } from 'src/app/features/members/services/members.service';

@Component({
  selector: 'app-invalid-bet',
  templateUrl: './invalid-bet.component.html',
  styleUrls: ['./invalid-bet.component.scss']
})
export class InvalidBetComponent implements OnInit {

  invalidBetForm: FormGroup;
  dateFormat = "yyyy-MM-dd";
  language = "en";
  allMembers: any;
  logList: any;

  constructor(
    private _memberService: MembersService
  ) { }

  ngOnInit(): void {
    this._initForm();
    this._getAllMembers();
  }


  _initForm() {
    this.invalidBetForm = new FormGroup({
      memberName: new FormControl(null),
      invalidBet: new FormControl(0),
      fromDate: new FormControl(this.formatFormDate(new Date())),
      toDate: new FormControl(this.formatFormDate(new Date())),
    })
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat, this.language);
  }

  _getAllMembers() {
    this._memberService._getAllMembers().subscribe((data: any) => {
      if (data.memberData) {
        this.allMembers = data.memberData;
      }
    });
  }

  getLogs() {
    this._memberService._getInvalidBetsApi({ ...this.invalidBetForm.value })
      .subscribe((res: any) => {
        console.log(res)
        if (res) {
          this.logList = res.data.betList;
        }
      })
  }

  clearFilters() {
    window.location.reload();
  }

}
