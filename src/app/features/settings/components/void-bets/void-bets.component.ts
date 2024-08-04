import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BookManagementService } from 'src/app/features/book-management/services/book-management.service';
import { MembersService } from 'src/app/features/members/services/members.service';
import { SharedService } from '../../../../shared/services/shared.service';
import { SettingsService } from '../services/settings.service';
import * as moment from 'moment';
@Component({
  selector: 'app-void-bets',
  templateUrl: './void-bets.component.html',
  styleUrls: ['./void-bets.component.scss']
})
export class VoidBetsComponent implements OnInit {

  refreshCount: number = 5;
  resetTimerInterval: any;
  bets_data:any;
  display:any = '';
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
  deleteBetForm: FormGroup;

  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 0;
  allMembers:any;
  marketList:any = [];
  sportsId: any = null;
  betRemark:any;

  sortColumn: string = '';
  sortAscending: boolean = true;// 1: ascending, -1: descending

  fileName= 'BetSettings.xlsx';


  constructor(private _sharedService: SharedService,
    private _settingService: SettingsService,
    private _memberService : MembersService,
    private _fb: FormBuilder) { }


    get f(){
      return this.betTickerForm.controls;
    }

  ngOnInit(): void {
    this._preConfig();
    this.betTickerForm.get('sportsId')?.valueChanges.subscribe((selectedValue) => {
      this.matchId = null;
      this.marketTypeId = null;
      this.betTickerForm.patchValue( {'marketId':null} );
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
    this.resetTimerInterval = setInterval(() => {
      if (this.refreshCount == 0) {
        this.refreshCall();
        this.refreshCount = 6;
      }
      this.refreshCount--;
    }, 1000)

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
      memberId: null,
      sportsId: null,
      matchId: null,
      marketId: null,
      tms: ['All'],
      type: ['All'],
      typeName:['All'],
      betType:["Matched"],
      time: ["All"],
      fromDate:new FormControl(this.formatFormDate(new Date())),
      toDate:new FormControl(this.formatFormDate(new Date())),
      stakesFromValue : [null],
      stakesToValue : [null]
    });

    this.deleteBetForm = this._fb.group({
      remarks: ['',Validators.required]
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

  submitForm(){
    this.confirmDeleteBet();
  }

  getAllUserBets(){
    this.isLoading = true;
    this.allBets = [];

    let fromDate = new Date(this.formatFormDate(new Date()));
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.formatFormDate(new Date()));
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);
    let body = {
      sportId: null,
      matchId: null,
      marketId : null,
      stakesFrom :null,
      stakesTo :null,
      fromDate: fromDate,
      toDate: toDate,
      userId: null,
    };

    this._settingService._getVoidBetsApi(body).subscribe((res:any)=>{
      this.isLoading = false;
      this.allBets = res.userBetList.betList;
      this.totalPages = Math.ceil(this.allBets.length / this.pageSize);
    },(err)=>{
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
    let fromDate = new Date(this.betTickerForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.betTickerForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    if(this.sportsId == 'null'){
      this.sportsId = null;
    }
    if(this.matchId == 'null'){
      this.matchId = null;
    }
    if(this.marketTypeId == 'null'){
      this.marketTypeId = null;
    }
    if(this.betTickerForm.value.memberId == 'null'){
      this.betTickerForm.patchValue( {'memberId':null} );
    }
    let payload = {
      sportId: this.sportsId,
      matchId: this.matchId,
      marketId: this.marketTypeId,
      stakesFrom :this.betTickerForm.value.stakesFromValue,
      stakesTo : this.betTickerForm.value.stakesToValue,
      fromDate : fromDate,
      toDate : toDate,
      userId: this.betTickerForm.value.memberId,
    }

    this._settingService._getVoidBetsApi(payload).subscribe((res:any)=>{
      this.allBets = res.userBetList.betList;
      this.totalPages = Math.ceil(this.allBets.length / this.pageSize);
    },(err)=>{
      this._sharedService.getToastPopup("Internal server error","","error")
    });
  }

  clearMember(){
    this.betTickerForm.controls['memberId'].setValue(null);
  }

  confirmDeleteBet(){
    this.betRemark = this.deleteBetForm.value.remarks;
    this.deleteBet(this.bets_data);
  }

  closeModal(){
    this.display = 'none';
  }

  openModal(bets){
    this.bets_data = bets;
    this.display = 'block';
  }

  deleteBet(user) {
    var currentUserIp:any;
    this._sharedService.currentUserIp.subscribe((data: any) => {
      currentUserIp = data.userIp;
    });
    let body = {
      "userId": user.userId,
      "betId": user.betId,
      "remarks": this.betRemark,
      "ip": currentUserIp
    }
    this._settingService._deleteBetApi(body).subscribe(res=>{
      this._sharedService.getToastPopup('done',"","success");
      this.getAllUserBets();
      this.display = 'none';
    })
  }

  exportExcel(){
    let allBet : any = []
    this.allBets.forEach(element => {
      // allBet.push({
      //   username:element.username,
      //   date : moment(element.placedDate).format("MMM D, YYYY, h:mm:ss a"),
      //   event: element.event,
      //   market:element.betCategory,
      //   OrderPlace:element.oddsPlaced,
      //   selection : element.selectionName,
      //   OrderPlaced:element.betRate,
      //   OrderMatched:element.betRate,
      //   //mathedStake:element.stake,
      //   //umatchedStake:element.stake
      // })
      if(element.isMatched){
        allBet.push({
          Member:element.username,
          Placetime : moment(element.placedDate).format("MMM D, YYYY, h:mm:ss a"),
          Event: element.event,
          Market:element.betCategory,
          // OrderPlace:element.oddsPlaced,
          Selection : element.selectionName,
          OrderPlaced:element.betRate,
          OrderMatched:element.betRate,
          MathedStake:element.isMatched == true? element.stake:'-',
          UnmatchedStake:element.isMatched == false? element.stake:'-'
        });
      }else {
        allBet.push({
          username:element.username,
        date : moment(element.placedDate).format("MMM D, YYYY, h:mm:ss a"),
        event: element.event,
        market:element.betCategory,
        OrderPlace:element.oddsPlaced,
        selection : element.selectionName,
        OrderPlaced:element.betRate,
        OrderMatched:element.betRate,
        umatchedStake:element.stake});
      }
    });
    this._sharedService.exportExcel(allBet,this.fileName);
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

}
