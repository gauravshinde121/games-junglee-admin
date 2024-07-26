import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('otpInput') otpInput!: ElementRef;
  signInForm: FormGroup;
  show: boolean = false;
  isLoading: boolean = false;
  button = 'Sign In';
  display: string = 'none';

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    localStorage.clear();
    this._preConfig();
  }

  private _preConfig() {
    this._createSignInForm();
  }

  _createSignInForm() {
    this.signInForm = this._fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  onSubmitSignIn() {
    this.isLoading = true;

    let loginData = {
      username: this.signInForm.value['username'],
      pwd: this.signInForm.value['password'],
      // userIp: '127.0.0.1',
      userIp: this._sharedService.getIpAddress(),
      rememberme: true
    }
    this._authService._postLoginApi(loginData).subscribe(
      (res: any) => {
        interface DecodedToken {
          account?: string;
          tokenType?: string;
          admin?: {
            userId?: number;
            displayName?: string;
            username?: string;
            refClientid?: number;
            roleId?: number;
            userRoleName?: string;
            isActive?: string;
            superAdminStatus?: string;
            adminStatus?: string;
            superMasterStatus?: string;
            masterStatus?: string;
            agentStatus?: string;
            dealerStatus?: string;
            ifTwoFactorEnabled?: boolean;
          };
          iat?: number;
          exp?: number;
          aud?: string;
          iss?: string;
        }
        const decodedToken = jwt_decode<DecodedToken>(res['token']) || {};
        if (decodedToken.admin?.ifTwoFactorEnabled === true) {
          this.display = 'block';
          //return false;
        this._sharedService.setJWTToken(res['token']);
        this._sharedService.setUserDetails(jwt_decode(res['token']));
        this._sharedService.sendOtpMessageApi({}).subscribe(res=>{
          console.log('resresres', res);
        });
        } else {
          this._sharedService.setJWTToken(res['token']);
          this._sharedService.setUserDetails(jwt_decode(res['token']));
          this.isLoading = false;
          // this._sharedService.currentUserIp.next(res['ip']);
          this._router.navigate(['/member/list']);
        }

      },
      () => this.isLoading = false,
      () => this.isLoading = false
    )

    /*this._sharedService.getIPApi().subscribe(res => {

      let ip =  res['ip'];
      this._sharedService.getIPV2Api(ip).subscribe((res: any)=>{
        sessionStorage.setItem('ipdata',JSON.stringify(res));

      })


    });*/
  }


  closeModal() {
    this.display = 'none';
    this._sharedService.removeJWTToken();
    this._sharedService.removeUserDetails();
    localStorage.clear();
    this._router.navigate(['/login']);
  }

  verifyOTP(){
    const otpValue = this.otpInput.nativeElement.value;
    console.log('OTP:', otpValue);
    this._sharedService.verifyOtpEndpoint({otp:otpValue}).subscribe(res=>{
      if(res['message'] == "Done"){
        this.isLoading = false;
        this._router.navigate(['/member/list']);
      } else {
        this._sharedService.getToastPopup("Invalid OTP!","Please enter a valid OTP.",'error');
      }
    });
  }
}
