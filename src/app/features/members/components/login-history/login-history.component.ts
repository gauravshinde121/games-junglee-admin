import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { MembersService } from '../../services/members.service';

@Component({
  selector: 'app-login-history',
  templateUrl: './login-history.component.html',
  styleUrls: ['./login-history.component.scss']
})
export class LoginHistoryComponent implements OnInit {

  userId;
  loginHistoryForm: FormGroup;
  dateFormat = "yyyy-MM-dd";
  language = "en";
  isLoading = false;
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 0;
  limit:number = 50;

  constructor(
    private _memberService: MembersService,
    private _sharedService: SharedService,
    private _router: Router,
    private route: ActivatedRoute,
    private _fb: FormBuilder,
    ) { }

  loginHistory:any = [];
  currentDate = new Date();

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
    })

    this._preConfig();
  }


  _preConfig(){
    this._initForm();
    this.searchLoginHistory();
  }


  _initForm(){
    this.loginHistoryForm = this._fb.group({
      fromDate : this.formatFormDate(new Date()),
      toDate : this.formatFormDate(new Date()),
    });
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat,this.language);
  }

  next(): void {
    this.currentPage++;
    this.searchLoginHistory();
  }

  prev(): void {
    this.currentPage--;
    this.searchLoginHistory();
  }

  searchLoginHistory() {

    this.isLoading = true;

    let fromDate = new Date(this.loginHistoryForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.loginHistoryForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    const payload = {
      userId: this.userId,
      fromDate: fromDate,
      toDate: toDate,
      pageNo: this.currentPage,
      limit: this.limit,
    }

    this._memberService._getMemberLoginHistoryApi(payload).subscribe((res: any) => {
      console.log(res);
      this.isLoading = false;
      if(res.userDeviceLogs){
        this.loginHistory = res.userDeviceLogs;
        this.totalPages = Math.ceil(this.loginHistory.length / this.pageSize);
      }
    },(err)=>{
      console.log(err);
      this._sharedService.getToastPopup("Internal server error","","error")
    });
  }



}
