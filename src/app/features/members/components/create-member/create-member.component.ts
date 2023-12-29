import { Component, OnInit, ElementRef, ViewChild,Renderer2 } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl,ValidatorFn, ValidationErrors } from '@angular/forms';
import { SharedService } from '../../../../shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MembersService } from '../../services/members.service';
import { Observable } from 'rxjs';
import { ConfirmPasswordValidator } from '@shared/classes/validator';
import { max, subscribeOn } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-member',
  templateUrl: './create-member.component.html',
  styleUrls: ['./create-member.component.scss']
})
export class CreateMemberComponent implements OnInit {

  memberForm: FormGroup | null = null;
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
  display:string = 'none';
  uplinePwd:string = '';
  ipAdress:any;
  casinoProviderList: any = [];
  maxLimit:any;

  setAdminCreationLimit:boolean = false;
  setSuperMasterCreationLimit:boolean = false;
  setMasterCreationLimit:boolean = false;
  setAgentCreationLimit:boolean = false;
  setDealerCreationLimit:boolean = false;
  setUserCreationLimit:boolean = false;
  private playerAvailableCreditSubscription: Subscription | undefined;
  selectedUserRole:string = '';

  @ViewChild('confirm_password') confirm_password: ElementRef;
  constructor(
    private _fb: FormBuilder,
    private _sharedService: SharedService,
    private _memberService: MembersService,
    private _router: Router,
    private route: ActivatedRoute,
    private renderer: Renderer2
  ) { }

  async ngOnInit(): Promise<void> {
    this._sharedService.selectedUserRoleId.subscribe((res: any) => {
      this.createUserWithRoleId = res['createUserWithRoleId'];
    });

    this._sharedService.maxBetMinValue.subscribe((res: any) => {
      this.maxBetMinValue = res['value'];
    });
    this._preConfig();

    if (this.route.snapshot.params['id']) {
      this.editMode = true;
      this.editUserId = this.route.snapshot.params['id'];
    }

    this._getCasinoProvider();

  }

  onSubmitMemberForm() {
    this.display = 'block';
    setTimeout(()=>{
      this.confirm_password.nativeElement.focus();
    },500)
  }

  ngAfterViewInit() {
    //this.renderer.selectRootElement(this.confirmPassword.nativeElement).focus();
  }

  closeModal() {
    this.uplinePwd = "";
    this.display = 'none';
  }

  private _preConfig() {
    this.getGames();
    this._getRoles();
    this.getUserIp();
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
    if(sportsId == 4){
      if(status == true){
        this.casinoProviderList = [];
      } else {
        this._getCasinoProvider();
      }
    }
    this.gamesList.find(g => g.gameId == sportsId).isActive = !status;
    if (this.memberForm) {
      this.memberForm.markAsDirty();
    }
  }

  setCasinoStatus(status, providerId) {
    this.casinoProviderList.find(g => g.providerId == providerId).isActive = !status;
    if (this.memberForm) {
      this.memberForm.markAsDirty();
    }
  }


  async getMemberInfo() {
    this._sharedService._getSingleUsersApi({
      "userId": +this.route.snapshot.params['id']
    }).subscribe(((res: any) => {
      if (res) {
        this.memberData = res.user;
        this.gamesList = res.gameStatus;

        res.providerStatus.forEach(status => {

          this.casinoProviderList.forEach(cpl => {
            if(status.casinoProviderId == cpl.providerId) {
              cpl.isActive = status.isActive;
            }
          });
        });


        this.roleId = this.memberData.roleId;
        if (this.memberForm) {
          this.memberForm.patchValue({
            username: this.memberData.username,
            displayName: this.memberData.displayName,
            playerMaxCreditLimit: this.memberData.availableCredit,
            playerAvailableCredit: this.memberData.availableCredit,
            sportsBookRate: this.memberData.sportsBookRate,
            liveCasinoRate: this.memberData.liveCasinoRate,
            minBet: 100,
            maxBet: 100000,
            partnerShipPercent: this.memberData.partnerShipPercent,
            roleId: this.memberData.roleId,
            adminCreationLimit: this.memberData.adminCreationLimit,
            superMasterCreationLimit: this.memberData.superMasterCreationLimit,
            masterCreationLimit: this.memberData.masterCreationLimit,
            agentCreationLimit: this.memberData.agentCreationLimit,
            dealerCreationLimit: this.memberData.dealerCreationLimit,
            userCreationLimit: this.memberData.userCreationLimit,
          });
        }
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
    if(this.createUserWithRoleId == 2){
      this.maxLimit = this.uplineInfo.adminCreationLimit;
    } else if(this.createUserWithRoleId == 3){
      this.maxLimit = this.uplineInfo.superMasterCreationLimit;
    } else if(this.createUserWithRoleId == 4){
      this.maxLimit = this.uplineInfo.masterCreationLimit;
    } else if(this.createUserWithRoleId == 5){
      this.maxLimit = this.uplineInfo.agentCreationLimit;
    } else if(this.createUserWithRoleId == 6){
      this.maxLimit = this.uplineInfo.dealerCreationLimit;
    } else if(this.createUserWithRoleId == 7){
      this.maxLimit = this.uplineInfo.userCreationLimit;
    }
    if (!this.editMode) {
      this.memberForm = this._fb.group({
        username: ['', Validators.required],
        displayName: ['', Validators.required],
        password: new FormControl(null, [(c: AbstractControl) => Validators.required(c), Validators.pattern(
          "^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
        )]),
        confirmPassword: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
        playerMaxCreditLimit: [''],
        playerAvailableCredit: ['', [(c: AbstractControl) => Validators.required(c), Validators.min(0), this.playerAvailableCreditValidator(this.maxLimit)]],
        sportsBookRate: [1, [(c: AbstractControl) => Validators.required(c), Validators.max(100), Validators.min(1)]],
        liveCasinoRate: [1, [(c: AbstractControl) => Validators.required(c), Validators.max(100), Validators.min(1)]],
        minBet: [100, [(c: AbstractControl) => Validators.required(c), Validators.min(100)]],
        maxBet: [500000, [(c: AbstractControl) => Validators.required(c), Validators.max(10000000), Validators.min(this.maxBetMinValue)]],
        roleId: [this.createUserWithRoleId, Validators.required],
        partnerShipPercent: [this.uplineInfo.partnerShipPercent, [(c: AbstractControl) => Validators.required(c), Validators.max(100), Validators.min(this.uplineInfo.partnerShipPercent)]],
        adminCreationLimit: [0, [(c: AbstractControl) => Validators.required(c)]],
        superMasterCreationLimit: [0, [(c: AbstractControl) => Validators.required(c), this.superMasterCreationLimitValidator]],
        masterCreationLimit: [0, [(c: AbstractControl) => Validators.required(c), this.masterCreationLimitValidator]],
        agentCreationLimit: [0, [(c: AbstractControl) => Validators.required(c), this.agentCreationLimitValidator]],
        dealerCreationLimit: [0, [(c: AbstractControl) => Validators.required(c), this.dealerCreationLimitValidator]],
        userCreationLimit: [0, [(c: AbstractControl) => Validators.required(c), this.userCreationLimitValidator]]
      },
        {
          // validators: this.Mustmatch('password', 'confirmPassword'),
          validators: ConfirmPasswordValidator('password', 'confirmPassword')
        })
    } else {
      this.memberForm = this._fb.group({
        displayName: [''],
        username: [''],
        playerMaxCreditLimit: [''],
        playerAvailableCredit: ['', [(c: AbstractControl) => Validators.required(c), Validators.min(0), this.playerAvailableCreditValidator(this.maxLimit)]],
        sportsBookRate: [1, [(c: AbstractControl) => Validators.required(c), Validators.max(100), Validators.min(1)]],
        roleId: ['', Validators.required],
        liveCasinoRate: [1, [(c: AbstractControl) => Validators.required(c), Validators.max(100), Validators.min(1)]],
        minBet: [100, [(c: AbstractControl) => Validators.required(c), Validators.min(100)]],
        maxBet: [500000, [(c: AbstractControl) => Validators.required(c), Validators.max(10000000), Validators.min(1)]],
        partnerShipPercent: [0, [(c: AbstractControl) => Validators.required(c), Validators.max(100), Validators.min(this.uplineInfo.partnerShipPercent)]],
        adminCreationLimit: [0, [(c: AbstractControl) => Validators.required(c)]],
        superMasterCreationLimit: [0, [(c: AbstractControl) => Validators.required(c), this.superMasterCreationLimitValidator]],
        masterCreationLimit: [0, [(c: AbstractControl) => Validators.required(c), this.masterCreationLimitValidator]],
        agentCreationLimit: [0, [(c: AbstractControl) => Validators.required(c), this.agentCreationLimitValidator]],
        dealerCreationLimit: [0, [(c: AbstractControl) => Validators.required(c), this.dealerCreationLimitValidator]],
        userCreationLimit: [0, [(c: AbstractControl) => Validators.required(c), this.userCreationLimitValidator]]
      },
        {
          validators: []
        })
    }
  }

  createMember(){
    if (this.memberForm) {
      this.isLoading = true;
      let memberData = {};
      if (!this.editMode) {
        memberData = {
          "displayName": this.memberForm.value['displayName'],
          "username": this.memberForm.value['username'],
          "pwd": this.memberForm.value['password'],
          "availableCredit": this.memberForm.value['playerAvailableCredit'],
          "sportsBookRate": this.memberForm.value['sportsBookRate'],
          "liveCasinoRate": this.memberForm.value['liveCasinoRate'],
          "minimumBet": this.memberForm.value['minBet'],
          "maxBet": this.memberForm.value['maxBet'],
          "gameStatus": this.gamesList,
          "roleId": this.memberForm.value['roleId'],
          "partnerShipPercent": this.memberForm.value['partnerShipPercent'],
          "ip": this._sharedService.getIpAddress(),
          "uplinePwd": this.uplinePwd,
          "casinoControl":  this.casinoProviderList,
          "adminCreationLimit": this.memberForm.value['adminCreationLimit'],
          "superMasterCreationLimit": this.memberForm.value['superMasterCreationLimit'],
          "masterCreationLimit": this.memberForm.value['masterCreationLimit'],
          "agentCreationLimit": this.memberForm.value['agentCreationLimit'],
          "dealerCreationLimit": this.memberForm.value['dealerCreationLimit'],
          "userCreationLimit": this.memberForm.value['userCreationLimit']
        }
      } else {
        memberData = {
          "displayName": this.memberForm.value['displayName'],
          "username": this.memberForm.value['username'],
          "availableCredit": this.memberForm.value['playerAvailableCredit'],
          "sportsBookRate": this.memberForm.value['sportsBookRate'],
          "liveCasinoRate": this.memberForm.value['liveCasinoRate'],
          "minimumBet": 100,
          "maxBet": 100000,
          "gameStatus": this.gamesList,
          "roleId": this.memberForm.value['roleId'],
          "partnerShipPercent": this.memberForm.value['partnerShipPercent'],
          "ip": this._sharedService.getIpAddress(),
          "uplinePwd": this.uplinePwd,
          "casinoControl":  this.casinoProviderList,
          "adminCreationLimit": this.memberForm.value['adminCreationLimit'],
          "superMasterCreationLimit": this.memberForm.value['superMasterCreationLimit'],
          "masterCreationLimit": this.memberForm.value['masterCreationLimit'],
          "agentCreationLimit": this.memberForm.value['agentCreationLimit'],
          "dealerCreationLimit": this.memberForm.value['dealerCreationLimit'],
          "userCreationLimit": this.memberForm.value['userCreationLimit']
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
      }

      this.closeModal();
      memberObs.subscribe(
        (res: any) => {
          this._sharedService.getToastPopup(`User ${msg} Successfully`, 'Member', 'success');
          this._router.navigate(['/member/list'])
          this._sharedService.callAdminDetails.next();
        }, (error) => {
          this.isLoading = false;
          this._sharedService.getToastPopup(`Error while creating the member.`, 'Member', 'error');
        }
      )
    }
  }

  onMinBetChange(e){
    this._sharedService.maxBetMinValue.next({
      'value' : e.target.value
    });
  }

  get f() {
    return this.memberForm?.controls;
  }

  onRoleChange(e){
    this.setCreationLimit(e.target.value);
    this.selectedUserRole = this.roles.find(role => role.roleId === Number(e.target.value)).userRoleName;
    if(e.target.value == 2){
      this.maxLimit = this.uplineInfo.adminCreationLimit;
    } else if(e.target.value == 3){
      this.maxLimit = this.uplineInfo.superMasterCreationLimit;
    } else if(e.target.value == 4){
      this.maxLimit = this.uplineInfo.masterCreationLimit;
    } else if(e.target.value == 5){
      this.maxLimit = this.uplineInfo.agentCreationLimit;
    } else if(e.target.value == 6){
      this.maxLimit = this.uplineInfo.dealerCreationLimit;
    } else if(e.target.value == 7){
      this.maxLimit = this.uplineInfo.userCreationLimit;
    }
    if (this.memberForm) {
      this.memberForm?.get('playerAvailableCredit')?.setValidators([
        Validators.required,
        Validators.min(0),
        this.playerAvailableCreditValidator(this.maxLimit)
      ]);
      this.memberForm?.get('playerAvailableCredit')?.updateValueAndValidity();
    }
  }

  playerAvailableCreditValidator(maxLimit: number): ValidatorFn {
    console.log('playerAvailableCreditValidator called');
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      this.memberForm?.get('superMasterCreationLimit')?.setValue(value);
      this.memberForm?.get('masterCreationLimit')?.setValue(value);
      this.memberForm?.get('agentCreationLimit')?.setValue(value);
      this.memberForm?.get('dealerCreationLimit')?.setValue(value);
      this.memberForm?.get('userCreationLimit')?.setValue(value/10);
      if (value !== null && (isNaN(value) || value < 0 || value > maxLimit)) {
        return { 'creditLimit': true };
      }
      return null;
    };
  }

  superMasterCreationLimitValidator(control: AbstractControl): ValidationErrors | null {
    const playerAvailableCreditVal = control.parent?.get('playerAvailableCredit')?.value;
    if (playerAvailableCreditVal && control.value > playerAvailableCreditVal) {
      return { superMasterCreationLimit: true, message: 'Admin Creation Limit exceeded' };
    }
    return null;
  }

  masterCreationLimitValidator(control: AbstractControl): ValidationErrors | null {
    const playerAvailableCreditVal = control.parent?.get('playerAvailableCredit')?.value;
    if (playerAvailableCreditVal && control.value > playerAvailableCreditVal) {
      return { masterCreationLimit: true, message: 'Admin Creation Limit exceeded' };
    }
    return null;
  }


  agentCreationLimitValidator(control: AbstractControl): ValidationErrors | null {
    const playerAvailableCreditVal = control.parent?.get('playerAvailableCredit')?.value;
    if (playerAvailableCreditVal && control.value > playerAvailableCreditVal) {
      return { agentCreationLimit: true, message: 'Admin Creation Limit exceeded' };
    }
    return null;
  }

  dealerCreationLimitValidator(control: AbstractControl): ValidationErrors | null {
    const playerAvailableCreditVal = control.parent?.get('playerAvailableCredit')?.value;
    if (playerAvailableCreditVal && control.value > playerAvailableCreditVal) {
      return { dealerCreationLimit: true, message: 'Admin Creation Limit exceeded' };
    }
    return null;
  }

  userCreationLimitValidator(control: AbstractControl): ValidationErrors | null {
    const playerAvailableCreditVal = control.parent?.get('playerAvailableCredit')?.value;
    if (playerAvailableCreditVal && control.value > playerAvailableCreditVal) {
      return { userCreationLimit: true, message: 'Admin Creation Limit exceeded' };
    }
    return null;
  }

  _getRoles() {
    this._memberService._getRolesApi().subscribe((roles: any) => {
      this.roles = roles.data;
      this.setCreationLimit(this.createUserWithRoleId);
      this.selectedUserRole = this.roles.find(role => role.roleId === this.createUserWithRoleId).userRoleName;
      this._getUplineInfo();
    })
  }

  setCreationLimit(selectedRole){
    this.setAdminCreationLimit = false;
    this.setSuperMasterCreationLimit = [2].includes(Number(selectedRole));
    this.setMasterCreationLimit = [2,3].includes(Number(selectedRole));
    this.setAgentCreationLimit = [2,3,4].includes(Number(selectedRole));
    this.setDealerCreationLimit = [2,3,4,5].includes(Number(selectedRole));
    this.setUserCreationLimit = [2,3,4,5,6].includes(Number(selectedRole));
  }

  _getCasinoProvider() {
    this._memberService._getCasinoProviderApi().subscribe((res: any) => {
      if (res.providerList) {
        this.casinoProviderList = res.providerList.map(providerId => ({ ...providerId,casinoProviderId : providerId.providerId ,isActive: true }));
      }
    })
  }

  _getUplineInfo() {
    this._sharedService._getAdminDetailsApi().subscribe(((info: any) => {
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
    return this.memberForm?.get('password')
  }

  get confirmPasswordVail() {
    return this.memberForm?.get('confirmPassword')
  }

  get usernameVail() {
    return this.memberForm?.get('username')
  }

  get displaynameVail() {
    return this.memberForm?.get('displayName')
  }

  getUserIp(){
    this.ipAdress = '127.0.0.1';
    /*this._sharedService.getIPApi().subscribe((data: any) => {
      this.ipAdress = data.ip;
    })*/
  }

  ngOnDestroy() {
    this.playerAvailableCreditSubscription?.unsubscribe();
  }

}
