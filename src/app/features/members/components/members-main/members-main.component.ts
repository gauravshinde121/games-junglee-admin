import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-members-main',
  templateUrl: './members-main.component.html',
  styleUrls: ['./members-main.component.scss']
})
export class MembersMainComponent implements OnInit {

  isLeftMenuOpen: boolean;

  constructor(
    private _sharedService:SharedService
  ) { }

  ngOnInit(): void {
    this._sharedService.leftMenuStatus.subscribe((res: any) => {
      console.log('ice.sharedSubject.subs', res);
      this.isLeftMenuOpen = res.leftMenuOpen;
    });
   }

}
