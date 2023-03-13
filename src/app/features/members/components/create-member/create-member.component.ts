import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedService } from '../../../../shared/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MembersService } from '../../services/members.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-create-member',
  templateUrl: './create-member.component.html',
  styleUrls: ['./create-member.component.scss']
})
export class CreateMemberComponent implements OnInit {

  memberForm: FormGroup;
  isLoading = false;
  editMode = false;
  memberData:any;
  editUserId:any;
  gamesList:any = [];
  roles:any = [];

  constructor(
    private _fb: FormBuilder,
    private _sharedService: SharedService,
    private _memberService:MembersService,
    private _router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.snapshot.params['id']? this.getMemberInfo():this.getGames();
    this._preConfig();
  }

  private _preConfig() {
    this._createMemberForm();
    this._getRoles()
  }

  getGames(){
    this._sharedService._getGames().subscribe((res:any)=>{
      if(res){
        this.gamesList = res.gamesList.map(game=>({...game,isActive:true}));
      }
    })
  }

  setGameStatus(status,gameId){
    this.gamesList.find(g=>g.gameId == gameId).isActive = !status
  }


  getMemberInfo() {
    this.editMode = true;
    this._sharedService._getSingleUsersApi({
      "userId": +this.route.snapshot.params['id']
    }).subscribe(((res: any) => {
      console.log(res)
      if (res) {
        this.memberData = res;
        this.gamesList = res.gameStatus;


        this.memberForm.patchValue({
          status:this.memberData.isActive,
          username: this.memberData.username,
          displayName: this.memberData.displayName,
          playerMaxCreditLimit: this.memberData.creditLimit,
          sportsBookRate: this.memberData.sportsBookRate,
          liveCasinoRate: this.memberData.liveCasinoRate,
          minimumBet: this.memberData.minimumBet,
          maxBet: this.memberData.maxBet,
          maxExposure: this.memberData.maxExposure,
          isActive: this.memberData.isActive,
          roleId:this.memberData.roleId
        });
        console.log('this.memberForm',this.memberForm);
        console.log('this.memberForm',this.gamesList);
      }
    }))
  }


_createMemberForm(){
  this.memberForm = this._fb.group({
    username: ['', Validators.required],
    displayName: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
    playerMaxCreditLimit: ['', Validators.required],
    comments: ['', Validators.required],
    sportsBookRate: [1, Validators.required],
    liveCasinoRate: [100, Validators.required],
    minBet: [100, Validators.required],
    maxBet: [1000000, Validators.required],
    maxExposure: [50000000, Validators.required],
    status: ['Active', Validators.required],
    roleId:[7,Validators.required],
    partnerShipPercent:[0,Validators.required]
  })
}


onSubmitMemberForm(){
  this.isLoading = true;

  console.log(this.memberForm.value)

  let memberData = {
    "displayName": this.memberForm.value['displayName'],
    "username": this.memberForm.value['username'],
    "pwd": this.memberForm.value['password'],
    "creditLimit": this.memberForm.value['playerMaxCreditLimit'],
    "sportsBookRate": this.memberForm.value['sportsBookRate'],
    "liveCasinoRate": this.memberForm.value['liveCasinoRate'],
    "minimumBet": this.memberForm.value['minBet'],
    "maxBet": this.memberForm.value['maxBet'],
    "maxExposure": this.memberForm.value['maxExposure'],
    "isActive": this.memberForm.value['status'],
    "gameStatus":this.gamesList,
    "roleId":this.memberForm.value['roleId'],
    "partnerShipPercent":this.memberForm.value['partnerShipPercent']
  }

  console.log(memberData)

  let memberObs:Observable<any>;
  let msg = "";
  if(!this.editMode){
    msg = 'Created';
    memberObs = this._memberService._getCreateNewUserApi(memberData)
  }else{
    msg = 'Updated';
    memberData["userId"] = this.route.snapshot.params['id'];
    memberObs = this._memberService._getEditUserApi(memberData)
  }

  memberObs.subscribe(
    (res: any) => {
      console.log(res)
      this._sharedService.getToastPopup(`User ${msg} Successfully`, 'User', 'success');
      this._router.navigate(['/member/list'])
      this._sharedService.sharedSubject.next({
        'updateAdminDetails':true
      });
    },
    () => this.isLoading = false,
    () => this.isLoading = false
  )

}


_getRoles(){
  this._memberService._getRolesApi().subscribe((roles:any)=>{
    console.log(roles);
    this.roles = roles.data;
  })
}

}
