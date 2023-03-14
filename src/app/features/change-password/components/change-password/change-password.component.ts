import { Component, OnInit } from '@angular/core';
import { ChangePasswordService } from '../../services/change-password.service';
import { SharedService } from '../../../../shared/services/shared.service';
import { FormGroup, FormBuilder, FormControl, AbstractControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  changePasswordForm!: FormGroup;


  authObj = {
    currentPassword:"",
    newPassword:"",
    retypePassword:""
  }

  constructor(private _changePasswordService:ChangePasswordService,
              private _sharedService:SharedService,
              private formbuilder: FormBuilder) { 
              this.changePasswordForm = this.formbuilder.group({
              oldPassword: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
              newPassword: new FormControl(null, [(c: AbstractControl) => Validators.required(c),Validators.pattern(
                "^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
                    )]),
              confirmPassword: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),  
  },
  {

    validators: this.Mustmatch('newPassword', 'confirmPassword')
  }
  )
  }
  get f() {
    return this.changePasswordForm.controls;
  }

  ngOnInit(): void {

  }


  postChangePassword(){
    this._changePasswordService._getChangePasswordeApi(this.authObj).subscribe((res:any)=>{
      console.log('pwd changed',res)
      this._sharedService.getToastPopup(res.message, 'Password', 'success');
      this.authObj.currentPassword = "";
      this.authObj.newPassword = "";
      this.authObj.retypePassword = "";
    })
  }

  // Validation & Confirm Password

  get oldPasswordVail() {
    return this.changePasswordForm.get('oldPassword')
  }


  get newPasswordVail() {
    return this.changePasswordForm.get('newPassword')
  }

  get confirmPasswordVail() {
    return this.changePasswordForm.get('confirmPassword')
  }


  Mustmatch(newPassword: any, confirmPassword: any) {
    return (formGroup: FormGroup) => {
      const newPasswordcontrol = formGroup.controls[newPassword];
      const confirmPasswordcontrol = formGroup.controls[confirmPassword];

      if (confirmPasswordcontrol.errors && !confirmPasswordcontrol.errors['Mustmatch']) {
        return;
      }
      if (newPasswordcontrol.value !== confirmPasswordcontrol.value) {
        confirmPasswordcontrol.setErrors({ Mustmatch: true });
      }
      else {
        confirmPasswordcontrol.setErrors(null);
      }
    }
  };

}
