import { Component, OnInit } from '@angular/core';
import { ChangePasswordService } from '../../services/change-password.service';
import { SharedService } from '../../../../shared/services/shared.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  authObj = {
    currentPassword:"",
    newPassword:"",
    retypePassword:""
  }

  constructor(private _changePasswordService:ChangePasswordService,private _sharedService:SharedService) { }

  ngOnInit(): void {

  }


  postChangePassword(){
    this._changePasswordService._getChangePasswordeApi(this.authObj).subscribe((res:any)=>{
      console.log(res)
      this._sharedService.getToastPopup(res.message, 'Password', 'success');
      this.authObj.currentPassword = "";
      this.authObj.newPassword = "";
      this.authObj.retypePassword = "";
    })
  }

}
