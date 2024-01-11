import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../../../shared/services/shared.service';
import { MembersService } from '../../services/members.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BookManagementService } from 'src/app/features/book-management/services/book-management.service';

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
  totalExposure = 0;
  totalCasino = 0;
  totalGive = 0;
  liveCasinoRate: any;
  sportsBook: any;
  clubCasino: any;
  modalImage:any;

  eventStatus: any = [];
  gameStatus: any = [];
  roles: any = [];
  selectedRoleId = 7;
  resetTimerInterval: any;
  show: boolean = false;
  show1: boolean = false;
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
  roleId: any;
  ladderObj:any = [];

  fileName = 'MemberList.xlsx';

  sortColumn: string = '';
  sortAscending: boolean = true;// 1: ascending, -1: descending
  showModal: boolean;
  clientId: any = environment.clientId;
  description : any = "Weekly settlement";
  exposureData:any = {
    matchName:null,
    fancyMarkets:[],
    matchOddsMarket:[],
    bookmakerMarkets:[]
  };
  exposureDataList:any = [];


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

  getModalImage(clientId){
    this.http.get('https://apisimg.cylsys.com/get-modal/'+clientId, {})
      .subscribe(response => {
        this.modalImage = 'https://apisimg.cylsys.com/'+response[0].image_path;
      }, error => {
        console.error('Error getting modal image:', error);
      });
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
    return
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
      description : new FormControl('Weekly settlement', [(c: AbstractControl) => Validators.required(c)])
    });
  }

  postAdjustWinningsForSingleUser() {
    let body = {
      "userId": this.userId,
      "amount": this.adjustWinningsForSingleUserForm.value.amount,
      "isGiven": this.isGiven,
      "description" : this.adjustWinningsForSingleUserForm.value.description,
      "ipAddress" : this._sharedService.getIpAddress()
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
    private formbuilder: FormBuilder,
    private _bookMgmService:BookManagementService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    const hasSeenModal = localStorage.getItem('hasSeenModal');
    if (!hasSeenModal) {
      this.showModal = true;
    }
    this._preConfig();
    //if (this._sharedService.getUserDetails().roleId.indexOf(1) != -1) {
    if (this._sharedService.getUserDetails().roleId === 1) {
      this.isSuperAdmin = true;
    }
    this.statusList = [
      { id: 1, status: "Active", color: 'green' },
      { id: 2, status: "Inactive", color: 'yellow' },
      { id: 3, status: "Closed", color: 'red' }
    ];
    this.getModalImage(this.clientId);
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

    if (ev.target.checked) {
      this.selectedUserForAdjustment = [];
    }

    this.allChecked = !this.allChecked;

    // this.userList.forEach(x => x.state = ev.target.checked)

    this.userList.forEach(element => {
      if (element.winnings != 0) {
        element.state = ev.target.checked
      }

    });

    for (const user of this.userList) {
      if (user.winnings != 0) {
        this.checkUserId(user.userId);
      }
    }
  }


  openExposureViewModal(userId) {
    this.modalNumber = 5;
    this.userId = userId;
    this.display = 'block';
  }


  getLadderDataByMarket(marketId){
    this.ladderObj = [];
    this._bookMgmService._postLadderMemberListDataByMarketApi({ marketId: marketId , myPt: false,memberId:this.userId}).subscribe((res: any) => {
      this.ladderObj = res?.ladderDetails;
    })
  }


  showExposureDetails(user){
    this.exposureDataList = [];
    if(user.exposure == 0) return

    this._sharedService._getExposureDetailsApi(user.userId).subscribe((data:any)=>{
      // console.log(data)

      if(data){
        for(let d of data.exposureDetails){
          this.exposureDataList.push(
            {
              matchName:d.matchName,
              fancyMarkets:d.data.filter(mrkt=>mrkt.fancyFlag==true),
              matchOddsMarket:d.data.filter(mrkt=>mrkt.matchoddsFlag==true),
              bookmakerMarkets:d.data.filter(mrkt=>mrkt.bookmakerFlag==true)
            }
          )
        }
      }

      this.exposureData = this.exposureDataList;
      // console.log(this.exposureDataList)

      this.openExposureViewModal(user.userId)
    })
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

  isAllUnChecked() {
    return this.userList.map(item => ({
      ...item,
      state: false
    }));
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
    this._sharedService.selectedUserRoleId.next({
      'createUserWithRoleId': roleId
    });
    this.roleId = roleId
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
      this.totalExposure = this.userList.reduce((acc, crnt) => acc + crnt.exposure, 0);
      this.totalCasino = this.userList.reduce((acc, crnt) => acc + crnt.casinoWinnings, 0);
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
    });
  }

  checkUserForAdjustment(userId: any) {

    if (this.selectedUserForAdjustment.includes(userId)) {
      this.selectedUserForAdjustment.splice(
        this.selectedUserForAdjustment.indexOf(userId), 1);
      return;
    }
    this.selectedUserForAdjustment.push(userId);

    this.isAllChecked();
  }


  updateLimit(event) {
    this.limit = parseInt(event.target.value);
    this.pageSize = this.limit;
    this.refreshCall();
  }

  adjustWinnings() {

    var currentUserIp: any;
    this._sharedService.currentUserIp.subscribe((data: any) => {
      currentUserIp = data.userIp;
    });
    //if (confirm('Do you want bulk transfer ?')) {
    this._sharedService
      ._adjustWinningsApi({ userList: this.selectedUserForAdjustment, "ipAddress" : this._sharedService.getIpAddress() , description:this.description })
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
    this._sharedService.getUplineSummaryApi(userId).subscribe((res) => {
      this.memberHierarchy = res;
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
    this.selectedUserForAdjustment = [];
    this._getAllUserInfo(this.selectedRoleId);
    this._sharedService.callAdminDetails.next(true);
    // // this.allChecked = !this.allChecked;
    // // this.allChecked = false;
    // this.isAllUnChecked();
    this.display = 'none';
    this.changePasswordForm.reset();
  }


  closeExposureModal(){
    this.display = 'none';
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


  showDownlineTree(user) {
    if (this.selectedRoleId != 7) {
      this._router.navigate(['/member/downline-list/' + user.userId])
    }
  }


  exportExcel() {
    let memberList: any = []
    let mergedArray = [];

    if (this.selectedRoleId == this.roleId) {
      this.userList.forEach(element =>
        this.roles.forEach(elements => {
          if (this.selectedRoleId === elements.roleId){
        memberList.push({
          Username: element.username,
          RoleName: elements.userRoleName,
          CreditLimit: element.creditLimit,
          NetExposure: element.exposure,
          Take: element.take,
          Give: element.give,
          AvailableCredit: element.availableCredit,
          Status: element.isActive,
        })
        // this.roles.forEach(elements => {
        //   if (this.selectedRoleId === elements.roleId) {
        //     memberList.push({
        //       RoleName: elements.userRoleName
        //     })
        //   }
        // })
      }}));

      this._sharedService.exportExcel(memberList, this.fileName);
    }

    let result = this.userList.map()
  }

  onCloseModal() {
    localStorage.setItem('hasSeenModal', 'true');
    this.showModal = false;
  }

  onModalClick(event: MouseEvent): void {
    event.stopPropagation();
  }

}
