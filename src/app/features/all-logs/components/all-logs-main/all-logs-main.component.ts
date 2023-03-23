import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-all-logs-main',
  templateUrl: './all-logs-main.component.html',
  styleUrls: ['./all-logs-main.component.scss']
})
export class AllLogsMainComponent implements OnInit {

  isLeftMenuOpen: boolean;
  mainClass:String = 'col-md-10';
  sideBarClass:String = 'mobile-menu';

  constructor(
    private _sharedService:SharedService
  ) { }

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

}
