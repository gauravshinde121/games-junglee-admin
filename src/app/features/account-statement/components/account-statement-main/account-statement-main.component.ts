import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-account-statement-main',
  templateUrl: './account-statement-main.component.html',
  styleUrls: ['./account-statement-main.component.scss']
})
export class AccountStatementMainComponent implements OnInit {

  isLeftMenuOpen: boolean;

  constructor(
    private _sharedService:SharedService) { }

  ngOnInit(): void {
    this._sharedService.leftMenuStatus.subscribe((res: any) => {
      this.isLeftMenuOpen = res.leftMenuOpen;
    });
  }

}
