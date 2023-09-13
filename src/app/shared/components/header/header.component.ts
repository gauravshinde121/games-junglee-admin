import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit,OnDestroy {

  isLoggedIn:boolean = false;
  isShowRightSideBar:boolean = false;
  searchList:any = [];
  userBalance:any;
  adminDetails:any = null;
  leftMenuOpen:boolean = false;
  isLeftBarDisplay:boolean = false;
  clearInterval;
  subjectSub !:Subscription;

  constructor(
    private _sharedService: SharedService
  ) {
    this.onResize();
   }

  ngOnInit(): void {
    this.isLoggedIn = this._sharedService.isLoggedIn();
    this.getAdminDetails()
    this.refreshAdminDetailsPeriodically();
    this.subjectSub = this._sharedService.callAdminDetails.subscribe((res)=>{
      this.getAdminDetails()
    })
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

  onResize() {
    if (window.innerWidth <= 767) {

    } else {
      this.leftMenuOpen = true;
      this.isLeftBarDisplay = true;
    }
  }

  toggleMenu(){

    this.leftMenuOpen=!this.leftMenuOpen;
    this.isLeftBarDisplay=!this.isLeftBarDisplay;
    this._sharedService.leftMenuStatus.next({
      'leftMenuOpen': this.leftMenuOpen
    });
  }

  // Refresh

  refreshPage(){
    window.location.reload();
  }


  getAdminDetails(){
    this._sharedService._getAdminDetailsApi().subscribe((adminDetails:any)=>{
      if(adminDetails.admin){
        this.adminDetails = adminDetails.admin;
      }
    })
  }



  refreshAdminDetailsPeriodically(){
   this.clearInterval =  setInterval(()=>{
      this.getAdminDetails();
    },30000)
  }

  ngOnDestroy(): void {
    clearInterval(this.clearInterval);
    this.subjectSub.unsubscribe();
  }


}
