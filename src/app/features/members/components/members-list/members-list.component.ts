import { Component, OnInit } from '@angular/core';
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

  userId: any;

  liveCasinoRate: any;
  sportsBook: any;
  clubCasino: any;

  eventStatus: any = [];
  gameStatus: any = [];
  roles: any = [];
  selectedRoleId = 7;

  //dtOptions: DataTables.Settings = {};

  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

  selectedIndex = -1;
  showContent(evt, index) {
    if (this.selectedIndex == index) {
      this.selectedIndex = -1;
    } else {
      this.selectedIndex = index;
      this._sharedService
        ._getSingleUsersApi({ userId: index })
        .subscribe((users: any) => {
          console.log(users);
        });
    }
  }

  constructor(
    private _router: Router,
    private _sharedService: SharedService,
    private _memberService: MembersService
  ) {}

  ngOnInit(): void {
    this._preConfig();
  }

  _preConfig() {
    this._getRoles();
    this._getAllUserInfo(this.selectedRoleId);
  }

  fetchListByCategory(category) {
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
      console.log(roles);
      this.roles = roles.data;
    });
  }

  _getAllUserInfo(roleId) {
    this.isLoading = true;
    this.userList = [];

    let body = {
      roleId: roleId,
      pageNo: this.currentPage,
      limit: 50,
      searchName: this.searchTerm,
    };

    this._sharedService._getAllUsersApi(body).subscribe((users: any) => {
      this.isLoading = false;
      console.log(users.memberData.memberList)
      this.userList = users.memberData.memberList;

      this.totalPages = Math.ceil(this.userList.length / this.pageSize);
    });
  }

  next(): void {
    this.currentPage++;
    this._getAllUserInfo(this.selectedRoleId);
  }

  prev(): void {
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
        this.selectedUserForAdjustment.indexOf(userId),
        1
      );
      return;
    }
    this.selectedUserForAdjustment.push(userId);
  }

  adjustWinnings() {
    if (confirm('Do you want bulk transfer ?')) {
      this._sharedService
        ._adjustWinningsApi({ userList: this.selectedUserForAdjustment })
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
        });
    }
  }

  openModal(userId) {
    this.userId = userId;
    this.display = 'block';
    this._sharedService
      ._getSingleUsersApi({ userId: userId })
      .subscribe((users: any) => {
        console.log('USER', users);
        this.gameStatus = users.gameStatus;
        this.eventStatus = users.eventStatus;
        console.log('event', this.gameStatus);
      });
  }

  closeModal() {
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
        console.log(data);
        console.log('Updated.');
        this.closeModal();
        this._getAllUserInfo(this.selectedRoleId);
      });
  }

  updateSportsControl(status: any, eventControlId: any) {
    console.log(eventControlId);
    console.log(!status);
    this._memberService
      ._updateSportsControlApi({
        refUserId: this.userId,
        eventsControlId: eventControlId,
        isActive: !status,
      })
      .subscribe((data: any) => {
        console.log('Updated.');
        this.closeModal();
        this._getAllUserInfo(this.selectedRoleId);
      });
  }

  navigateToDownline(user) {
    console.log(user);
    this._router.navigate([
      `/member/member-details/Player/${user.username}/${user.createdDate}/${user.userId}`,
    ]);
  }
}
