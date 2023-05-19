import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AccountStatementService } from '../../services/account-statement.service';
import { SharedService } from '@shared/services/shared.service';
import { MembersService } from 'src/app/features/members/services/members.service';
import { formatDate } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-player-pl',
  templateUrl: './player-pl.component.html',
  styleUrls: ['./player-pl.component.scss']
})
export class PlayerPlComponent implements OnInit {

  limit: number = 50;
  filterForm: FormGroup;
  plStatement: any = [];
  games: any;
  matchList: any = [];
  marketList: any = [];
  allMembersList: any = [];
  allMembers: any = [];
  dateFormat = "yyyy-MM-dd";
  language = "en";
  marketTypeList: any;
  selectedAccount: any;
  accountStatement: any;
  display = '';
  gameData: any;
  playerData: any;
  pl: any;
  oneAccount: any;

  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 0;
  isLoading = false;

  fileName = 'PlayerP/L_Statement.xlsx';

  constructor(
    private _memberService: MembersService,
    private _accountStatementService: AccountStatementService,
    private _sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this._preConfig();
    this.filterForm.get('sportsId')?.valueChanges.subscribe((selectedValue) => {
      this._getMatchBySportId(selectedValue);
    });


    this.filterForm.get('matchId')?.valueChanges.subscribe((selectedValue) => {
      this._getMarketsByMatchId(selectedValue);
    });
  }

  _preConfig() {
    this._initForm();
    this._getGames();
    this.getPlStatement();
    this._getAllMarketTypeList();
    this._getAllMembers();
  }

  get f() {
    return this.filterForm.controls;
  }

  _initForm() {
    this.filterForm = new FormGroup({
      memberName: new FormControl(null),
      fromDate: new FormControl(this.formatFormDate(new Date())),
      toDate: new FormControl(this.formatFormDate(new Date())),
      sportsId: new FormControl(null),
      matchId: new FormControl(null),
      marketId: new FormControl(null),
      marketTypeId: new FormControl(null)
    })
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


  closeModal() {
    this.display = 'none';
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

    if (this.filterForm.value.sportsId == 'null') {
      this.filterForm.patchValue({ 'sportsId': null });
    }
    if (this.filterForm.value.matchId == 'null') {
      this.filterForm.patchValue({ 'matchId': null });
    }
    if (this.filterForm.value.marketId == 'null') {
      this.filterForm.patchValue({ 'marketId': null });
    }

    let body = {
      fromDate: fromDate,
      toDate: toDate,
      sportId: this.filterForm.value.sportsId,
      matchId: this.filterForm.value.matchId,
      marketId: this.filterForm.value.marketId,
      memberId: this.filterForm.value.memberName?+this.filterForm.value.memberName:null,
      pageNo: this.currentPage,
      limit: this.limit,
    };

    this._accountStatementService._getDownlineAccountsDataApi(body).subscribe((res: any) => {
      this.isLoading = false;
      if (res.admin.finalList.length > 0) {
        this.plStatement = res.admin.finalList;
        this.totalPages = Math.ceil(res.admin.totalNoOfRecords / this.pageSize);
      }
    }, (err) => {
      console.log("Error Data", err);
      this.isLoading = false;
    })
  }

  _getAllMembers() {
    this._memberService._getAllMembers().subscribe((data: any) => {
      if (data.memberData) {
        this.allMembers = data.memberData;
      }
    });
  }

  _getAllMarketTypeList() {
    this._sharedService.getAllMarketTypeList().subscribe((data: any) => {
      if (data.data) {
        this.marketTypeList = data.data;
      }
    });
  }

  getOneAccount(pl) {
    this.isLoading = true;
    let body = {
      "userId": pl.userId,
      "matchId": pl.matchId
    }
    this._sharedService.getOneAccount(body).subscribe((data: any) => {
      this.isLoading = false;
      if (data.oneAccount) {
        this.oneAccount = data.oneAccount;
      }
    });
    this.pl = pl;
    this.gameData = pl.gameData;
    this.playerData = pl.playerData;
  }

  _getMatchBySportId(sportId) {
    this._sharedService.getMatchBySportId(sportId).subscribe((data: any) => {
      if (data.matchList) {
        this.matchList = data.matchList;
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

  next(): void {
    this.currentPage++;
    this.getPlStatement();
  }

  prev(): void {
    this.currentPage--;
    this.getPlStatement();
  }

  clearMemberName() {
    this.filterForm.controls['memberName'].setValue(null);
  }

  exportExcel() {
    let profitLoss: any = []
    this.plStatement.forEach(element => {
      profitLoss.push({
        date: moment(element.createDateTime).format("MMM D, YYYY, h:mm:ss a"),
        sport: element.gameData.subGame,
        match: element.gameData.eventName,
        user: element.playerData.name,
        amount: element.gameData.netAmt,
      })
    });

    this._sharedService.exportExcel(profitLoss, this.fileName);
  }

  exportExcel1() {
    // let oneaccnt : any = []
    // this.oneAccount.forEach(element => {
    //   oneaccnt.push({
    //     date : new Date(element.createDateTime),
    //     sport: element.gameData.subGame,
    //     match : element.gameData.eventName,
    //     user : element.playerData.name,
    //     amount :element.gameData.netAmt,
    //   })
    // });

    this._sharedService.exportExcel(this.oneAccount, this.fileName);
  }

}


