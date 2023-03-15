import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-bet-ticker-previous',
  templateUrl: './bet-ticker-previous.component.html',
  styleUrls: ['./bet-ticker-previous.component.scss']
})
export class BetTickerPreviousComponent implements OnInit {

  filterForm: FormGroup;
  games:any;
  matchList:any = [];

  constructor(
    private _sharedService:SharedService
  ) { }

  ngOnInit(): void {
    this._preconfig();
    this.filterForm.get('gameId')?.valueChanges.subscribe((selectedValue) => {
      console.log('Selected value: ', selectedValue);
      this._getMatchBySportId(selectedValue);
    });
  }

  _preconfig(){
    this._sharedService._getGames().subscribe((res:any)=>{
      this.games = res.gamesList;
      console.log('res.gamesList',res.gamesList);
    });
    this._initForm();
    //this._getGames();
  }

  _initForm(){
    this.filterForm = new FormGroup({
      gameId:new FormControl('All'),
      matchId:new FormControl('All')
    });
  }


  _getGames(){
    this._sharedService._getEvents().subscribe((data:any)=>{
      if(data.gamesList){
        this.games = data.gamesList;
        //console.log('this.games',this.games);
      }
    });
  }

  _getMatchBySportId(sportId){
    this._sharedService.getMatchBySportId(sportId).subscribe((data:any)=>{
      if(data.matchList){
        this.matchList = data.matchList;
        console.log('data.matchList',data.matchList);
      }
    });
  }

  onGameSelected(sportId){
    this._getMatchBySportId(sportId);
  }

}
