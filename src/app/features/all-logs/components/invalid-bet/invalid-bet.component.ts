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
  allBets: any = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  isLoading = false;

  constructor(
    private _memberService: MembersService
  ) { }

  ngOnInit(): void {
    this._initForm();
    this._getAllMembers();
    this.getLogs();
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

    let fromDate = new Date(this.invalidBetForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.invalidBetForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    let body = {
      fromDate : fromDate, 
      toDate : toDate,
      userId :null
    }
    this.isLoading = true;
    this._memberService._getInvalidBetsApi(body)
      .subscribe((res: any) => {
        console.log(res)
        if (res) {
          // this.logList = res.data.betList;
          this.isLoading = false;
          this.allBets = res.invalidBetList;
          this.totalPages = Math.ceil(this.allBets.length / this.pageSize);
        }
      })
  }

  clearFilters() {
    // window.location.reload();
    this._initForm();
    // this.invalidBetForm.value.memberName = null;
    // this.invalidBetForm.value.invalidBet = 0;
    // this.invalidBetForm.value.fromDate = this.formatFormDate(new Date());
    // this.invalidBetForm.value.toDate = this.formatFormDate(new Date();
  }

}
