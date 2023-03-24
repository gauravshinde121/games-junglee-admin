import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MembersService } from 'src/app/features/members/services/members.service';
import { SharedService } from '@shared/services/shared.service';
import { formatDate } from '@angular/common';
import { SettingsService } from 'src/app/features/settings/components/services/settings.service';
import { BookManagementService } from 'src/app/features/book-management/services/book-management.service';

@Component({
  selector: 'app-surveillance-main',
  templateUrl: './surveillance-main.component.html',
  styleUrls: ['./surveillance-main.component.scss']
})
export class SurveillanceMainComponent implements OnInit {

  isLeftMenuOpen: boolean;
  sideBarClass:String = 'mobile-menu';
  mainClass:String = 'col-md-10';
  filterForm:FormGroup;
  surveillanceData:any = [];
  allMembers:any = [];
  games:any = [];
  matchList:any = [];
  marketList:any = [];

  betList:any = [];
  isLoading = false;
  events:any = [];
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
  sportsId: any = null;

  constructor(
    private _sharedService: SharedService,
    private _settingService: SettingsService,
    private _memberService : MembersService,
    private bookManagementService: BookManagementService,
    private _fb: FormBuilder
  ) { }

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
    this._sharedService.leftMenuStatus.subscribe((res: any) => {
      this.isLeftMenuOpen = res.leftMenuOpen;
      console.log(this.sideBarClass);
      if(this.isLeftMenuOpen){
        console.log('1');
        this.sideBarClass = 'mobile-menu';
        this.mainClass = 'col-md-10';
      } else {
        console.log('2');
        this.sideBarClass = '';
        this.mainClass = 'col-md-12';
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

  _preConfig(){

    this._initForm();
    this._getGames();
    this._getAllMembers();

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
      stakesFromValue : null,
      stakesToValue : null
    });
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat,this.language);
  }

  _getAllMembers(){
    this._memberService._getAllMembers().subscribe((data:any)=>{
      if(data.memberData){
        this.allMembers = data.memberData;
      }
    });
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

  getSurveillanceData(){
    this._sharedService._getSurveillanceDataApi({...this.filterForm.value}).subscribe((res:any)=>{
      this.surveillanceData = res.data;
    })
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

    this.bookManagementService._getAllUserBetsApi(body).subscribe((res:any)=>{
      this.isLoading = false;
      this.allBets = res.userBetList.betList;
      this.totalPages = Math.ceil(res.userBetList.totalNoOfRecords / this.pageSize);
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

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

}
