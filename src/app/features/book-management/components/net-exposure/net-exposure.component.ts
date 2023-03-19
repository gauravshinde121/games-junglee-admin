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
    let body = {};
    var sport_value = this.filterForm.value.sport;
    if(filterObj.clicked == 'type'){
      body = {
        selectedType: filterObj.selectedType,
        matchId: this.filterForm.value.matchId,
        sportsId: sport_value
      }
    }
    if(filterObj.clicked == 'sport'){
      this._getMatchBySportId(filterObj.sport);
      body = {
        selectedType: this.filterForm.value.selectedType,
        sportsId: filterObj.sport,
        matchId: 0
      }
    }
    if(filterObj.clicked == 'match'){
      body = {
        selectedType: this.filterForm.value.selectedType,
        sportsId: this.filterForm.value.matchId,
        matchId: filterObj.matchId
      }
    }

    console.log('body',body)
    this._bookManagementService._getBookForBackendApi(body).subscribe((res:any)=>{
      this.isLoading = false;
      //this.booksForBackend = res.booksForBackend
      //console.log(res)

      for (let index = 0; index < res.booksForBackend.length; index++) {
        if (res.booksForBackend[index].data.length > 1) {
         let obj = res.booksForBackend[index].data.find(
          (obj) => obj.fancyFlag == true
          );
           if (obj)
           res.booksForBackend[index].data[0].fancyExposure = obj.netExposure;
         }
         res.booksForBackend[index].data = res.booksForBackend[index].data.filter(obj => obj.fancyFlag == false)
          console.log(res.booksForBackend[index].data)
       }

    })

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

}
