import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { SharedService } from '../../../../shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MembersService } from '../../services/members.service';
import { Observable } from 'rxjs';
import { userNameValidator } from '@shared/classes/validator';
import { subscribeOn } from 'rxjs/operators';

@Component({
  selector: 'app-create-member',
  templateUrl: './create-member.component.html',
  styleUrls: ['./create-member.component.scss']
})
export class CreateMemberComponent implements OnInit {

  memberForm: FormGroup;
  isLoading = false;
  editMode: boolean;
  memberData: any;
  editUserId: any;
  gamesList: any = [];
  roles: any = [];
  userDetails: any;
  isSuperAdmin: any;
  roleId: string = '';
  createUserWithRoleId: number;
  uplineInfo;
  maxBetMinValue: number;
  memberPercentage:any = '--';
  show:boolean = false;
  show1:boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _sharedService: SharedService,
    private _memberService: MembersService,
    private _router: Router,
    private route: ActivatedRoute
  ) { }

  async ngOnInit(): Promise<void> {
    this._sharedService.selectedUserRoleId.subscribe((res: any) => {
      console.log('selectedUserRoleId shared service acalled', res['createUserWithRoleId']);
      this.createUserWithRoleId = res['createUserWithRoleId'];
    });

    this._sharedService.maxBetMinValue.subscribe((res: any) => {
      this.maxBetMinValue = res['value'];
      console.log('this.maxBetMinValue',res['value'],this.maxBetMinValue);
    });
    this._preConfig();


    if (this.route.snapshot.params['id']) {
      this.editMode = true;
      this.editUserId = this.route.snapshot.params['id'];
    }

  }

  private _preConfig() {
    this.getGames();
    this._getRoles();
  }

  getGames() {
    this._sharedService._getGames().subscribe((res: any) => {
      if (res.gamesList) {
        this.gamesList = res.gamesList.map(gameId => ({ ...gameId, isActive: true }));
      }
    })
  }

  calculateMemberPercentage(e){
    var memPer:any;
    memPer = e.target.value - this.uplineInfo.partnerShipPercent;
    if(memPer < 1){
      this.memberPercentage = '--';
    }else {
      this.memberPercentage = memPer;
    }
  }

  setGameStatus(status, sportsId) {
    this.gamesList.find(g => g.gameId == sportsId).isActive = !status;
    this.memberForm.markAsDirty();
  }


  async getMemberInfo() {
    this._sharedService._getSingleUsersApi({
      "userId": +this.route.snapshot.params['id']
    }).subscribe(((res: any) => {
      console.log('res', res)
      if (res) {
        this.memberData = res.user;
        console.log(this.memberData);
        this.gamesList = res.gameStatus;
        this.roleId = this.memberData.roleId;
        this.memberForm.patchValue({
          username: this.memberData.username,
          displayName: this.memberData.displayName,
          playerMaxCreditLimit: this.memberData.creditLimit,
          playerAvailableCredit: this.memberData.availableCredit,
          sportsBookRate: this.memberData.sportsBookRate,
          liveCasinoRate: this.memberData.liveCasinoRate,
          minBet: this.memberData.minimumBet,
          maxBet: this.memberData.maxBet,
          maxExposure: this.memberData.maxExposure,
          partnerShipPercent: this.memberData.partnerShipPercent,
          roleId: this.memberData.roleId
        });
        var memPer:any;
        memPer = this.memberData.partnerShipPercent - this.uplineInfo.partnerShipPercent;
        if(memPer < 1){
          this.memberPercentage = '--';
        }else {
          this.memberPercentage = memPer;
        }
      }
    }))
  }


  _createMemberForm() {
    console.log('this.uplineInfo',this.uplineInfo);
    if (!this.editMode) {
      this.memberForm = this._fb.group({
        username: ['', Validators.required],
        displayName: ['', Validators.required],
        password: new FormControl(null, [(c: AbstractControl) => Validators.required(c), Validators.pattern(
          "^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
        )]),
        confirmPassword: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
        playerMaxCreditLimit: [''],
        playerAvailableCredit: ['', Validators.required],
        sportsBookRate: [1, [(c: AbstractControl) => Validators.required(c), Validators.max(100), Validators.min(1)]],
        liveCasinoRate: [1, [(c: AbstractControl) => Validators.required(c), Validators.max(100), Validators.min(1)]],
        minBet: [100, [(c: AbstractControl) => Validators.required(c), Validators.min(100)]],
        maxBet: [500000, [(c: AbstractControl) => Validators.required(c), Validators.max(10000000), Validators.min(this.maxBetMinValue)]],
        maxExposure: [this.uplineInfo.maxExposure, [(c: AbstractControl) => Validators.required(c), Validators.max(50000000), Validators.min(1)]],
        roleId: [this.createUserWithRoleId, Validators.required],
        partnerShipPercent: [this.uplineInfo.partnerShipPercent, [(c: AbstractControl) => Validators.required(c), Validators.max(100), Validators.min(this.uplineInfo.partnerShipPercent)]]
      },
        {
          validators: this.Mustmatch('password', 'confirmPassword')
        })
    } else {
      this.memberForm = this._fb.group({
        displayName: [''],
        username: [''],
        playerMaxCreditLimit: [''],
        playerAvailableCredit: ['', Validators.required],
        sportsBookRate: [1, [(c: AbstractControl) => Validators.required(c), Validators.max(100), Validators.min(1)]],
        roleId: ['', Validators.required],
        liveCasinoRate: [1, [(c: AbstractControl) => Validators.required(c), Validators.max(100), Validators.min(1)]],
        minBet: [100, [(c: AbstractControl) => Validators.required(c), Validators.min(100)]],
        maxBet: [500000, [(c: AbstractControl) => Validators.required(c), Validators.max(10000000), Validators.min(1)]],
        maxExposure: [50000000, [(c: AbstractControl) => Validators.required(c), Validators.max(50000000), Validators.min(1)]],
        partnerShipPercent: [0, [(c: AbstractControl) => Validators.required(c), Validators.max(100), Validators.min(this.uplineInfo.partnerShipPercent)]]
      },
        {
          validators: []
        })
    }
  }

  onMinBetChange(e){
    this._sharedService.maxBetMinValue.next({
      'value' : e.target.value
    });
    /*this.memberForm = this._fb.group({
      maxBet: [500000, [(c: AbstractControl) => Validators.required(c), Validators.max(10000000), Validators.min(e.target.value)]],
    });*/
  }

  get f() {
    return this.memberForm.controls;
  }

  onSubmitMemberForm() {

    var currentUserIp:any;
    this._sharedService.currentUserIp.subscribe((data: any) => {
      currentUserIp = data.userIp;
    });
    this.isLoading = true;
    console.log('this.memberForm.value', this.memberForm.value);
    let memberData = {};
    if (!this.editMode) {
      memberData = {
        "displayName": this.memberForm.value['displayName'],
        "username": this.memberForm.value['username'],
        "pwd": this.memberForm.value['password'],
        //"creditLimit": this.memberForm.value['playerMaxCreditLimit'],
        "availableCredit": this.memberForm.value['playerAvailableCredit'],
        "sportsBookRate": this.memberForm.value['sportsBookRate'],
        "liveCasinoRate": this.memberForm.value['liveCasinoRate'],
        "minimumBet": this.memberForm.value['minBet'],
        "maxBet": this.memberForm.value['maxBet'],
        "maxExposure": this.memberForm.value['maxExposure'],
        "gameStatus": this.gamesList,
        "roleId": this.memberForm.value['roleId'],
        "partnerShipPercent": this.memberForm.value['partnerShipPercent'],
        "ip": currentUserIp
      }
    } else {
      memberData = {
        "displayName": this.memberForm.value['displayName'],
        "username": this.memberForm.value['username'],
        //"comments": this.memberForm.value['comments'],
        //"creditLimit": this.memberForm.value['playerMaxCreditLimit'],
        "availableCredit": this.memberForm.value['playerAvailableCredit'],
        "sportsBookRate": this.memberForm.value['sportsBookRate'],
        "liveCasinoRate": this.memberForm.value['liveCasinoRate'],
        "minimumBet": this.memberForm.value['minBet'],
        "maxBet": this.memberForm.value['maxBet'],
        "maxExposure": this.memberForm.value['maxExposure'],
        //"isActive": this.memberForm.value['status'],
        "gameStatus": this.gamesList,
        "roleId": this.memberForm.value['roleId'],
        "partnerShipPercent": this.memberForm.value['partnerShipPercent'],
        "ip": currentUserIp
      }
    }

    let memberObs: Observable<any>;
    let msg = "";
    if (!this.editMode) {
      msg = 'Created';
      memberObs = this._memberService._getCreateNewUserApi(memberData);
    } else {
      msg = 'Updated';
      memberData["userId"] = Number(this.route.snapshot.params['id']);
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
      this._getUplineInfo();
    })
  }

  _getUplineInfo() {
    this._sharedService._getAdminDetailsApi().subscribe(((info: any) => {
      console.log('info.admin',info.admin)
      this.uplineInfo = info.admin;
      this._createMemberForm()
      if (this.route.snapshot.params['id']) {
        this.editMode = true;
        this.editUserId = this.route.snapshot.params['id'];
        this.getMemberInfo();
      }
    }))

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
