import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { MembersService } from '../../services/members.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-downline-list',
  templateUrl: './downline-list.component.html',
  styleUrls: ['./downline-list.component.scss']
})
export class DownlineListComponent implements OnInit {

  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 0;
  uplineUserId = null;
  userList: any = [];
  roles:any = [];
  selectedRoleId = 7;
  isLoading = false;
  limit: number = 50;
  sizes: any;
  modalNumber: number;
  userId: any;
  display: string = 'none';
  changePasswordForm!: FormGroup;
  show:boolean = false;
  show1:boolean = false;
  currentUserName = "";
  disableSubmit = false;
  currentUser:any=null;
  adminUser:any = null;
  userIp: any;

  statusList = [
    { id: 1, status: "Active", color: 'green' },
    { id: 2, status: "Inactive", color: 'yellow' },
    { id: 3, status: "Closed", color: 'red' }
  ];


  createPasswordForm() {
    this.changePasswordForm = this.formbuilder.group({
      password: new FormControl(null, [(c: AbstractControl) => Validators.required(c), Validators.pattern(
        "^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$"
      )]),
      confirmPassword: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
    },
      {
        validators: this.Mustmatch('password', 'confirmPassword')
      }
    )
  }

  get f() {
    return this.changePasswordForm.controls;
  }

  get passwordValue() {
    return this.changePasswordForm.get('password')
  }

  get confirmPasswordVail() {
    return this.changePasswordForm.get('confirmPassword')
  }

  constructor(private _router: Router,
    private _memberService: MembersService,
    private formbuilder: FormBuilder,
    private route:ActivatedRoute,
    private _sharedService: SharedService,
    ) {
      this._router.routeReuseStrategy.shouldReuseRoute = function() {
        return false;
    };
    }

  ngOnInit(): void {
    this.route.params.subscribe(param=>{
      this.uplineUserId =  param['id'];

    })
    this.userIp = this._sharedService.getIpAddress();
    this._preConfig();
    this.adminUser = this._sharedService.getUserDetails();
  }


  _preConfig() {
    this.getSingleUserInfo(this.uplineUserId)
    this.createPasswordForm();

    this._getAllUserInfo(this.selectedRoleId);
  }


  _getRoles() {
    this._memberService._getRolesApi().subscribe((roles: any) => {
      if(roles){
        this.roles = roles.data.filter(r=>r.roleId!=this.currentUser.roleId)
      }
    });
  }


  search(): void {
    this._getAllUserInfo(this.selectedRoleId);
  }


  fetchListByCategory(category) {
    this.selectedRoleId = category.roleId;
    this._getAllUserInfo(this.selectedRoleId);
  }


  _getAllUserInfo(roleId, autoRefresh = false) {
    this._sharedService.selectedUserRoleId.next({
      'createUserWithRoleId': roleId
    });
    if (!autoRefresh) {
      this.isLoading = true;
      this.userList = [];
    }
    let body = {
      roleId: roleId,
      pageNo: this.currentPage,
      limit: this.limit,
      searchName: this.searchTerm,
      uplineId:this.uplineUserId
    };

    this._sharedService.getUserByUplineIdApi(body).subscribe((users: any) => {
      if (!autoRefresh) {
        this.isLoading = false;
      }
      this.userList = users.memberData.memberList;
      this.sizes = this.userList;
      this.totalPages = Math.ceil(this.userList.length / this.pageSize);
    });
  }


  getSingleUserInfo(userId) {
    this.isLoading = true;
    this._sharedService._getSingleUsersApi({userId}).subscribe((users: any) => {
      if(users){
        if(users.user){
          this.currentUserName = users.user.username;
          this.currentUser = users.user
          this._getRoles();
        }
      }
    });
  }



  exportExcel() {
    let memberList: any = []
    this.userList.forEach(element => {
      memberList.push({

        Username: element.username,
        CreditLimit: element.creditLimit,
        NetExposure: element.exposure,
        Take: element.take,
        Give: element.give,
        AvailableCredit: element.availableCredit,
        Status: element.isActive,
      })
    });
    this._sharedService.exportExcel(memberList, 'MemberList.xlsx'+new Date().toString());
  }

  showDownlineTree(user){
    if(this.selectedRoleId != 7){
      this._router.navigate(['/member/downline-list/'+user.userId])
    }
  }

  openModal(userId) {
    this.modalNumber = 2;
    this.userId = userId;
    this.display = 'block';
  }


  changeStatus(evt, user) {
    let status = evt.target.value;
    let body = {
      "userId": user.userId,
      "isActive": status,
      "ipAddress" : this.userIp
    }

    this._memberService._changeMemberStatusApi(body).subscribe(res => {
      this._sharedService.getToastPopup(res['message'], '', 'success');
    })
  }


  next(): void {
    this.currentPage++;
    this._getAllUserInfo(this.selectedRoleId);
  }

  prev(): void {
    this.currentPage--;
    this._getAllUserInfo(this.selectedRoleId);
  }


  closeModal() {
    this.display = 'none';
    this.changePasswordForm.reset();
  }


  Mustmatch(password: any, confirmPassword: any) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordcontrol = formGroup.controls[confirmPassword];

      if (confirmPasswordcontrol.errors && !confirmPasswordcontrol.errors['Mustmatch']) {
        return;
      }
      if (passwordControl.value !== confirmPasswordcontrol.value) {
        confirmPasswordcontrol.setErrors({ Mustmatch: true });
      }
      else {
        confirmPasswordcontrol.setErrors(null);
      }
    }
  };


  postChangePassword() {
    this.disableSubmit = true;
    if (this.changePasswordForm.value.password == "") {
      this._sharedService.getToastPopup("Enter password", 'Password', 'error');
      return;
    }
    else if (this.changePasswordForm.value.confirmPassword == "") {
      this._sharedService.getToastPopup("Enter confirm password", 'Password', 'error');
      return;
    }

    let body = {
      "userId": this.userId,
      "password": this.changePasswordForm.value.password
    }


    this._memberService._changeMemberPasswordApi(body).subscribe((res: any) => {
      this._sharedService.getToastPopup(res.message, 'Password', 'success');
      this.disableSubmit = false;
      this.closeModal();
    })
  }


  resetForm() {
    this.changePasswordForm.reset();
  }

}
