import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from '../../services/members.service';
import {
  nameValidator,
  ntpOrIpValidator
} from "src/app/shared/classes/validator";
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-bet-list',
  templateUrl: './bet-list.component.html',
  styleUrls: ['./bet-list.component.scss']
})
export class BetListComponent implements OnInit {

  fromDate = new Date().toString();
  toDate = new Date().toString();
  currentDate = new Date().toString();
  userId:any = null;
  betList:any = []
  filterForm: FormGroup;
  games:any;
  matchList:any = [];
  marketList:any = [];
  allMembers:any = [];
  dateFormat = "yyyy-MM-dd";
  language = "en";
  isLoading = false;
  isMatch : boolean = false ;
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 0;
  status = "Enable";
  sportsId: any = null;
  matchId: any = null;
  marketTypeId: any = null;

  btnActive: string = 'current';
  isActive : any = false;
  isMatched : any = false;


  constructor(
    private _memberService:MembersService,
    private route:ActivatedRoute,
    private _sharedService:SharedService,
    private _fb: FormBuilder,
    ) { }

    get f(){
      return this.filterForm.controls;
    }

  ngOnInit(): void {
    this.route.params.subscribe(params=>{
    this.userId = +params['id'];

    });

    this.isActive = true;
    this.isMatched = true;

    this._preconfig();
    this.filterForm.get('sportsId')?.valueChanges.subscribe((selectedValue) => {
      console.log('Selected value: ', selectedValue);
      this._getMatchBySportId(selectedValue);
    });

    this.filterForm.get('matchId')?.valueChanges.subscribe((selectedValue) => {
      console.log('Selected matchId: ', selectedValue);
      this._getMarketsByMatchId(selectedValue);
    });

  }

  _preconfig(){
    /*this._sharedService._getGames().subscribe((res:any)=>{
      this.games = res.gamesList;
    });*/
    this._initForm();
    this.getMemberBets();
    this._getGames();
    this._getAllMembers();
  }

  _initForm(){
    this.filterForm = this._fb.group({
      fromDate : this.formatFormDate(new Date()),
      toDate : this.formatFormDate(new Date()),
      memberName: [
        "0",
        {
          validators: [nameValidator("Member Name", 1, 25)],
          updateOn: "change",
        },
      ],
      sportsId: null,
      matchId: null,
      marketId: null,
      highlightIp: [
        "",
        {
          validators: [ntpOrIpValidator("Highlight IP", 8, 20)],
          updateOn: "change",
        },
      ],
      page: null,
      stakesFrom: null,
      stakesTo: null,
      betType: null,
      time: null
    });
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat,this.language);
  }

  getMemberBets(){

    this.isLoading = true;
    this.betList = [];

    let fromDate = new Date(this.filterForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.filterForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    let body = {
      isActive: this.isActive,
      isMatched: this.isMatched,
      sportId: this.filterForm.value.sportsId,
      matchId : this.filterForm.value.matchId,
      marketId : this.filterForm.value.marketId,
      stakesFrom :this.filterForm.value.stakesFrom,
      stakesTo :this.filterForm.value.stakesTo,
      fromDate : fromDate,
      toDate : toDate,
      userId:this.userId,
      pageNo: this.currentPage,
      limit: 50,
    };

    this._memberService._getMemberBetseApi(body)
      .subscribe((res:any)=>{
      console.log(res);
      this.isLoading = false;
      if(res){
        this.betList = res.data.betList;
        this.totalPages = Math.ceil(res.data.totalNoOfRecords / this.pageSize);
      }
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
        //console.log('data.matchList',data.matchList);
      }
    });
  }

  _getMarketsByMatchId(matchId){
    this._sharedService.getMarketsByMatchId(matchId).subscribe((data:any)=>{
      console.log('match data',data);
      if(data.marketList){
        this.marketList = data.marketList;
        //console.log('data.matchList',data.matchList);
      }
    });
  }

  _getAllMembers(){
    this._memberService._getAllMembers().subscribe((data:any)=>{
      console.log('match data',data);
      if(data.memberData){
        this.allMembers = data.memberData;
        console.log('data.matchList',data.matchList);
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

  clearMembers(){
    this.filterForm.controls['memberName'].reset()
  }

  showMatch(linkActive: string){

    if(linkActive == 'current') {
      this.isMatch = false;

      this.isActive = true;
      this.isMatched = true;
      this.getMemberBets();
    }
    else if(linkActive == 'past'){
      this.isMatch = true;
      this.isActive = false;
      this.isMatched = null;
      this.getMemberBets();

    }
    else if(linkActive == 'unmatch'){
      // this.isMatch = true;
      this.isActive = true;
      this.isMatched = false;
      this.getMemberBets();

    }
    this.btnActive = linkActive;


  }




}
