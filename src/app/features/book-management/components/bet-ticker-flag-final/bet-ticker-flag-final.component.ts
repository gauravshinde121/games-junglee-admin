import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bet-ticker-flag-final',
  templateUrl: './bet-ticker-flag-final.component.html',
  styleUrls: ['./bet-ticker-flag-final.component.scss']
})
export class BetTickerFlagFinalComponent implements OnInit {

  filterForm: FormGroup;
  games:any;
  matchList:any = [];

  constructor(
    private _sharedService:SharedService
  ) { }

  ngOnInit(): void {

    this._preconfig();
    this.filterForm.get('sportsId')?.valueChanges.subscribe((selectedValue) => {
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
    this._getGames();
  }

  _initForm(){
    this.filterForm = new FormGroup({
      sportsId:new FormControl('All'),
      matchId:new FormControl('All'),
    });
  }

  _getGames(){
    this._sharedService._getSports().subscribe((data:any)=>{
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
