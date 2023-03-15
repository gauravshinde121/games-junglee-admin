import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { AuthService } from '../../services/auth.service';
import jwt_decode from "jwt-decode";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signInForm: FormGroup;
  show: boolean = false;
  isLoading:boolean = false;
  button = 'Sign In';

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this._preConfig();
  }

  private _preConfig() {
    this._createSignInForm();
  }

  _createSignInForm(){
    this.signInForm = this._fb.group({
      username:['',Validators.required],
      password:['',Validators.required]
    })
  }

  onSubmitSignIn(){

    this.isLoading = true;
    let loginData = {
      username: this.signInForm.value['username'],
      pwd: this.signInForm.value['password'],
      userIp:'111:111:111:111',
      rememberme: true
    }

    this._authService._postLoginApi(loginData).subscribe(
      (res: any) => {
        this._sharedService.setJWTToken(res['token']);
        this._sharedService.setUserDetails(jwt_decode(res['token']));
        setTimeout(() => {
          this.isLoading = false;
          this._router.navigate(['/member/list'])
        }, 50)
        // this._router.navigate(['/member/list'])
        // console.log("hello",res);
      },

      )

    }
  }


