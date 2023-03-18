import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import { BookManagementService } from '../../services/book-management.service';

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

  constructor(
    private _sharedService:SharedService,
    private bookManagementService:BookManagementService
  ) { }

  ngOnInit(): void {
    this._preConfig();
    this.betTickerForm.get('gameId')?.valueChanges.subscribe((selectedValue) => {
      console.log('Selected value: ', selectedValue);
      this._getMatchBySportId(selectedValue);
    });

    this.betTickerForm.get('matchId')?.valueChanges.subscribe((selectedValue) => {
      console.log('Selected matchId: ', selectedValue);
      this._getMarketsByMatchId(selectedValue);
    });
  }

  _preConfig(){
    /*alert();console.log('rerrsrr');
    this._sharedService._getGames().subscribe((res:any)=>{
      this.games = res.gamesList;
      console.log('this.games',this.games);
    });*/
    this._initForm();
    this._getGames();

  }

  _initForm(){
    this.betTickerForm = new FormGroup({
      gameId:new FormControl('All'),
      matchId:new FormControl('All'),
      tms:new FormControl('All'),
      type:new FormControl('All'),
      typeName:new FormControl('All'),
      betType:new FormControl("Matched"),
      time:new FormControl("All")
    });
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


  getAllUserBets(){
    let payload = {
      gameId:null,
      sportId:null,
      matchId:null,
      userId:null
    }
    this.bookManagementService._getBookForBackendApi(payload).subscribe((res:any)=>{
      console.log(res)
    })
  }

}
