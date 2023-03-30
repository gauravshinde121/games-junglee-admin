import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { SharedService } from '../../../../shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MembersService } from '../../services/members.service';
import { Observable } from 'rxjs';
import { userNameValidator } from '@shared/classes/validator';

@Component({
  selector: 'app-create-member',
  templateUrl: './create-member.component.html',
  styleUrls: ['./create-member.component.scss']
})
export class CreateMemberComponent implements OnInit {

  memberForm: FormGroup;
  isLoading = false;
  editMode:boolean;
  memberData: any;
  editUserId: any;
  gamesList: any = [];
  roles: any = [];
  userDetails:any;
  isSuperAdmin:any;
  roleId: string = '';

  constructor(
    private _fb: FormBuilder,
    private _sharedService: SharedService,
    private _memberService: MembersService,
    private _router: Router,
    private route: ActivatedRoute
  ) { }

  async ngOnInit(): Promise<void> {
    //this.route.snapshot.params['id']? this.getMemberInfo():this.getGames();
    this._preConfig();
    if (this.route.snapshot.params['id']) {
      this.editMode = true;
      this.
        editUserId = this.route.snapshot.params['id'];
      await this.getMemberInfo();
    }
    console.log('this.editMode();',this.editMode);
    //else {
    this.getGames();
    //}

  }

  private _preConfig() {
    this._createMemberForm();
    this._getRoles();
  }

  getGames() {
    this._sharedService._getGames().subscribe((res: any) => {
      if (res.gamesList) {
        this.gamesList = res.gamesList.map(gameId => ({ ...gameId, isActive: true }));
      }
    })
  }

  setGameStatus(status, sportsId) {
    this.gamesList.find(g => g.gameId == sportsId).isActive = !status;
    this.memberForm.markAsDirty();
  }


  async getMemberInfo() {
    await this._sharedService._getSingleUsersApi({
      "userId": +this.route.snapshot.params['id']
    }).subscribe(((res: any) => {
      console.log('res', res)
      if (res) {
        this.memberData = res.user;
        console.log(this.memberData);
        this.gamesList = res.gameStatus;
        this.roleId = this.memberData.roleId;
        this.memberForm.patchValue({
          status: this.memberData.isActive,
          username: this.memberData.username,
          displayName: this.memberData.displayName,
          playerMaxCreditLimit: this.memberData.creditLimit,
          sportsBookRate: this.memberData.sportsBookRate,
          liveCasinoRate: this.memberData.liveCasinoRate,
          minimumBet: this.memberData.minimumBet,
          maxBet: this.memberData.maxBet,
          maxExposure: this.memberData.maxExposure,
          //isActive: this.memberData.isActive,
          roleId:this.memberData.roleId
        });
      }
    }))
  }


  _createMemberForm() {
    if (!this.editMode) {
      this.userDetails = this._sharedService.getUserDetails();
      this.isSuperAdmin = this.userDetails.roleId.indexOf(1);
      console.log('this.isSuperAdmin',this.isSuperAdmin);
      var sportsBookRate = 1;
      var liveCasinoRate = 100;
      var minBet = 100;
      var maxBet = 1000000;
      var maxExposure = 50000000;
      if(this.isSuperAdmin == -1){
        console.log('not super admin');
        sportsBookRate = this.userDetails.sportsBookRate;
        liveCasinoRate = this.userDetails.liveCasinoRate;
        minBet = this.userDetails.minimumBet;
        maxBet = this.userDetails.maxBet;
        maxExposure = this.userDetails.maxExposure;
      }
      this.memberForm = this._fb.group({
        username: [
          "",
          {
            validators: [userNameValidator("User Name", 1, 25)],
            updateOn: "change",
          },
        ],
        displayName: ['', Validators.required],
        password: new FormControl(null, [(c: AbstractControl) => Validators.required(c), Validators.pattern(
          "^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
        )]),
        confirmPassword: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
        playerMaxCreditLimit: ['', Validators.required],
        //comments: [''],
        sportsBookRate: [sportsBookRate, [(c: AbstractControl) => Validators.required(c), Validators.max(1), Validators.min(1)]],
        liveCasinoRate: [liveCasinoRate, [(c: AbstractControl) => Validators.required(c), Validators.max(100), Validators.min(100)]],
        minBet: [minBet, [(c: AbstractControl) => Validators.required(c), Validators.min(100)]],
        maxBet: [maxBet, [(c: AbstractControl) => Validators.required(c), Validators.max(10000000), Validators.min(1)]],
        maxExposure: [maxExposure, [(c: AbstractControl) => Validators.required(c), Validators.max(50000000), Validators.min(1)]],
        //status: ['Active', Validators.required],
        roleId: [7, Validators.required],
        partnerShipPercent: [8,[(c: AbstractControl) => Validators.required(c), Validators.max(100), Validators.min(8)]]
      },
        {
          validators: this.Mustmatch('password', 'confirmPassword')
        })
    } else {
      this.memberForm = this._fb.group({
        displayName: ['', Validators.required],
        playerMaxCreditLimit: ['', Validators.required],
        //comments: [''],
        sportsBookRate: [1, [(c: AbstractControl) => Validators.required(c), Validators.max(1), Validators.min(1)]],
        roleId: ['', Validators.required],
        liveCasinoRate: [100, [(c: AbstractControl) => Validators.required(c), Validators.max(100), Validators.min(100)]],
        minBet: [100, [(c: AbstractControl) => Validators.required(c), Validators.min(100)]],
        maxBet: [1000000, [(c: AbstractControl) => Validators.required(c), Validators.max(10000000), Validators.min(1)]],
        maxExposure: [50000000, [(c: AbstractControl) => Validators.required(c), Validators.max(50000000), Validators.min(1)]],
        partnerShipPercent: [8, [(c: AbstractControl) => Validators.required(c), Validators.max(100), Validators.min(8)]]
      },
        {
          validators: []
        })
    }
  }

  get f() {
    return this.memberForm.controls;
  }

  onSubmitMemberForm() {
    this.isLoading = true;
    console.log('this.memberForm.value',this.memberForm.value);
    let memberData = {};
    if (!this.editMode) {
      memberData = {
        "displayName": this.memberForm.value['displayName'],
        "username": this.memberForm.value['username'],
        "pwd": this.memberForm.value['password'],
        //"comments":this.memberForm.value['comments'],
        "creditLimit": this.memberForm.value['playerMaxCreditLimit'],
        "sportsBookRate": this.memberForm.value['sportsBookRate'],
        "liveCasinoRate": this.memberForm.value['liveCasinoRate'],
        "minimumBet": this.memberForm.value['minBet'],
        "maxBet": this.memberForm.value['maxBet'],
        "maxExposure": this.memberForm.value['maxExposure'],
        //"isActive": this.memberForm.value['status'],
        "gameStatus": this.gamesList,
        "roleId": this.memberForm.value['roleId'],
        "partnerShipPercent": this.memberForm.value['partnerShipPercent']
      }
    } else {
      memberData = {
        "displayName": this.memberForm.value['displayName'],
        "username": this.memberForm.value['username'],
        //"comments": this.memberForm.value['comments'],
        "creditLimit": this.memberForm.value['playerMaxCreditLimit'],
        "sportsBookRate": this.memberForm.value['sportsBookRate'],
        "liveCasinoRate": this.memberForm.value['liveCasinoRate'],
        "minimumBet": this.memberForm.value['minBet'],
        "maxBet": this.memberForm.value['maxBet'],
        "maxExposure": this.memberForm.value['maxExposure'],
        //"isActive": this.memberForm.value['status'],
        "gameStatus": this.gamesList,
        "roleId": this.memberForm.value['roleId'],
        "partnerShipPercent": this.memberForm.value['partnerShipPercent']
      }
    }

    let memberObs: Observable<any>;
    let msg = "";
    if (!this.editMode) {
      msg = 'Created';
      memberObs = this._memberService._getCreateNewUserApi(memberData);
    } else {
      msg = 'Updated';
      memberData["userId"] = this.route.snapshot.params['id'];
      memberObs = this._memberService._getEditUserApi(memberData);
      console.log(memberObs)
    }

    memberObs.subscribe(
      (res: any) => {
        this._sharedService.getToastPopup(`User ${msg} Successfully`, 'Member', 'success');
        this._router.navigate(['/member/list'])
        this._sharedService.sharedSubject.next({
          'updateAdminDetails': true
        });
      }, (error) => {
        this.isLoading = false;
        this._sharedService.getToastPopup(`Error while creating the member.`, 'Member', 'error');
      }
    )

  }


  _getRoles() {
    this._memberService._getRolesApi().subscribe((roles: any) => {
      this.roles = roles.data;
      /*if(roles){
        this.memberForm.controls['roleId'].setValidators([(c: AbstractControl) => Validators.required(roles.roleId)]);
      }*/
    })
  }

  // Must Match Password

  Mustmatch(password: any, confirmPassword: any) {
    return (formGroup: FormGroup) => {
      const passwordcontrol = formGroup.controls[password];
      const confirmPasswordcontrol = formGroup.controls[confirmPassword];

      if (confirmPasswordcontrol.errors && !confirmPasswordcontrol.errors['Mustmatch']) {
        return;
      }
      if (passwordcontrol.value !== confirmPasswordcontrol.value) {
        confirmPasswordcontrol.setErrors({ Mustmatch: true });
      }
      else {
        confirmPasswordcontrol.setErrors(null);
      }
    }
  };

  // validation

  get passwordVail() {
    return this.memberForm.get('password')
  }

  get confirmPasswordVail() {
    return this.memberForm.get('confirmPassword')
  }

  get usernameVail() {
    return this.memberForm.get('username')
  }

  get displaynameVail() {
    return this.memberForm.get('displayName')
  }

}
