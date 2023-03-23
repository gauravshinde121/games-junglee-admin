import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-google-authentication',
  templateUrl: './google-authentication.component.html',
  styleUrls: ['./google-authentication.component.scss']
})
export class GoogleAuthenticationComponent implements OnInit {

  isLeftMenuOpen: boolean;
  mainClass:String = 'col-md-10';

  constructor(
    private _sharedService:SharedService
  ) { }

  ngOnInit(): void {
    this._sharedService.leftMenuStatus.subscribe((res: any) => {
      this.isLeftMenuOpen = res.leftMenuOpen;
      if(this.isLeftMenuOpen){
        this.mainClass = 'col-md-10';
      } else {
        this.mainClass = 'col-md-12';
      }
    });
   }

}
