import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AccountStatementService } from '../../services/account-statement.service';
import { SharedService } from '@shared/services/shared.service';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import * as moment from 'moment';

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
  sportsId: any = null;
  matchId: any = null;
  marketTypeId: any = null;
  //currentTotalPage:any;

  fileName= 'P/L Statement '+'_'+new Date()+'.xlsx';

  sortColumn: string = '';
  sortAscending: boolean = true;// 1: ascending, -1: descending
  totalAmount = 0;


  constructor(
    private _accountStatementService: AccountStatementService,
    private _sharedService: SharedService,
    private _router: Router,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this._preconfig();
    this.filterForm.get('sportsId')?.valueChanges.subscribe((selectedValue) => {
      this._getMatchBySportId(selectedValue);
    });
    this.filterForm.get('matchId')?.valueChanges.subscribe((selectedValue) => {
      this._getMarketsByMatchId(selectedValue);
      this.filterForm.value.marketId = null;
      this.filterForm.patchValue( {'marketId':null} );
    });
    this.getPlStatement();

  }

  _getMarketsByMatchId(sportId){
    this._sharedService.getMarketsByMatchId(sportId).subscribe((data:any)=>{
      if(data.marketList){
        this.marketList = data.marketList;
      }
    });
  }

  _preconfig() {
    /*this._sharedService._getGames().subscribe((res:any)=>{
      this.games = res.gamesList;
    });*/
    this._getGames();
    this._initForm();
    // this.getPlStatement();
    this._getAllMarketTypeList();
  }

  // __initForm() {
  //   this.filterForm = new FormGroup({
  //     fromDate: new FormControl(this.formatFormDate(new Date())),
  //     toDate: new FormControl(this.formatFormDate(new Date())),
  //     sportsId: new FormControl(null),
  //     matchId: new FormControl(null),
  //     marketId: new FormControl(null)
  //   })
  // }
  _initForm(){
    this.filterForm = this._fb.group({
      fromDate : this.formatFormDate(new Date()),
      toDate : this.formatFormDate(new Date()),
      sportsId: null,
      matchId: null,
      marketId: null,
    });
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat, this.language);
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

  _getMarketByMatchId(sportId){
    this._sharedService.getMarketsByMatchId(sportId).subscribe((data:any)=>{
      if(data.marketList){
        this.marketList = data.marketList;
      }
    });
  }


  onGameSelected(sportId){
    this._getMatchBySportId(sportId);
  }

  changeGame(evt) {
    // this.sportsId = evt.target.value;
    this.filterForm.value.sportsId = evt.target.value;
    if(evt.target.value == null) {
      this.filterForm.value.matchId = null;
      this.filterForm.value.marketId = null;
    }
  }

  changeMatch(evt) {
    // this.matchId = evt.target.value;
    this.filterForm.value.matchId = evt.target.value;
    if(evt.target.value == null) {
      this.filterForm.value.marketId = null;
      this.filterForm.patchValue( {'marketId':null} );
    }
  }

  changeMarketType(evt) {
    // this.marketTypeId = evt.target.value;
    this.filterForm.value.marketId = evt.target.value;
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

    // if(this.filterForm.value.sportsId == 'null'){
    //   this.filterForm.patchValue( {'sportsId':null} );
    // }
    // if(this.filterForm.value.matchId == 'null'){
    //   this.filterForm.patchValue( {'matchId':null} );
    // }
    // if(this.filterForm.value.marketId == 'null'){
    //   this.filterForm.patchValue( {'marketId':null} );
    // }
    // let body = {
    //   fromDate: fromDate,
    //   toDate: toDate,
    //   sportId:this.filterForm.value.sportsId?+this.filterForm.value.sportsId:this.filterForm.value.sportsId,
    //   matchId: this.filterForm.value.matchId,
    //   marketId: this.filterForm.value.marketId,
    //   pageNo: this.currentPage,
    //   limit: 50,
    // };

    let body = {
      fromDate:fromDate,
      toDate:toDate,
      sportId: null,
      matchId: null,
      marketId : null,
      pageNo: this.currentPage,
      limit: 50,
    };

    this._accountStatementService._getPlBySubgameAPi(body).subscribe((res: any) => {
      this.isLoading = false;
      // if (res.admin.finalResult.length > 0) {
        this.plStatement = res.admin.finalResult;
        this.totalPages = Math.ceil(res.admin.totalNoOfRecords / this.pageSize);
        this.totalAmount = this.plStatement.reduce((acc, crnt) => acc + crnt.netAmount,0);

      // }
      //this.currentTotalPage = Math.ceil(this.currentPage  / this.totalPages);
    },(err)=>{
      this._sharedService.getToastPopup("Internal server error","","error")
    });
  }

  _getAllMarketTypeList() {
    this._sharedService.getAllMarketTypeList().subscribe((data: any) => {
      if (data.data) {
        this.marketTypeList = data.data;
      }
    });
  }

  searchList(){
    if(this.filterForm.value.sportsId == null || this.filterForm.value.sportsId== "null"){
      this.filterForm.value.matchId = null;
    }
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
      this.filterForm.value.sportsId = null;
    }
    if(this.filterForm.value.matchId == 'null'){
      this.filterForm.value.matchId = null;
    }
    if(this.filterForm.value.marketId == 'null'){
      this.filterForm.value.marketId = null;
    }

    let payload = {
      fromDate:fromDate,
      toDate:toDate,
      sportId: this.filterForm.value.sportsId,
      matchId: this.filterForm.value.matchId,
      marketId: this.filterForm.value.marketId,
      pageNo: this.currentPage,
      limit: 50,
    };

    this._accountStatementService._getPlBySubgameAPi(payload).subscribe((res: any) => {
      this.isLoading = false;
      // if (res.admin.finalResult.length > 0) {
        this.plStatement = res.admin.finalResult;
        // this.totalPages = Math.ceil(res.admin.totalNoOfRecords / this.pageSize);

        this.totalAmount = this.plStatement.reduce((acc, crnt) => acc + crnt.netAmount,0);
      // }
      //this.currentTotalPage = Math.ceil(this.currentPage  / this.totalPages);
    },(err)=>{
      this._sharedService.getToastPopup("Internal server error","","error")
    });
  }


  openAllBets(matchId){
    if(matchId){
      this._router.navigate(['/account-statement/all-bets/'+matchId]);
    }
  }



  // onGameSelected(sportId) {
  //   this._getMatchBySportId(+sportId);
  // }

  next(): void {
    this.currentPage++;
    this.getPlStatement();
  }

  prev(): void {
    this.currentPage--;
    this.getPlStatement();
  }

  exportExcel(){
    let pL : any = []
    this.plStatement.forEach(element => {
      pL.push({
        Date :  moment(element.createdAt).format("MMM D, YYYY, h:mm:ss a"),
        Game: element.gameName,
        SubGame:element.subGame,
        Event : element.eventName,
        Win_Loss :element.netAmount,
        // Commision:element.commission,
        // NetAmount:element.netAmount,
        // UserCount:element.userCount,
        // BetCount:element.userBetCount
      })
    });
    this._sharedService.exportExcel(pL,this.fileName);
 }

 toggleSort(columnName: string) {
  if (this.sortColumn === columnName) {
    this.sortAscending = !this.sortAscending;
  } else {
    this.sortColumn = columnName;
    this.sortAscending = true;
  }
}

}
