import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-book-management-main',
  templateUrl: './book-management-main.component.html',
  styleUrls: ['./book-management-main.component.scss']
})
export class BookManagementMainComponent implements OnInit {

  isLeftMenuOpen: boolean;

  constructor(
    private _sharedService:SharedService) { }

  ngOnInit(): void {
    this._sharedService.leftMenuStatus.subscribe((res: any) => {
      this.isLeftMenuOpen = res.leftMenuOpen;
    });
  }

}
