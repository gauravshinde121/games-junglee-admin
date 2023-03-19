import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MembersService } from 'src/app/features/members/services/members.service';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-surveillance-main',
  templateUrl: './surveillance-main.component.html',
  styleUrls: ['./surveillance-main.component.scss']
})
export class SurveillanceMainComponent implements OnInit {

  filterForm:FormGroup;
  surveillanceData:any = [];
  allMembers:any = [];
  games:any = [];
  matchList:any = [];
  marketList:any = [];

  constructor(
    private _memberService:MembersService,
    private _sharedService:SharedService
  ) { }

  ngOnInit(): void {
    this._preConfig();
    this.filterForm.get('sportsId')?.valueChanges.subscribe((selectedValue) => {
      this._getMatchBySportId(selectedValue);
    });

    this.filterForm.get('matchId')?.valueChanges.subscribe((selectedValue) => {
      this._getMarketByMatchId(selectedValue);
    });
  }


  _preConfig(){
    this._initForm();
    this._getAllMembers();
    this._getGames();
  }

  _initForm(){
    this.filterForm = new FormGroup({
      memberName:new FormControl('0'),
      sportsId:new FormControl('0'),
      matchId:new FormControl('0'),
      marketId:new FormControl('0'),
      fromStake:new FormControl(),
      toStake:new FormControl(),
      currencyType:new FormControl()
    })
  }

  _getGames(){
    this._sharedService._getSports().subscribe((data:any)=>{
      if(data){
        this.games = data;
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

  getSurveillanceData(){
    this._sharedService._getSurveillanceDataApi({...this.filterForm.value}).subscribe((res:any)=>{
      this.surveillanceData = res.data;
    })
  }

  _getMatchBySportId(sportId){
    this._sharedService.getMatchBySportId(sportId).subscribe((data:any)=>{
      if(data.matchList){
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

  clearMember(){
    this.filterForm.controls['memberName'].setValue('0');
  }

}
