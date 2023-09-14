import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-left-navigation',
  templateUrl: './left-navigation.component.html',
  styleUrls: ['./left-navigation.component.scss']
})
export class LeftNavigationComponent implements OnInit {

  mainMenu: any = [];
  viewMoreNavList: any = [];

  isLoggedIn: boolean = false;
  sportsName: string;
  userDetails: any;

  menuList: any;
  tourId: any;
  matchId: any;
  leftMenuOpen: boolean = true;
  adminDetails: any = null;
  currentPath: any = '';
  isMobileView = false;


  onResize() {
    if (window.innerWidth <= 767) {
      this.isMobileView = true;
    } else {
      this.isMobileView = false;
    }
  }

  constructor(
    private _route: ActivatedRoute,
    public _sharedService: SharedService,
    private _router: Router
  ) {
    this.onResize();
  }

  ngOnInit(): void {
    this.checkPath()
    this.isLoggedIn = this._sharedService.isLoggedIn();
    this.userDetails = this._sharedService.getUserDetails();
    this.adminDetails = this.userDetails;
    this._sharedService.sharedSubject.subscribe((data: any) => {
      if (data.adminDetails) {
        this.adminDetails = data.adminDetails
      }
    });

    // this._sharedService.leftMenuStatus.subscribe(status=>{

    //   this.leftMenuOpen = status.leftMenuOpen;
    // })
  }


  onLogout() {
    this._sharedService.removeJWTToken();
    this._sharedService.removeUserDetails();
    localStorage.clear();
    this._router.navigate(['/login']);
  }


  storePath(path: string) {
    localStorage.setItem('path', path)
    this.checkPath();
    this.toggleMenu()
  }


  checkPath() {
    this.currentPath = localStorage.getItem('path');
  }


  toggleMenu() {
    if (this.isMobileView) {
      this.leftMenuOpen = !this.leftMenuOpen;

      // this.isLeftBarDisplay=!this.isLeftBarDisplay;
      this._sharedService.leftMenuStatus.next({
        'leftMenuOpen': this.leftMenuOpen
      });


    }
  }
  // toggleMenu() {

  //   this.leftMenuOpen = !this.leftMenuOpen;
  //   // this.isLeftBarDisplay = !this.isLeftBarDisplay;
  //   this._sharedService.leftMenuStatus.next({
  //     'leftMenuOpen': this.leftMenuOpen
  //   });

  // }

}
