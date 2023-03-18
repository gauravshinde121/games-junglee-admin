import { Component, OnInit } from '@angular/core';
import { BookManagementService } from '../../services/book-management.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-net-exposure',
  templateUrl: './net-exposure.component.html',
  styleUrls: ['./net-exposure.component.scss']
})
export class NetExposureComponent implements OnInit {

  filterForm: FormGroup;
  booksForBackend:any = [];
  isLoading = false;
  games:any;
  matchList:any = [];
  selectedType:any;
  sport:any;

  constructor(
    private _bookManagementService:BookManagementService,
    private _sharedService:SharedService
  ) { }

  ngOnInit(): void {
    this._preConfig();
  }

  _preConfig(){
    this._getGames();
    this._initForm();
    this.onFilterChange({selectedType:"MyPt",event:"0"});
  }

  _initForm(){
    this.filterForm = new FormGroup({
      selectedType: new FormControl('MyPT'),
      sport: new FormControl('0'),
      matchId: new FormControl('0')
    });
  }

  onFilterChange(filterObj){
    this.isLoading = true;
    let payload = {};
    var sport_value = this.filterForm.value.sport;
    if(filterObj.clicked == 'type'){
      payload = {
        selectedType: filterObj.selectedType,
        matchId: this.filterForm.value.matchId,
        gameId: sport_value
      }
    }
    if(filterObj.clicked == 'sport'){
      this._getMatchBySportId(filterObj.sport);
      payload = {
        selectedType: this.filterForm.value.selectedType,
        gameId: filterObj.sport,
        matchId: 0
      }
    }
    if(filterObj.clicked == 'match'){
      payload = {
        selectedType: this.filterForm.value.selectedType,
        gameId: this.filterForm.value.matchId,
        matchId: filterObj.matchId
      }
    }

    console.log('payload',payload)
    this._bookManagementService._getBookForBackendApi(payload).subscribe((res:any)=>{
    this.isLoading = false;
    this.booksForBackend = res.booksForBackend
      console.log(res)
    })
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
      }
    });
  }

}
