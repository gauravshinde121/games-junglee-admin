import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccountStatementService } from '../../services/account-statement.service';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-my-pl',
  templateUrl: './my-pl.component.html',
  styleUrls: ['./my-pl.component.scss']
})
export class MyPlComponent implements OnInit {

  filterForm:FormGroup;
  plStatement:any = [];
  games:any;
  matchList:any = [];

  constructor(
    private _accountStatementService:AccountStatementService,
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
    this.__initForm()
    this.getPlStatement();
  }

  __initForm(){
    this.filterForm = new FormGroup({
      fromDate:new FormControl(new Date()),
      toDate:new FormControl(new Date()),
      gameId:new FormControl('All'),
      matchId:new FormControl('All'),
      page:new FormControl(1)
    })
  }

  getPlStatement(){
    this._accountStatementService._getPlBySubgameAPi(this.filterForm.value).subscribe((res:any)=>{
      console.log(res)
      this.plStatement = res.admin;
    })
  }


  _getGames(){
    this._sharedService._getEvents().subscribe((data:any)=>{
      if(data.gamesList){
        this.games = data.gamesList;
        console.log('data.gamesList;',data.gamesList);
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
