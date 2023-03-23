import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BookManagementService } from 'src/app/features/book-management/services/book-management.service';
import { MembersService } from 'src/app/features/members/services/members.service';
import { SharedService } from '../../../../shared/services/shared.service';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-bet-settings',
  templateUrl: './bet-settings.component.html',
  styleUrls: ['./bet-settings.component.scss']
})
export class BetSettingsComponent implements OnInit {

  betList:any = [];
  isLoading = false;
  games:any = [];
  events:any = [];
  matchList:any = [];
  betSettingForm:FormGroup;
  dateFormat = "yyyy-MM-dd";
  language = "en";
  allBets: any = [];
  gameId: any = null;
  matchId: any = null;
  marketTypeId: any = null;

  betTickerForm: FormGroup;

  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  allMembers:any;
  marketList:any = [];
  sportsId: any = null;

  constructor(private _sharedService: SharedService,
    private _settingService: SettingsService,
    private _memberService : MembersService,
    private bookManagementService: BookManagementService,
    private _fb: FormBuilder) { }


    get f(){
      return this.betTickerForm.controls;
    }

  ngOnInit(): void {
    this._preConfig();
    this.betTickerForm.get('sportsId')?.valueChanges.subscribe((selectedValue) => {
      this._getMatchBySportId(selectedValue);
    });

    this.betTickerForm.get('matchId')?.valueChanges.subscribe((selectedValue) => {
      this._getMarketsByMatchId(selectedValue);
    });

    this.getAllUserBets();
  }

  _getMarketsByMatchId(matchId){
    this._sharedService.getMarketsByMatchId(matchId).subscribe((data:any)=>{
      if(data.marketList){
        this.marketList = data.marketList;
      }
    });
  }

  _preConfig(){

    this._initForm();
    this._getGames();
    this._getAllMembers();

  }

  _getAllMembers(){
    this._memberService._getAllMembers().subscribe((data:any)=>{
      if(data.memberData){
        this.allMembers = data.memberData;
      }
    });
  }

  _initForm(){
    this.betTickerForm = this._fb.group({
      memberName: null,
      sportsId: null,
      matchId: null,
      marketId: null,
      tms: ['All'],
      type: ['All'],
      typeName:['All'],
      betType:["Matched"],
      time: ["All"],
      fromDate : this.formatFormDate(new Date()),
      toDate : this.formatFormDate(new Date()),
      stakesFromValue : [null],
      stakesToValue : [null]
    });
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat,this.language);
  }


  _getGames(){
    this._sharedService._getSports().subscribe((data:any)=>{
      if(data){
        this.games = data;
      }
    });
  }

  _getMatchBySportId(sportId){
    this._sharedService.getMatchBySportId(sportId).subscribe((data:any)=>{
      if(data.matchList){
        this.matchList = data.matchList;
      }
    });
  }

  onGameSelected(sportId){
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


  getAllUserBets(){
    this.isLoading = true;
    this.allBets = [];

    let body = {
      sportsId: null,
      matchId: null,
      userId: null,
      marketId : null,
      stakesFrom :null,
      stakesTo :null,
      pageNo: this.currentPage,
      limit: 50,
    };

    this._settingService._getBetsApi(body).subscribe((res:any)=>{
      this.isLoading = false;
      this.allBets = res.userBetList.betList;
      this.totalPages = Math.ceil(this.allBets.length / this.pageSize);
    },(err)=>{
      console.log(err);
      this._sharedService.getToastPopup("Internal server error","","error")
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
    let payload = {
      sportsId: this.sportsId,
      matchId: this.matchId,
      marketId: this.marketTypeId,
      userId: null,
      stakesFrom :this.betTickerForm.value.stakesFromValue,
      stakesTo : this.betTickerForm.value.stakesToValue,
      fromDate : this.betTickerForm.value.fromDate,
      toDate : this.betTickerForm.value.toDate
    }

    this.bookManagementService._getAllUserBetsApi(payload).subscribe((res:any)=>{
      this.allBets = res.userBetList.betList;
      this.totalPages = Math.ceil(this.allBets.length / this.pageSize);
    },(err)=>{
      console.log(err);
      this._sharedService.getToastPopup("Internal server error","","error")
    });
  }

  clearMember(){
    this.betTickerForm.value.memberName = null;
  }

  deleteBet(user) {
    let body = {
      "userId": user.userId,
      "betId": user.betId
    }
    this._settingService._deleteBetApi(body).subscribe(res=>{
      this._sharedService.getToastPopup(res['message'],"","success");
      this.getAllUserBets();
    })
  }
}
