import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from '../../services/members.service';

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

  constructor(
    private _memberService:MembersService,
    private route:ActivatedRoute,
    private _sharedService:SharedService
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
    this.filterForm = new FormGroup({
      fromDate:new FormControl(this.formatDate(new Date())),
      toDate:new FormControl(this.formatDate(new Date())),
      gameId:new FormControl('All'),
      keyword:new FormControl('All'),
      page:new FormControl(1),
      matchId:new FormControl('All'),
      tms:new FormControl('All'),
      type:new FormControl('All'),
      typeName:new FormControl('All'),
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

  onGameSelected(sportId){
    this._getMatchBySportId(sportId);
  }


}
