import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccountStatementService } from '../../services/account-statement.service';
import { SharedService } from '@shared/services/shared.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-my-pl',
  templateUrl: './my-pl.component.html',
  styleUrls: ['./my-pl.component.scss']
})
export class MyPlComponent implements OnInit {

  filterForm: FormGroup;
  plStatement: any = [];
  games: any;
  matchList: any = [];
  marketTypeList: any = [];
  dateFormat = "yyyy-MM-dd";
  language = "en";

  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 0;
  isLoading = false;
  marketList: any;
  //currentTotalPage:any;

  fileName= 'P/L Statement.xlsx';


  constructor(
    private _accountStatementService: AccountStatementService,
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this._preconfig();
    this.filterForm.get('sportsId')?.valueChanges.subscribe((selectedValue) => {
      this._getMatchBySportId(selectedValue);
    });
    this.filterForm.get('matchId')?.valueChanges.subscribe((selectedValue) => {
      this._getMarketByMatchId(selectedValue);
    });
  }

  _preconfig() {
    /*this._sharedService._getGames().subscribe((res:any)=>{
      this.games = res.gamesList;
    });*/
    this._getGames();
    this.__initForm();
    this.getPlStatement();
    this._getAllMarketTypeList();
  }

  __initForm() {
    this.filterForm = new FormGroup({
      fromDate: new FormControl(this.formatFormDate(new Date())),
      toDate: new FormControl(this.formatFormDate(new Date())),
      sportsId: new FormControl(null),
      matchId: new FormControl(null),
      marketId: new FormControl(null)
    })
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat, this.language);
  }

  getPlStatement() {
    this.isLoading = true;
    this.plStatement = [];
    let fromDate = new Date(this.filterForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.filterForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    if(this.filterForm.value.sportsId == 'null'){
      this.filterForm.patchValue( {'sportsId':null} );
    }
    if(this.filterForm.value.matchId == 'null'){
      this.filterForm.patchValue( {'matchId':null} );
    }
    if(this.filterForm.value.marketId == 'null'){
      this.filterForm.patchValue( {'marketId':null} );
    }
    let body = {
      fromDate: fromDate,
      toDate: toDate,
      sportId: this.filterForm.value.sportsId,
      matchId: this.filterForm.value.matchId,
      marketId: this.filterForm.value.marketId,
      pageNo: this.currentPage,
      limit: 50,
    };
    this._accountStatementService._getPlBySubgameAPi(body).subscribe((res: any) => {
      this.isLoading = false;
      if (res.admin.finalResult.length > 0) {
        this.plStatement = res.admin.finalResult;
        console.log('this.plStatement.length', this.plStatement.length);
        console.log('this.pageSize', this.pageSize);
        this.totalPages = Math.ceil(res.admin.totalNoOfRecords / this.pageSize);
      }
      //this.currentTotalPage = Math.ceil(this.currentPage  / this.totalPages);
    });
  }

  _getAllMarketTypeList() {
    this._sharedService.getAllMarketTypeList().subscribe((data: any) => {
      if (data.data) {
        this.marketTypeList = data.data;
      }
    });
  }

  _getMarketByMatchId(sportId) {
    this._sharedService.getMarketsByMatchId(sportId).subscribe((data: any) => {
      if (data.marketList) {
        this.marketList = data.marketList;
      }
    });
  }

  _getGames() {
    this._sharedService._getSports().subscribe((data: any) => {
      if (data) {
        this.games = data;
      }
    });
  }

  _getMatchBySportId(sportId) {
    this._sharedService.getMatchBySportId(sportId).subscribe((data: any) => {
      if (data.matchList) {
        this.matchList = data.matchList;
      }
    });
  }

  onGameSelected(sportId) {
    this._getMatchBySportId(sportId);
  }

  next(): void {
    this.currentPage++;
    this.getPlStatement();
  }

  prev(): void {
    this.currentPage--;
    this.getPlStatement();
  }

  exportExcel(){
    this._sharedService.exportExcel(this.plStatement,this.fileName);
 }

}
