import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLoggedIn:boolean = false;
  isShowRightSideBar:boolean = false;
  searchList:any = [];
  userBalance:any;
  adminDetails:any = null;

  constructor(
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this._sharedService.isLoggedIn();
    this._sharedService.sharedSubject.subscribe((res:any)=>{
      if(res.updateAdminDetails){
        this.getAdminDetails()
      }
    })
    this.getAdminDetails();
  }

  getRightSidebarEvent(eventObj){
    this.isShowRightSideBar = !eventObj['isClose'];
  }

  onClickAvailableCredit(){
    this.isShowRightSideBar=!this.isShowRightSideBar;
    this._sharedService.sharedSubject.next({
      'isShowRightSideBar':this.isShowRightSideBar
    });
  }

  // Refresh

  refreshPage(){
    window.location.reload();
  }


  getAdminDetails(){
    this._sharedService._getAdminDetailsApi().subscribe((adminDetails:any)=>{
      console.log(adminDetails)
      if(adminDetails.admin){
        this.adminDetails = adminDetails.admin;
        this._sharedService.sharedSubject.next({
          "adminDetails":this.adminDetails
        })
      }
    })
  }

}
