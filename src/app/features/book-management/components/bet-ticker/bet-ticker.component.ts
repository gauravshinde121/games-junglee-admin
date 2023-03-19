import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import { BookManagementService } from '../../services/book-management.service';
import { MembersService } from 'src/app/features/members/services/members.service';

@Component({
  selector: 'app-bet-ticker',
  templateUrl: './bet-ticker.component.html',
  styleUrls: ['./bet-ticker.component.scss']
})
export class BetTickerComponent implements OnInit {

  betTickerForm: FormGroup;
  games:any;
  matchList:any = [];
  marketList:any = [];
  dateFormat = "yyyy-MM-dd";
  language = "en";
  allBets: any;
  sportsId: any = null;
  matchId: any = null;
  marketTypeId: any = null;
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  isLoading = false;
  allMembers:any;

  constructor(
    private _sharedService:SharedService,
    private _memberService:MembersService,
    private bookManagementService:BookManagementService,
    private _fb: FormBuilder,
  ) { }

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

  _preConfig(){
    /*alert();console.log('rerrsrr');
    this._sharedService._getGames().subscribe((res:any)=>{
      this.games = res.gamesList;
      console.log('this.games',this.games);
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


  _getAllMembers(){
    this._memberService._getAllMembers().subscribe((data:any)=>{
      if(data.memberData){
        this.allMembers = data.memberData;
      }
    });
  }

  _getMarketsByMatchId(matchId){
    this._sharedService.getMarketsByMatchId(matchId).subscribe((data:any)=>{
      if(data.marketList){
        this.marketList = data.marketList;
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

    // let payload = {
    //   sportId: null,
    //   matchId: null,
    //   userId: null,
    //   marketId : null,
    //   stakesFrom :null,
    //   stakesTo :null,
    //   fromDate : null,
    //   toDate : null

    // }



    let body = {
      sportsId: null,
      matchId: null,
      userId: null,
      marketId : null,
      stakesFrom :null,
      stakesTo :null,
      fromDate : null,
      toDate : null,
      pageNo: this.currentPage,
      limit: 50,
    };

    this.bookManagementService._getAllUserBetsApi(body).subscribe((res:any)=>{
      this.isLoading = false;
      this.allBets = res.data;
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
      this.allBets = res.data;
      this.totalPages = Math.ceil(this.allBets.length / this.pageSize);
    },(err)=>{
      console.log(err);
      this._sharedService.getToastPopup("Internal server error","","error")
    });
  }

}
