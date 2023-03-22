import { Component, OnInit } from '@angular/core';
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

  adminDetails: any = null;

  constructor(
    private _route: ActivatedRoute,
    public _sharedService: SharedService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this._sharedService.isLoggedIn();
    this.userDetails = this._sharedService.getUserDetails();
    this._sharedService.sharedSubject.subscribe((data: any) => {
      if (data.adminDetails) {
        this.adminDetails = data.adminDetails
      }
    });
  }


  onLogout() {
    this._sharedService.removeJWTToken();
    this._sharedService.removeUserDetails();
    this._router.navigate(['/login']);
  }

}
