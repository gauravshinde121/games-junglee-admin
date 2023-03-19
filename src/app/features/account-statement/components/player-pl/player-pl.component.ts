import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccountStatementService } from '../../services/account-statement.service';
import { SharedService } from '@shared/services/shared.service';
import { MembersService } from 'src/app/features/members/services/members.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-player-pl',
  templateUrl: './player-pl.component.html',
  styleUrls: ['./player-pl.component.scss']
})
export class PlayerPlComponent implements OnInit {

  filterForm:FormGroup;
  plStatement:any = [];
  games:any;
  matchList:any = [];
  marketList:any = [];
  marketTypeList:any = [];
  allMambers:any = [];
  dateFormat = "yyyy-MM-dd";
  language = "en";

  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  isLoading = false;

  constructor(
    private _accountStatementService:AccountStatementService,
    private _sharedService:SharedService,
    private _memberService:MembersService
  ) { }

  ngOnInit(): void {
    this._preConfig();
    this.filterForm.get('sportsId')?.valueChanges.subscribe((selectedValue) => {
      console.log('Selected value: ', selectedValue);
      this._getMatchBySportId(selectedValue);
    });


    this.filterForm.get('matchId')?.valueChanges.subscribe((selectedValue) => {
      console.log('Selected matchId: ', selectedValue);
      this._getMarketsByMatchId(selectedValue);
    });
  }

  _preConfig(){
    this._initForm();
    this._getGames();
    this.getPlStatement();
    this._getAllMarketTypeList();
    this._getAllMembers();
  }


  _initForm(){
    this.filterForm = new FormGroup({
      memberName:new FormControl(null),
      fromDate:new FormControl(this.formatFormDate(new Date())),
      toDate:new FormControl(this.formatFormDate(new Date())),
      sportsId:new FormControl(null),
      matchId:new FormControl(null),
      marketId:new FormControl(null),
      marketTypeId:new FormControl(null)
    })
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

  getPlStatement(){
    this.isLoading = true;
    this.plStatement = [];

    let body = {
      fromDate: this.filterForm.value.fromDate,
      toDate: this.filterForm.value.toDate,
      sportsId:null,
      matchId:null,
      marketId:null,
      pageNo: this.currentPage,
      limit: 50,
    };

    this._accountStatementService._getDownlineAccountsDataApi(body).subscribe((res:any)=>{
      console.log(res);
      this.isLoading = false;
      this.plStatement = res.admin;

    },(err)=>{
      console.log("Error Data",err);
      this.isLoading = false;
    })
  }

  _getAllMembers(){
    this._memberService._getAllMembers().subscribe((data:any)=>{
      console.log('match data',data);
      if(data.allMambers){
        this.allMambers = data.allMambers;
        console.log('data.matchList',data.matchList);
      }
    });
  }

  _getAllMarketTypeList(){
    this._sharedService.getAllMarketTypeList().subscribe((data:any)=>{
      console.log('match data2',data);
      if(data.data){
        this.marketTypeList = data.data;
        console.log('data.matchList',data.matchList);
      }
    });
  }

  getOneAccount(pl){
    console.log(pl)
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

  next(): void {
    this.currentPage++;
    this.getPlStatement();
  }

  prev(): void {
    this.currentPage--;
    this.getPlStatement();
  }

}
