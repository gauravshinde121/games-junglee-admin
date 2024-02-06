import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {  AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { Subscription } from 'rxjs';
import { AllLogsService } from 'src/app/features/all-logs/services/all-logs.service';
import { BookManagementService } from 'src/app/features/book-management/services/book-management.service';
import { MembersService } from 'src/app/features/members/services/members.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss']
})
export class AccountListComponent implements OnInit , OnDestroy {

  userList: any = [];
  isLoading = false;
  selectedUserForAdjustment: any = [];
  display: string = 'none';
  showMyContainer: boolean = false;
  modalNumber: any;
  userDetails: any;
  isGiven: boolean;
  memberHierarchy: any;
  isSuperAdmin: boolean = false;
  limit: number = 100;
  userId: any;
  totalTake = 0;
  totalExposure = 0;
  totalCasino = 0;
  totalGive = 0;
  liveCasinoRate: any;
  sportsBook: any;
  clubCasino: any;
  eventStatus: any = [];
  gameStatus: any = [];
  roles: any = [];
  selectedRoleId = null;
  resetTimerInterval: any;
  show: boolean = false;
  show1: boolean = false;
  //dtOptions: DataTables.Settings = {};
  clTransfers:any = [];

  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 100;
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
  modalImage:any;

  sortColumn: string = '';
  sortAscending: boolean = true;// 1: ascending, -1: descending
  showModal: boolean;
  clientId: any = environment.clientId;
  
  role_id: any;
  admin: any;
  userData: any;
  adminDetails: any;
  
  creditDepositeForm!: FormGroup;
  creditWithdrawForm!: FormGroup;

  winningDepositForm!:FormGroup;
  winningWithdrawalForm!:FormGroup;

  amountSubscription: Subscription  | undefined;

  userIp = "";



  getModalImage(clientId){
    this.http.get('https://apisimg.cylsys.com/get-modal/'+clientId, {})
      .subscribe(response => {
        if(response[0]){
          console.log(response)
          this.modalImage = 'https://apisimg.cylsys.com/'+response[0].image_path;
        }
      }, error => {
        console.error('Error getting modal image:', error);
      });
  }


  createWinningSettlementForm(){
    this.creditWithdrawForm = this.formbuilder.group({
      upline_credit: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      refupline_credit: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      downline_credit: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      refdownline_credit: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      profitLoss: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      ref_profitLoss: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      amount: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      remark: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
    }
    )
  }

  ngOnDestroy() {
    // Unsubscribe from the amount subscription to prevent memory leaks
    if (this.amountSubscription) {
      this.amountSubscription.unsubscribe();
    }
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
    private http: HttpClient,
    private formbuilder: FormBuilder,
    private allLogService:AllLogsService
  ) { }

  ngOnInit(): void {

    this.userIp = this._sharedService.getIpAddress();

    const hasSeenModal = localStorage.getItem('hasSeenModal');
    if (!hasSeenModal) {
      this.showModal = true;
    }
    this._preConfig();
    //if (this._sharedService.getUserDetails().roleId.indexOf(1) != -1) {
    if (this._sharedService.getUserDetails().roleId === 1) {
      this.isSuperAdmin = true;
    }

    this.getAdminDetails();

    this.admin = this._sharedService.getUserDetails();

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

  _preConfig() {
    this.createForms();
    this._getRoles();
    this._getAllUserInfo(this.selectedRoleId);

    this.resetTimerInterval = setInterval(() => {
      this.refreshCall();
    }, 60000)
  }



  createForms(){
    this.creditDepositeForm = this.formbuilder.group({
      upline_credit: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      refupline_credit: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      downline_credit: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      refdownline_credit: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      profitLoss: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      amount: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      remark: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
    })


    this.creditWithdrawForm = this.formbuilder.group({
      upline_credit: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      refupline_credit: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      downline_credit: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      refdownline_credit: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      profitLoss: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      amount: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      remark: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
    }
    )


    this.winningDepositForm = this.formbuilder.group({
      upline_credit: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      refupline_credit: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      downline_credit: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      refdownline_credit: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      profitLoss: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      profitLoss_ref: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      amount: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      remark: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
    }
    )

    this.winningWithdrawalForm = this.formbuilder.group({
      upline_credit: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      refupline_credit: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      downline_credit: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      refdownline_credit: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      profitLoss: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      profitLoss_ref: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      amount: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
      remark: new FormControl(null, [(c: AbstractControl) => Validators.required(c)]),
    }
    )
  }

  // ngOnDestroy(): void {
  //   clearInterval(this.resetTimerInterval)
  // }

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
      this.totalPages = Math.ceil(users.memberData.filteredRecords / this.pageSize);
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




  onCreditDepositOpen(){
    this.creditDepositeForm.patchValue({
      upline_credit : this.adminDetails.availableCredit,
      refupline_credit : this.adminDetails.availableCredit,
      downline_credit : this.userData.availableCredit,
      refdownline_credit : this.userData.availableCredit,
      profitLoss : this.userData.winnings,
      remark:null
    })
  }


  onWinningDepositOpen(){
    this.winningDepositForm.patchValue({
      upline_credit : this.adminDetails.availableCredit,
      refupline_credit : this.adminDetails.availableCredit,
      downline_credit : this.userData.availableCredit,
      refdownline_credit : this.userData.availableCredit,
      profitLoss : this.userData.winnings,
      profitLoss_ref : this.userData.winnings
    })
  }


  onWinningWithdrawalOpen(){
    this.winningWithdrawalForm.patchValue({
      upline_credit : this.adminDetails.availableCredit,
      refupline_credit : this.adminDetails.availableCredit,
      downline_credit : this.userData.availableCredit,
      refdownline_credit : this.userData.availableCredit,
      profitLoss : this.userData.winnings,
      profitLoss_ref : this.userData.winnings,
    })
  }



  onCreditWithdrawalOpen(){
    this.creditWithdrawForm.patchValue({
      upline_credit : this.adminDetails.availableCredit,
      refupline_credit : this.adminDetails.availableCredit,
      downline_credit : this.userData.availableCredit,
      refdownline_credit : this.userData.availableCredit,
      profitLoss : this.userData.winnings
    })
  }


  openCredit(user) {
    this.userData = user;
    this.display = 'block';
    this.modalNumber = 3;
    this.onCreditDepositOpen();
  }


  openDeposit(user) {
    this.modalNumber = 1;
    this.userData = user;
    this.display = 'block';
    this.onWinningDepositOpen();
  }


  openWithdraw(user) {
    this.modalNumber = 2;
    this.userData = user;
    this.display = 'block';
    this.onWinningWithdrawalOpen();
  }



  onAmountChange(event: any) {
    console.log('changes')
    // console.log(event)
    // console.log(this.adminDetails)
    // console.log(this.userData)
    let amount = parseFloat(event?.target.value);
    // Check if the amount is a valid number
    if (!isNaN(amount)) {
      // Perform the necessary calculations to update refupline_credit and refdownline_credit
      const refupline_credit = parseFloat(this.adminDetails.availableCredit) - amount;
      const refdownline_credit = parseFloat(this.userData.availableCredit) + amount;

      // Update the form values
      this.creditDepositeForm.patchValue({
        refupline_credit: refupline_credit,
        refdownline_credit: refdownline_credit,
        amount:amount
      });
    } else {
      // Handle the case when the input value is not a valid number
      // For example, reset the form field or display an error message
      this.creditDepositeForm.patchValue({
        refupline_credit: this.adminDetails.availableCredit,
        refdownline_credit: this.userData.availableCredit,
        amount:null
      });
    }
  }


  onAmountDepositChange(event: any) {
    // console.log(event)
    // console.log(this.adminDetails)
    // console.log(this.userData)
    let amount = parseFloat(event?.target.value);
    // Check if the amount is a valid number
    if (!isNaN(amount)) {
      // Perform the necessary calculations to update refupline_credit and refdownline_credit
      const profitLoss_ref = parseFloat(this.userData.winnings) + amount;

      const refupline_credit = parseFloat(this.adminDetails.availableCredit) - amount;
      const refdownline_credit = parseFloat(this.userData.availableCredit) + amount;

      // Update the form values
      this.winningDepositForm.patchValue({
        refupline_credit:refupline_credit,
        refdownline_credit:refdownline_credit,
        profitLoss_ref: +profitLoss_ref.toFixed(2),
        amount:amount
      });
    } else {
      // Handle the case when the input value is not a valid number
      // For example, reset the form field or display an error message
      this.winningDepositForm.patchValue({
        profitLoss_ref: this.userData.winnings,
        refupline_credit: this.adminDetails.availableCredit,
        refdownline_credit: this.userData.availableCredit,
        amount:null
      });
    }
  }


  onAmountWithdrawalChange(event: any) {
    // console.log(event)
    // console.log(this.adminDetails)
    // console.log(this.userData)
    let amount = parseFloat(event?.target.value);
    // Check if the amount is a valid number
    if (!isNaN(amount)) {
      // Perform the necessary calculations to update refupline_credit and refdownline_credit
      const refupline_credit = parseFloat(this.adminDetails.availableCredit) + amount;
      const refdownline_credit = parseFloat(this.userData.availableCredit) - amount;

      // Update the form values
      this.creditWithdrawForm.patchValue({
        refupline_credit: refupline_credit,
        refdownline_credit: refdownline_credit,
        amount:amount
      });
    } else {
      // Handle the case when the input value is not a valid number
      // For example, reset the form field or display an error message
      this.creditWithdrawForm.patchValue({
        refupline_credit: this.adminDetails.availableCredit,
        refdownline_credit: this.userData.availableCredit,
        amount:null
      });
    }
  }



  onWinningWithdrawalChange(event: any) {
    // console.log(event)
    // console.log(this.adminDetails)
    // console.log(this.userData)
    let amount = parseFloat(event?.target.value);
    // Check if the amount is a valid number
    if (!isNaN(amount)) {
      // Perform the necessary calculations to update refupline_credit and refdownline_credit
      const refupline_credit = parseFloat(this.adminDetails.availableCredit) + amount;
      const refdownline_credit = parseFloat(this.userData.availableCredit) - amount;
      const profitLoss_ref = parseFloat(this.userData.winnings) - amount;


      // Update the form values
      this.winningWithdrawalForm.patchValue({
        profitLoss_ref:profitLoss_ref,
        refupline_credit: refupline_credit,
        refdownline_credit: refdownline_credit,
        amount:amount
      });
    } else {
      // Handle the case when the input value is not a valid number
      // For example, reset the form field or display an error message
      this.winningWithdrawalForm.patchValue({
        profitLoss_ref:this.userData.winnings,
        refupline_credit: this.adminDetails.availableCredit,
        refdownline_credit: this.userData.availableCredit,
        amount:null
      });
    }
  }



  closeModal() {
    this.display = 'none';
    this.modalNumber = null;
    this.resetForms();
  }


  resetForms(){
    this.creditDepositeForm.reset();
    this.creditWithdrawForm.reset();
    this.winningDepositForm.reset();
    this.winningWithdrawalForm.reset();
  }


  onCloseModal() {
    localStorage.setItem('hasSeenModal', 'true');
    this.showModal = false;
  }

  onModalClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  postData(isDeposit){

    let payload = {
      "userId":this.userData.userId,
      "isDeposit":isDeposit,
      "amount":this.creditDepositeForm.value.amount,
      "ip":this.userIp,
      "remark":this.creditDepositeForm.value.remark?this.creditDepositeForm.value.remark:"Credit Transfer"
  }

    this._sharedService._getCreditSettlementApi(payload).subscribe((res)=>{
      this._sharedService.getToastPopup(`Credit Deposit Successfull`, 'Credit', 'success');
      this.closeModal();
      this.getAdminDetails();
      this.refreshCall();
    })
  }


  postWithdrawalData(isDeposit){
      let payload = {
        "userId":this.userData.userId,
        "isDeposit":isDeposit,
        "amount":this.creditWithdrawForm.value.amount,
        "ip":this.userIp,
        "remark":this.creditWithdrawForm.value.remark?this.creditWithdrawForm.value.remark:"Credit Transfer"
    }
  
      this._sharedService._getCreditSettlementApi(payload).subscribe((res)=>{
        this._sharedService.getToastPopup(`Credit withdrawal Successfull`, 'Credit', 'success');
        this.closeModal();
        this.getAdminDetails();
        this.refreshCall();
      })
    }


  postWinningsData(isDeposit){
      let payload = {
        "userId":this.userData.userId,
        "isDeposit":isDeposit,
        "amount":this.winningDepositForm.value.amount,
        "ip":this.userIp,
        "remark":this.winningDepositForm.value.remark?this.winningDepositForm.value.remark:"Deposit"
    }
  
      this._sharedService._getWinningSettlementApi(payload).subscribe((res)=>{
        this.closeModal();
        this._sharedService.getToastPopup(`Deposit Successfull`, 'Deposit', 'success');
        this.getAdminDetails();
        this.refreshCall();
      })
    }


  postWithdrawData(isDeposit){
      let payload = {
        "userId":this.userData.userId,
        "isDeposit":isDeposit,
        "amount":this.winningWithdrawalForm.value.amount,
        "ip":this.userIp,
        "remark":this.winningWithdrawalForm.value.remark?this.winningWithdrawalForm.value.remark:"Withdrawal"
    }
  
    this._sharedService._getWinningSettlementApi(payload).subscribe((res)=>{
      this._sharedService.getToastPopup(`Withdrawal Successfull`, 'Withdrawal', 'success');
      this.closeModal();
      this.getAdminDetails();
      this.refreshCall();
    })
    }

  getAdminDetails(){
    this._sharedService._getAdminDetailsApi().subscribe((adminDetails:any)=>{
      if(adminDetails.admin){
        this.adminDetails = adminDetails.admin;

        console.log(" this.adminDetails", this.adminDetails);


      }
    })

}


onCreditHistoryOpen(){
  this.getClTransfers();
}


getClTransfers(){
  console.log(this.userData)
  this.isLoading = true;
  this.clTransfers = [];

  let fromDate = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
  fromDate.setHours(0)
  fromDate.setMinutes(0);
  fromDate.setSeconds(0);

  let toDate = new Date();
  toDate.setHours(23)
  toDate.setMinutes(59);
  toDate.setSeconds(59);

 
  let body = {
    fromDate: fromDate,
    toDate: toDate,
    memberId: this.userData.userId,
    pageNo: 1,
    limit: 50,
  }
  this.allLogService._getClTransferApi(body).subscribe((data:any)=>{
    this.isLoading = false;
    if(data.clTransferStatement.clTrnsfers){
      this.clTransfers = data.clTransferStatement.clTrnsfers
    }
    this.totalPages = Math.ceil(data.clTransferStatement.totalNoOfRecords / this.pageSize);

    console.log(this.clTransfers)
  })
}
}
