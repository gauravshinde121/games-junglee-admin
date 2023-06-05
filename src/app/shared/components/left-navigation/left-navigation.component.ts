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
  currentPath:any = '';

  constructor(
    private _route: ActivatedRoute,
    public _sharedService: SharedService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.checkPath()
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
    localStorage.clear();
    this._router.navigate(['/login']);
  }


  storePath(path:string){
    console.log('path',path)
    localStorage.setItem('path',path)
    this.checkPath();
  }


  checkPath(){
    this.currentPath = localStorage.getItem('path');
    console.log("this.currentPath")
    console.log(this.currentPath)
    console.log(typeof(this.currentPath))
  }

}
