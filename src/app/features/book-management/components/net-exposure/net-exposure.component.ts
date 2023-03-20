import { Component, OnInit } from '@angular/core';
import { BookManagementService } from '../../services/book-management.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import { Router } from '@angular/router';

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
    private _sharedService:SharedService,
    private _router:Router
  ) { }

  ngOnInit(): void {
    this._preConfig();
  }

  _preConfig(){
    this._getGames();
    this._initForm();
    this.onFilterChange({selectedType:"MyPt",matchId:null,sportId:null, clicked:'firstTime' });
  }

  _initForm(){
    this.filterForm = new FormGroup({
      selectedType: new FormControl('MyPT'),
      sport: new FormControl(null),
      matchId: new FormControl(null)
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
        sportId: sport_value
      }
    }
    if(filterObj.clicked == 'sport'){
      this._getMatchBySportId(filterObj.sport);
      body = {
        selectedType: this.filterForm.value.selectedType,
        sportId: filterObj.sport,
        matchId: null
      }
    }
    if(filterObj.clicked == 'match'){
      body = {
        selectedType: this.filterForm.value.selectedType,
        sportId: this.filterForm.value.matchId,
        matchId: filterObj.matchId
      }
    }
    if(filterObj.clicked == 'firstTime'){
      body = {
        selectedType: filterObj.selectedType,
        sportId: filterObj.sportId,
        matchId: filterObj.matchId
      }
    }

    this._bookManagementService._getBookForBackendApi(body).subscribe((res:any)=>{
      this.isLoading = false;
      for (let index = 0; index < res.booksForBackend.length; index++) {
        if (res.booksForBackend[index].data.length > 1) {
         let obj = res.booksForBackend[index].data.find(
          (obj) => obj.fancyFlag == true
          );
           if (obj)
           res.booksForBackend[index].data[0].fancyExposure = obj.netExposure;
         }
         res.booksForBackend[index].data = res.booksForBackend[index].data.filter(obj => obj.fancyFlag == false)
       }
       this.booksForBackend = res.booksForBackend;
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

  redirectUrl(type,id,matchName){
    localStorage.setItem('matchName',matchName);
    this._router.navigate(['/book-management/advance-workstation/'+type+'/'+id]);
  }

}
