import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { AccountStatementService } from '../../services/account-statement.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-all-bets',
  templateUrl: './all-bets.component.html',
  styleUrls: ['./all-bets.component.scss']
})
export class AllBetsComponent implements OnInit {

  filterForm: FormGroup;
  isLoading: boolean = false;
  betList: any = [];

  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 0;
  limit: number = 50;
  searchText:any = null;

  constructor(
    private _accountStatementService : AccountStatementService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._preConfig();
  }

  _preConfig(){
    this.__initForm();
    this.getMemberBets();
  }

  __initForm() {
    this.filterForm = new FormGroup({
      searchText: new FormControl(null)
    })
  }

  next(): void {
    this.currentPage++;
    this.getMemberBets();
  }

  prev(): void {
    this.currentPage--;
    this.getMemberBets();
  }

  getMemberBets() {
    var body = {
      "matchId":this.route.snapshot.params['matchId'],
      "limit":50,
      "pageNo":1,
      "searchText":this.searchText
     };
    this._accountStatementService._getUserBetsForAdminMyPLApi(body).subscribe((res)=>{

    });
  }

}
