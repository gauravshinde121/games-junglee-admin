import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

  constructor(
    private _memberService: MembersService,
    private _sharedService: SharedService,
    private _router: Router,
    private route: ActivatedRoute) { }

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
    this.loginHistoryForm = new FormGroup({
      fromDate:new FormControl(new Date()),
      toDate:new FormControl(new Date()),
    });
  }

  searchLoginHistory() {
    const payload = {
      userId:this.userId,
      fromDate:this.loginHistoryForm.value['fromDate'],
      toDate:this.loginHistoryForm.value['toDate'],
    }

    this._memberService._getMemberLoginHistoryApi(payload).subscribe((res: any) => {
      console.log(res)
      if(res.data){
        this.loginHistory = res.data;
      }
    })
  }

}
