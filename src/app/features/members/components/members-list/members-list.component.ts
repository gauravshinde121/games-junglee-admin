import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../../../shared/services/shared.service';
import { MembersService } from '../../services/members.service';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit {

  userList:any = [];
  isLoading = false;
  selectedUserForAdjustment:any = [];
  display: string = 'none';
  showMyContainer: boolean = false;

  userId:any;

  liveCasinoRate:any;
  sportsBook:any;
  clubCasino:any;

  eventStatus:any = [];
  gameStatus:any = []


  selectedIndex = -1;
  showContent(evt, index) {
    if(this.selectedIndex == index){
      this.selectedIndex = -1;
    } else {
      this.selectedIndex = index;
      this._sharedService._getSingleUsersApi({"userId":index}).subscribe((users:any)=>{
        console.log(users)
      });
    }
  }

  constructor(
    private _router:Router,
    private _sharedService:SharedService,
    private _memberService:MembersService
  ) { }

  ngOnInit(): void {
    this._preConfig();
  }


  _preConfig(){
    this._getAllUserInfo();
  }


  _getAllUserInfo(){
    this.isLoading = true;
    this._sharedService._getAllUsersApi().subscribe((users:any)=>{
      console.log(users);
      this.isLoading = false;
      this.userList = users.userList;
    })
  }

  getSingleUserInfo(user){
    this.isLoading = true;
    this._sharedService._getSingleUsersApi(user).subscribe((users:any)=>{
      console.log(users);
    });
  }

  checkUserForAdjustment(userId:any){

   if(this.selectedUserForAdjustment.includes(userId)){
    this.selectedUserForAdjustment.splice(this.selectedUserForAdjustment.indexOf(userId), 1);
      return;
   }
   this.selectedUserForAdjustment.push(userId);
  }


  adjustWinnings(){
    console.log(this.selectedUserForAdjustment)
    if(confirm("Do you want bulk transfer ?")){
      this._sharedService._adjustWinningsApi({userList:this.selectedUserForAdjustment}).subscribe((res:any)=>{
      this._sharedService.getToastPopup('Adjusted Successfully', 'User', 'success');
      this._sharedService.sharedSubject.next({
        'updateAdminDetails':true
      });
      this._getAllUserInfo();
    })
    }
  }

  openModal(userId){
    this.userId = userId;
    this.display = 'block';
    this._sharedService._getSingleUsersApi({"userId":userId}).subscribe((users:any)=>{
      console.log(users)
      this.gameStatus = users.gameStatus;
      this.eventStatus = users.eventStatus;
    });
  }

  closeModal(){
    this.display = 'none';
  }

  updateGameControl(status:any,gameId){

    this._memberService._updateGameControlApi({refUserId:this.userId,gameControlId:gameId,isActive:!status}).subscribe((data:any)=>{
      console.log(data)
      console.log('Updated.');
      this.closeModal();
      this._getAllUserInfo();
    });
  }

  updateSportsControl(status:any,eventControlId:any){
    console.log(eventControlId)
    console.log(!status);
    this._memberService._updateSportsControlApi({refUserId:this.userId,eventsControlId:eventControlId,isActive:!status}).subscribe((data:any)=>{
      console.log('Updated.');
      this.closeModal();
      this._getAllUserInfo();
    })
  }

  navigateToDownline(user){
    console.log(user)
    this._router.navigate([`/member/member-details/Player/${user.username}/${user.createdDate}/${user.userId}`])
  }

}
