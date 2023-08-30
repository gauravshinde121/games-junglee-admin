import { Component, HostListener, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-settings-main',
  templateUrl: './settings-main.component.html',
  styleUrls: ['./settings-main.component.scss']
})
export class SettingsMainComponent implements OnInit {

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
    private _sharedService:SharedService) {
      this.onResize();
     }

  ngOnInit(): void {
    this._sharedService.leftMenuStatus.subscribe((res: any) => {
      this.isLeftMenuOpen = res.leftMenuOpen;
      console.log(this.sideBarClass);
      if(this.isLeftMenuOpen){
        console.log('1');
        this.sideBarClass = 'mobile-menu';
        this.mainClass = 'col-md-10';
      } else {
        console.log('2');
        this.sideBarClass = '';
        this.mainClass = 'col-md-12';
      }
    });
  }


  toggleMenu(){
    if(this.isMobileView){
      this._sharedService.leftMenuStatus.next({
        'leftMenuOpen': false
      });
    }
   }

}
