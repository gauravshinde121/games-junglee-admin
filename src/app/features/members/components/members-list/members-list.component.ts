import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../../../shared/services/shared.service';
import { MembersService } from '../../services/members.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss'],
})
export class MembersListComponent implements OnInit {

 
  userList: any = [];
  isLoading = false;
  selectedUserForAdjustment: any = [];
  display: string = 'none';
  showMyContainer: boolean = false;
  modalNumber: number;
  userDetails: any;
  isGiven: boolean;
  memberHierarchy: any;
  isSuperAdmin: boolean = false;
  limit: number = 25;
  userId: any;
  totalTake = 0;
  totalGive = 0;
  liveCasinoRate: any;
  sportsBook: any;
  clubCasino: any;

  eventStatus: any = [];
  gameStatus: any = [];
  roles: any = [];
  selectedRoleId = 7;
  resetTimerInterval: any;
  show:boolean = false;
  show1:boolean = false;
  //dtOptions: DataTables.Settings = {};

  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 25;
  totalPages: number = 0;

  statusList: any = [];

  changePasswordForm!: FormGroup;
  adjustWinningsForSingleUserForm: FormGroup;
  selectedColor = "";
  disableSubmit = false;
  totalMembers = 0;
  allChecked = false;


  fileName = 'MemberList.xlsx';

  sortColumn: string = '';
  sortAscending: boolean = true;// 1: ascending, -1: descending

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
      this.disableSubmit = true;
      this.closeModal();
    })
  }

  // Validation & Confirm Password

  get passwordValue() {
    return this.changePasswordForm.get('password')
  }

  get confirmPasswordVail() {
    return this.changePasswordForm.get('confirmPassword')
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

  adjustWinningsForSingleUser(user, isGiven) {
    this.userId = user.userId;
    var adjustWinningsForSingleUserValue: number;
    if (isGiven) {
      adjustWinningsForSingleUserValue = user.give;
      this.createAdjustWinningsForSingleUserForm(adjustWinningsForSingleUserValue);
      this.adjustWinningsForSingleUserForm.patchValue({ 'amount': user.give });
    } else {
      adjustWinningsForSingleUserValue = user.take;
      this.createAdjustWinningsForSingleUserForm(adjustWinningsForSingleUserValue);
      this.adjustWinningsForSingleUserForm.patchValue({ 'amount': user.take });
    }
    this.modalNumber = 3;
    this.userDetails = user;
    this.isGiven = isGiven;
    this.display = 'block';
  }

  createAdjustWinningsForSingleUserForm(adjustWinningsForSingleUserValue) {
    this.adjustWinningsForSingleUserForm = this.formbuilder.group({
      amount: new FormControl(null, [(c: AbstractControl) => Validators.required(c), Validators.max(adjustWinningsForSingleUserValue)]),
    });
  }

  postAdjustWinningsForSingleUser() {
    let body = {
      "userId": this.userId,
      "amount": this.adjustWinningsForSingleUserForm.value.amount,
      "isGiven": this.isGiven
    }
   
    this.closeModal();
    this._memberService._adjustWinningsForSingleUserApi(body).subscribe((res: any) => {
      this._sharedService.getToastPopup(res.message, 'Adjust Winnings', 'success');
      this._sharedService.callAdminDetails.next(true);
      this._getAllUserInfo(this.selectedRoleId);
      
    });
  }

  resetForm() {
    this.changePasswordForm.reset();
  }

  selectedIndex = -1;
  showContent(evt, index) {
    if (this.selectedIndex == index) {
      this.selectedIndex = -1;
    } else {
      this.selectedIndex = index;
      this._sharedService
        ._getSingleUsersApi({ userId: index })
        .subscribe((users: any) => {
        });
    }
  }

  constructor(
    private _router: Router,
    private _sharedService: SharedService,
    private _memberService: MembersService,
    private formbuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this._preConfig();
    if(this._sharedService.getUserDetails().roleId.indexOf(1) != -1){
      this.isSuperAdmin = true;
    }
    this.statusList = [
      { id: 1, status: "Active", color: 'green' },
      { id: 2, status: "Inactive", color: 'yellow' },
      { id: 3, status: "Closed", color: 'red' }
    ];
  }

  toggleSort(columnName: string) {
    if (this.sortColumn === columnName) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = columnName;
      this.sortAscending = true;
    }
  }

  checkAll(ev) {

    if(ev.target.checked){
      this.selectedUserForAdjustment = [];
    }
    
    this.allChecked = !this.allChecked;

    // this.userList.forEach(x => x.state = ev.target.checked)

    this.userList.forEach(element => {
      if(element.winnings != 0) {
        element.state = ev.target.checked
      }
      
    });

    for(const user of this.userList){
      if(user.winnings != 0 ) {
        this.checkUserId(user.userId);
      } 
    }
  }

  checkUserId(userId: any) {
    
    if (this.selectedUserForAdjustment.includes(userId)) {
      this.selectedUserForAdjustment.splice(
        this.selectedUserForAdjustment.indexOf(userId),
        1
      );

      return;
    }

      this.selectedUserForAdjustment.push(userId);


  }

  isAllChecked() {
    return this.userList.every(_ => _.state);
  }
  _preConfig() {
    this.createPasswordForm();
    this._getRoles();
    this._getAllUserInfo(this.selectedRoleId);

    this.resetTimerInterval = setInterval(() => {
        this.refreshCall();
    }, 60000)
  }

  ngOnDestroy(): void {
    clearInterval(this.resetTimerInterval)
  }

  fetchListByCategory(category) {
    this.selectedUserForAdjustment = [];
    this.currentPage = 1;
    this.selectedRoleId = category.roleId;
    this._getAllUserInfo(this.selectedRoleId);
  }

  search(): void {
    // implement your search logic here
    // you can filter the data array on the client-side,
    // or send a search term to your server-side API to filter the data
    this._getAllUserInfo(this.selectedRoleId);
  }

  _getRoles() {
    this._memberService._getRolesApi().subscribe((roles: any) => {
      this.roles = roles.data;
    });
  }

  refreshCall() {
    // this.selectedUserForAdjustment = [];
    this._getAllUserInfo(this.selectedRoleId, true);
  }

  _getAllUserInfo(roleId, autoRefresh = false) {
    console.log("called");
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
    };

    this._sharedService._getAllUsersApi(body).subscribe((users: any) => {
      if (!autoRefresh) {
        this.isLoading = false;
      }
      this.userList = users.memberData.memberList;
      console.log(this.userList)
      this.totalTake = this.userList.reduce((acc, crnt) => acc + crnt.take, 0);
      this.totalGive = this.userList.reduce((acc, crnt) => acc + crnt.give, 0);
      this.totalPages = Math.ceil(users.memberData.totalMembers / this.pageSize);
      this.totalMembers = users.memberData.totalMembers;
    });
  }

  next(): void {
    this.selectedUserForAdjustment = [];
    this.currentPage++;
    this._getAllUserInfo(this.selectedRoleId);
  }

  prev(): void {
    this.selectedUserForAdjustment = [];
    this.currentPage--;
    this._getAllUserInfo(this.selectedRoleId);
  }

  getSingleUserInfo(user) {
    this.isLoading = true;
    this._sharedService._getSingleUsersApi(user).subscribe((users: any) => {
      console.log(users);
    });
  }

  checkUserForAdjustment(userId: any) {

    if (this.selectedUserForAdjustment.includes(userId)) {
      this.selectedUserForAdjustment.splice(
        this.selectedUserForAdjustment.indexOf(userId),1);
      return;
    }
    this.selectedUserForAdjustment.push(userId);

    this.isAllChecked();
    // console.log(this.selectedUserForAdjustment.push(userId))
  }


  updateLimit(event){
    this.limit = parseInt(event.target.value);
    this.pageSize = this.limit;
    this.refreshCall();
  }

  adjustWinnings() {
    
    var currentUserIp:any;
    this._sharedService.currentUserIp.subscribe((data: any) => {
      currentUserIp = data.userIp;
    });
    //if (confirm('Do you want bulk transfer ?')) {
    this._sharedService
      ._adjustWinningsApi({ userList: this.selectedUserForAdjustment, 'ip':currentUserIp })
      .subscribe((res: any) => {
        this._sharedService.getToastPopup(
          'Adjusted Successfully',
          'User',
          'success'
        );
        this._sharedService.sharedSubject.next({
          updateAdminDetails: true,
        });
        this.selectedUserForAdjustment = [];
        console.log(this.selectedUserForAdjustment)
        this._getAllUserInfo(this.selectedRoleId);
        this._sharedService.callAdminDetails.next(true);
        this.closeModal();
      });
    //}
  }

  openModal(userId) {
    this.modalNumber = 2;
    this.userId = userId;
    this.display = 'block';
  }

  openHierarchyModal(userId) {
    this._sharedService.getUplineSummaryApi(userId).subscribe((res)=>{
      this.memberHierarchy = res;
      console.log('getUplineSummary', res);
    });
    this.modalNumber = 4;
    this.userId = userId;
    this.display = 'block';
  }

  openBulkTransferModal() {
    this.modalNumber = 1;
    this.display = 'block';
  }

  closeModal() {
    this.display = 'none';
    this.changePasswordForm.reset();
  }

  updateGameControl(status: any, sportsId) {
    this._memberService
      ._updateGameControlApi({
        refUserId: this.userId,
        gameControlId: sportsId,
        isActive: !status,
      })
      .subscribe((data: any) => {
        this.closeModal();
        this._getAllUserInfo(this.selectedRoleId);
      });
  }

  updateSportsControl(status: any, eventControlId: any) {
    this._memberService
      ._updateSportsControlApi({
        refUserId: this.userId,
        eventsControlId: eventControlId,
        isActive: !status,
      })
      .subscribe((data: any) => {
        this.closeModal();
        this._getAllUserInfo(this.selectedRoleId);
      });
  }

  navigateToDownline(user) {
    this._router.navigate([
      `/member/member-details/Player/${user.username}/${user.createdDate}/${user.userId}`,
    ]);
  }

  changeStatus(evt, user) {
    let status = evt.target.value;
    let body = {
      "userId": user.userId,
      "isActive": status
    }

    this._memberService._changeMemberStatusApi(body).subscribe(res => {
      this._sharedService.getToastPopup(res['message'], '', 'success');
    })
  }


  showDownlineTree(user){
    if(this.selectedRoleId != 7){
      this._router.navigate(['/member/downline-list/'+user.userId])
    }
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
    this._sharedService.exportExcel(memberList, this.fileName);
  }
  

}
