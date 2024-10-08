import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BookManagementService } from 'src/app/features/book-management/services/book-management.service';
import { MembersService } from 'src/app/features/members/services/members.service';
import { SharedService } from '../../../../shared/services/shared.service';
import { SettingsService } from '../services/settings.service';
import * as moment from 'moment';
@Component({
  selector: 'app-bet-settings',
  templateUrl: './bet-settings.component.html',
  styleUrls: ['./bet-settings.component.scss']
})
export class BetSettingsComponent implements OnInit, OnDestroy {

  isSuspected: boolean = false;
  refreshCount: number = 60;
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
  isDeleted:boolean = false;
  betTickerForm: FormGroup;
  deleteBetForm: FormGroup;
  allChecked = false;
  isBulk:boolean = false;
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 0;
  allMembers:any;
  marketList:any = [];
  sportsId: any = null;
  betRemark:any;
  selectedBetsForSettings:any = [];
  sortColumn: string = '';
  sortAscending: boolean = true;// 1: ascending, -1: descending
  modalNumber: number;
  currentUserIp:any;
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
    this.setTimer();
    this._sharedService.currentUserIp.subscribe((data: any) => {
      this.currentUserIp = data.userIp;
    });

  }

  setTimer(){
    this.resetTimerInterval = setInterval(() => {
      if (this.refreshCount == 0) {
        this.refreshCall();
        this.refreshCount = 61;
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
      fromDate:new FormControl(this.formatDateTime(new Date())),
      toDate:new FormControl(this.formatDateTime(new Date())),
      stakesFromValue : [null],
      stakesToValue : [null],
      betMarketTypeId : new FormControl(),
      isDeleted: new FormControl(false)
    });

    this.deleteBetForm = this._fb.group({
      remarks: ['',Validators.required]
    });
  }

  formatDateTime(date: Date): string {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset*60*1000));
    return localDate.toISOString().slice(0, 19);
  }

  // formatFormDate(date: Date) {
  //   return formatDate(date, this.dateFormat,this.language);
  // }

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

  changeBetStatus(evt) {
    const value = evt.target.value === 'true';
    this.isDeleted = value;
    this.searchList();
  }

  submitForm(){
    this.confirmDeleteBet();
  }

  getAllUserBets(){
    this.isLoading = true;
    this.allBets = [];

    let fromDate = new Date(this.formatDateTime(new Date()));
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.formatDateTime(new Date()));
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);
    let body = {
      memberId: null,
      sportId: null,
      matchId: null,
      userId: null,
      marketId : null,
      stakesFrom :null,
      stakesTo :null,
      pageNo: this.currentPage,
      limit: 50,
      fromDate: fromDate,
      toDate: toDate,
      betMarketTypeId:null,
      isDeleted:this.isDeleted
    };

    this._settingService._getBetsApi(body).subscribe((res:any)=>{
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
    // let fromDate = new Date(this.betTickerForm.value.fromDate);
    // fromDate.setHours(0)
    // fromDate.setMinutes(0);
    // fromDate.setSeconds(0);

    // let toDate = new Date(this.betTickerForm.value.toDate);
    // toDate.setHours(23)
    // toDate.setMinutes(59);
    // toDate.setSeconds(59);

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

    if(this.betTickerForm.value.betMarketTypeId == 'null'){
      this.betTickerForm.value.betMarketTypeId = null;
    }
    let payload = {
      memberId: this.betTickerForm.value.memberId,
      sportId: this.sportsId,
      matchId: this.matchId,
      marketId: this.marketTypeId,
      userId: this.betTickerForm.value.memberId,
      stakesFrom :this.betTickerForm.value.stakesFromValue,
      stakesTo : this.betTickerForm.value.stakesToValue,
      fromDate: this.formatDateToISOString(this.betTickerForm.value.fromDate),
      toDate: this.formatDateToISOString(this.betTickerForm.value.toDate),
      betMarketTypeId: this.betTickerForm.value.betMarketTypeId,
      isDeleted: this.isDeleted,
      pageNo: this.currentPage,
      limit: 50,
    }

    this._settingService._getBetsApi(payload).subscribe((res:any)=>{
      this.allBets = res.userBetList.betList;
      this.totalPages = Math.ceil(this.allBets.length / this.pageSize);
    },(err)=>{
      this._sharedService.getToastPopup("Internal server error","","error")
    });
  }

  clearMember(){
    this.betTickerForm.controls['memberId'].setValue(null);
  }

  formatDateToISOString(dateString: string): string {
    const date = new Date(dateString);

    // If the string is invalid, date.getTime() will be NaN
    if (isNaN(date.getTime())) {
        console.error("Invalid date string:", dateString);
        return ''; // or handle it as needed
    }

    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('.')[0] + '.000Z';
}



  confirmDeleteBet(){
    this.betRemark = this.deleteBetForm.value.remarks;
    if(this.isBulk){
      let body = {
        "betIdList": this.selectedBetsForSettings,
        "remarks": this.betRemark,
        "ipAddress": this.currentUserIp
      }
      this._settingService._deleteBulkBetApi(body).subscribe(res=>{
        this._sharedService.getToastPopup('done',"","success");
        this.getAllUserBets();
        this.display = 'none';
      })
    } else {
      this.deleteBet(this.bets_data);
    }
  }

  undoBets(selectedBets){
    const betIdList = selectedBets.map(bet => bet.betId);
    let body = {
      "betIdList": betIdList,
    }
    this._settingService._undoBetApi(body).subscribe(res=>{
      this._sharedService.getToastPopup('done',"","success");
      this.searchList();
    })
  }

  closeModal(){
    this.display = 'none';
  }

  openModal(bets, isBulk){
    console.log('isBulk', isBulk);
    this.isBulk = isBulk;
    this.bets_data = bets;
    this.display = 'block';
  }

  deleteBet(user) {

    let body = {
      "userId": user.userId,
      "betId": user.betId,
      "remarks": this.betRemark,
      "ip": this.currentUserIp
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

 onSuspectedStatus(event: any, betId) {
    this.isSuspected = event.target.checked;
    let body = {
      "id":betId,
      "isSuspected":this.isSuspected
    }
    this._settingService._ifSuspectBetApi(body).subscribe(res=>{
      this._sharedService.getToastPopup('Suspect bet status changed.',"","success");
    })
  }

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed
    if (this.resetTimerInterval) {
      clearInterval(this.resetTimerInterval);
    }
  }

  setUnsetTimer(){
    if (this.resetTimerInterval && this.selectedBetsForSettings.length >0) {
      clearInterval(this.resetTimerInterval);
    } else if(this.selectedBetsForSettings.length == 0) {
      this.setTimer();
    }
  }

  checkbetId(betId: any,userId:any) {
    const index = this.selectedBetsForSettings.findIndex(
      (bet) => bet.betId === betId && bet.userId === userId
    );

    if (index !== -1) {
      this.selectedBetsForSettings.splice(index, 1);
      this.setUnsetTimer();
      return;
    }
    this.selectedBetsForSettings.push({"betId":betId, "userId":userId});
    this.setUnsetTimer();
  }

  checkAll(ev) {
    if (ev.target.checked) {
      this.selectedBetsForSettings = [];
    }

    this.allChecked = !this.allChecked;

    this.allBets.forEach((x) => (x.state = ev.target.checked));

    for (const bet of this.allBets) {
      this.checkbetId(bet.matchId, bet.userId);
    }
    this.setUnsetTimer();
  }

  isAllChecked() {
    return this.allBets.every((_) => _.state);
  }

  openBulkDeleteModal() {

    this.modalNumber = 1;

    this.display = 'block';
  }

}
