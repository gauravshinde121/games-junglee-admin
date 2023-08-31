import { Component, HostListener, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-account-statement-main',
  templateUrl: './account-statement-main.component.html',
  styleUrls: ['./account-statement-main.component.scss']
})
export class AccountStatementMainComponent implements OnInit {

  isLeftMenuOpen: boolean;
  mainClass:String = 'col-md-10';
  sideBarClass:String = 'mobile-menu';
  isMobileView = false;

  
  onResize() {
    if (window.innerWidth <= 767) {
      this.isMobileView = true;
    } else {
      this.isMobileView = false;
    }
  }

  constructor(
    private _sharedService:SharedService
  ) { 
    this.onResize();
  }

  ngOnInit(): void {
    
    this._sharedService.leftMenuStatus.subscribe((res: any) => {
      this.isLeftMenuOpen = res.leftMenuOpen;
      if(this.isLeftMenuOpen){
        this.sideBarClass = 'mobile-menu';
        this.mainClass = 'col-md-10';
      } else {
        this.sideBarClass = '';
        this.mainClass = 'col-md-12';
      }
    });
   }


   toggleMenu(){
    console.log(this.isMobileView)
    if(this.isMobileView){
      this._sharedService.leftMenuStatus.next({
        'leftMenuOpen': false
      });
    }
   }

}
