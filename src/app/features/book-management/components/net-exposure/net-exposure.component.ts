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
    this.onFilterChange({matchId:null,sportId:null, clicked:'firstTime' });
  }

  _initForm(){
    this.filterForm = new FormGroup({
      sport: new FormControl(null),
      matchId: new FormControl(null)
    });
  }

  onFilterChangeDropDown(event){
    this.isLoading = true;
    let body = {};
    body = {
      sportId: this.filterForm.value.matchId,
      matchId: event.value
    }
    this._bookManagementService._getBookForBackendApi(body).subscribe((res:any)=>{
      this.alterData(res);
    })
  }

  onFilterChange(filterObj){
    this.isLoading = true;
    let body = {};
    let sport_value = this.filterForm.value.sport;
    if(filterObj.clicked == 'type'){
      body = {
        matchId: this.filterForm.value.matchId,
        sportId: sport_value
      }
    }
    if(filterObj.clicked == 'sport'){
      if(filterObj.sport){
      this._getMatchBySportId(filterObj.sport);
      }
      body = {
        sportId: filterObj.sport,
        matchId: null
      }
    }
    if(filterObj.clicked == 'match'){
      body = {
        sportId: this.filterForm.value.matchId,
        matchId: filterObj.matchId
      }
    }
    if(filterObj.clicked == 'firstTime'){
      body = {
        sportId: filterObj.sportId,
        matchId: filterObj.matchId
      }
    }
    this._bookManagementService._getBookForBackendApi(body).subscribe((res:any)=>{
      // this.alterData(res);
      this.booksForBackend = res.booksForBackend;
     this.isLoading = false;
    },
    ()=>this.isLoading = false,
    ()=>this.isLoading = false
    )

  }

  alterData(res){
    this.isLoading = true;
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
     this.isLoading = false;
  }

  _getGames(){
    this.isLoading=true;
    this._sharedService._getSports().subscribe((data:any)=>{
      if(data){
        this.games = data;
      }
    //this.isLoading = false;
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
