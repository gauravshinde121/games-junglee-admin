import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from '../../services/members.service';
import {
  nameValidator,
  ntpOrIpValidator
} from "src/app/shared/classes/validator";
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

  constructor(
    private _memberService:MembersService,
    private route:ActivatedRoute,
    private _sharedService:SharedService,
    private _fb: FormBuilder,
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      this.userId = +params['id'];
    })

    this._preconfig();
    this.filterForm.get('gameId')?.valueChanges.subscribe((selectedValue) => {
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
  }

  _initForm(){
    this.filterForm = this._fb.group({
      fromDate:new FormControl(this.formatDate(new Date())),
      toDate:new FormControl(this.formatDate(new Date())),
      memberName: [
        "",
        {
          validators: [nameValidator("Member Name", 0, 25)],
          updateOn: "change",
        },
      ],
      gameId:new FormControl('All'),
      matchId:new FormControl('All'),
      marketId:new FormControl('All'),
      highlightIp: [
        "",
        {
          validators: [ntpOrIpValidator("Highlight IP", 8, 20)],
          updateOn: "change",
        },
      ],
      page:new FormControl(1),
      stakesFrom:new FormControl('All'),
      stakesTo:new FormControl('All'),
      betType:new FormControl("Matched"),
      time:new FormControl("All")
    });
  }


  getMemberBets(){
    this._memberService._getMemberBetseApi({...this.filterForm.value,userId:this.userId})
      .subscribe((res:any)=>{
      console.log(res)
      if(res){
        this.betList = res.data.betList
      }
    })
  }

  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [day, month, year].join('/');
  }


  _getGames(){
    this._sharedService._getEvents().subscribe((data:any)=>{
      if(data.gamesList){
        this.games = data.gamesList;
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

  onGameSelected(sportId){
    this._getMatchBySportId(sportId);
  }


}
