import { formatDate } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import { BookManagementService } from '../../services/book-management.service';
import { MembersService } from 'src/app/features/members/services/members.service';
import * as moment from 'moment';
@Component({
  selector: 'app-bet-ticker',
  templateUrl: './bet-ticker.component.html',
  styleUrls: ['./bet-ticker.component.scss']
})
export class BetTickerComponent implements OnInit, OnDestroy {

  refreshCount: number = 5;
  resetTimerInterval: any;
  betTickerForm: FormGroup;
  fromDate = new Date().toString();
  toDate = new Date().toString();
  games: any;
  matchList: any = [];
  marketList: any = [];
  dateFormat = "yyyy-MM-dd";
  language = "en";
  allBets: any;
  sportsId: any = null;
  matchId: any = null;
  marketTypeId: any = null;
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 0;
  isLoading = false;
  allMembers: any;
  limit: number = 50;

  sortColumn: string = '';
  sortAscending: boolean = true;// 1: ascending, -1: descending

  fileName = 'BetTicker.xlsx';

  constructor(
    private _sharedService: SharedService,
    private _memberService: MembersService,
    private bookManagementService: BookManagementService,
    private _fb: FormBuilder,
  ) { }
  get f() {
    return this.betTickerForm.controls;
  }

  ngOnInit(): void {
    this._preConfig();
    this.betTickerForm.get('sportsId')?.valueChanges.subscribe((selectedValue) => {
      this.matchId = null;
      this.marketTypeId = null;
      if(selectedValue){
        this._getMatchBySportId(selectedValue);
      }
    });

    this.betTickerForm.get('matchId')?.valueChanges.subscribe((selectedValue) => {
      this.marketTypeId = null;
      if(selectedValue){
        this._getMarketsByMatchId(selectedValue);
      }
    });

    this.getAllUserBets();

    this.resetTimerInterval = setInterval(() => {
      if (this.refreshCount == 0) {
        this.refreshCall();
        this.refreshCount = 6;
      }
      this.refreshCount--;
    }, 1000)

  }

  _preConfig() {
    /*
    this._sharedService._getGames().subscribe((res:any)=>{
      this.games = res.gamesList;
    });*/
    this._initForm();
    this._getGames();
    this._getAllMembers();

  }

  // _initForm(){
  //   this.betTickerForm = new FormGroup({
  //     sportsId:new FormControl('0'),
  //     matchId:new FormControl('0'),
  //     marketId:new FormControl('0'),
  //     tms:new FormControl('All'),
  //     type:new FormControl('All'),
  //     typeName:new FormControl('All'),
  //     betType:new FormControl("Matched"),
  //     time:new FormControl("All")
  //   });
  // }

  _initForm() {
    this.betTickerForm = this._fb.group({
      memberName: null,
      sportsId: null,
      matchId: null,
      marketId: null,
      tms: ['All'],
      type: ['All'],
      typeName: ['All'],
      betType: ["Matched"],
      time: ["All"],
      fromDate: this.formatFormDate(new Date()),
      toDate: this.formatFormDate(new Date()),
      stakesFromValue: [null],
      stakesToValue: [null]
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


  _getAllMembers() {
    this._memberService._getAllMembers().subscribe((data: any) => {
      if (data.memberData) {
        this.allMembers = data.memberData;
      }
    });
  }

  _getMarketsByMatchId(matchId) {
    this._sharedService.getMarketsByMatchId(matchId).subscribe((data: any) => {
      if (data.marketList) {
        this.marketList = data.marketList;
      }
    });
  }

  onGameSelected(sportId) {
    this._getMatchBySportId(sportId);
  }

  changeGame(evt) {
    this.sportsId = evt.target.value;
  }

  changeMatch(evt) {
    this.matchId = evt.target.value;
  }

  changeMarketType(evt) {
    this.marketTypeId = evt.target.value;
  }



  getAllUserBets() {

    this.isLoading = true;
    this.allBets = [];
    let fromDate = new Date(this.betTickerForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.betTickerForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    let body = {
      fromDate: fromDate,
      toDate: toDate,
      sportId: null,
      matchId: null,
      userId: null,
      marketId: null,
      stakesFrom: null,
      stakesTo: null,
      pageNo: this.currentPage,
      limit: this.limit,
      // userId: null
    };

    this.bookManagementService._getAllUserBetsApi(body).subscribe((res: any) => {
      this.isLoading = false;
      this.allBets = res.userBetList.betList;
      this.totalPages = Math.ceil(this.allBets.length / this.pageSize);
    }, (err) => {
      this._sharedService.getToastPopup("Internal server error", "", "error")
    });
  }

  next(): void {
    this.currentPage++;
    this.getAllUserBets();
  }

  prev(): void {
    this.currentPage--;
    this.getAllUserBets();
  }

  searchList() {
    let fromDate = new Date(this.betTickerForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.betTickerForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    if (this.sportsId == 'null') {
      this.sportsId = null;
    }
    if (this.matchId == 'null') {
      this.matchId = null;
    }

    let payload = {
      sportId: this.sportsId,
      matchId: this.matchId,
      marketId: this.marketTypeId,
      // userId: +this.betTickerForm.value.userId,
      stakesFrom: this.betTickerForm.value.stakesFromValue,
      stakesTo: this.betTickerForm.value.stakesToValue,
      fromDate: fromDate,
      toDate: toDate,
      userId: this.betTickerForm.value.memberName
    }

    this.bookManagementService._getAllUserBetsApi(payload).subscribe((res: any) => {
      this.allBets = res.userBetList.betList;
      this.totalPages = Math.ceil(this.allBets.length / this.pageSize);
    }, (err) => {
      this._sharedService.getToastPopup("Internal server error", "", "error")
    });
  }

  clearMemberName() {
    this.betTickerForm.controls['memberName'].setValue(null);
  }

  exportExcel() {
    let allBet: any = []
    this.allBets.forEach(element => {
      if (element.isMatched) {
        allBet.push({
          username: element.username,
          date: moment(element.placedDate).format("MMM D, YYYY, h:mm:ss a"),
          event: element.event,
          market: element.betCategory,
          // OrderPlace: element.oddsPlaced,
          selection: element.selectionName,
          OrderPlaced: element.betRate,
          OrderMatched: element.betRate,
          mathedStake:element.stake,
          // umatchedStake:element.stake,
          profit_Liablity: element.profitLiability
        })
      } else {
        allBet.push({
          username: element.username,
          date: moment(element.placedDate).format("MMM D, YYYY, h:mm:ss a"),
          event: element.event,
          market: element.betCategory,
          // OrderPlace: element.oddsPlaced,
          selection: element.selectionName,
          OrderPlaced: element.betRate,
          OrderMatched: element.betRate,
          //mathedStake:element.stake,
           umatchedStake:element.stake,
          profit_Liablity: element.profitLiability
        });
      }
    });
    this._sharedService.exportExcel(allBet, this.fileName);
  }

  toggleSort(columnName: string) {
    if (this.sortColumn === columnName) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = columnName;
      this.sortAscending = true;
    }


  }

  refreshCall(){
    this.searchList();
  }

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed
    if (this.resetTimerInterval) {
      clearInterval(this.resetTimerInterval);
    }
  }

}
