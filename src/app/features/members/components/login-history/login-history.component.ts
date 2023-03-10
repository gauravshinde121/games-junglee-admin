import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../services/members.service';

@Component({
  selector: 'app-login-history',
  templateUrl: './login-history.component.html',
  styleUrls: ['./login-history.component.scss']
})
export class LoginHistoryComponent implements OnInit {

  constructor(private _memberService: MembersService) { }

  loginHistory:any = [];
  currentDate = new Date();

  ngOnInit(): void {
    this._preConfig();
  }


  _preConfig(){
    this.searchActivity();
  }

  searchActivity() {

    // this._memberService._getAccountStatementApi(paramObj).subscribe((data: any) => {
    //   this.loginHistory = data;
    // })
  }

}
