import { Component, OnInit } from '@angular/core';
import { BookManagementService } from '../../services/book-management.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import { Router } from '@angular/router';
import { webSocket } from 'rxjs/webSocket';

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
  realDataWebSocket:any;
  MyPT:boolean = true;

  currentMatchId:any;
  currentSportId:any;
  currentClicked:any;

  loggedInUser:any;

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
    this.onFilterChange({MyPT: true, matchId:null,sportId:null, clicked:'firstTime' });
    this.getPubSubUrl();
    this.loggedInUser = this._sharedService.getUserDetails();
    //console.log('loggedInUser', this.loggedInUser);
  }

  _initForm(){
    this.filterForm = new FormGroup({
      selectedType: new FormControl('MyPT'),
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

  getPubSubUrl(){
    this._sharedService.getUserAdminPubSubApi().subscribe(
      (res: any) => {
        console.log('url',res);
        if(res){
          this.realDataWebSocket = webSocket(res['url']);
          console.log('webSocket',this.realDataWebSocket);
          /*this.getInPlayUpcomingData(); //in-play
          this.getBookMakerData() //bookmaker
          this.getFancyData() //fancy*/
          this.realDataWebSocket.subscribe(
            data => {
              //if(typeof data == 'string') this._updateMarketData(data);
              // if(typeof data == 'string')
              console.log('sub',data);
              if(data.message == "BET_PLACED"){
                if(data.uplineIds.indexOf(this.loggedInUser.userId) != -1){
                  console.log('refresh');
                  this.onFilterChange({MyPT: this.MyPT,matchId:this.currentMatchId,sportId:this.currentSportId, clicked:this.currentClicked });
                } else {
                  console.log('no refresh');
                }
              }
            }, // Called whenever there is a message from the server.
            err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
            () => console.log('complete') // Called when connection is closed (for whatever reason).
          );
        }
      });
  }

  onFilterChange(filterObj){
    this.isLoading = true;
    let body = {};
    let sport_value = this.filterForm.value.sport;
    console.log('this.filterForm',this.filterForm);
    console.log('this.filterForm.value.selectedType',this.filterForm.value.selectedType);
    if(this.filterForm.value.selectedType == 'TotalBook'){
      this.MyPT = false;
    } else {
      this.MyPT = true;
    }
    console.log('this.MyPT',this.MyPT);
    if(filterObj.clicked == 'type'){
      this.currentClicked = 'type';
      this.currentMatchId = this.filterForm.value.matchId;
      this.currentSportId = sport_value;
      body = {
        matchId: this.filterForm.value.matchId,
        sportId: sport_value,
        myPT: this.MyPT
      }
    }
    if(filterObj.clicked == 'sport'){
      this.currentClicked = 'sport';
      this.currentMatchId = null;
      this.currentSportId = filterObj.sport;
      if(filterObj.sport){
      this._getMatchBySportId(filterObj.sport);
      }
      body = {
        sportId: filterObj.sport,
        matchId: null,
        myPT: this.MyPT
      }
    }
    if(filterObj.clicked == 'match'){
      this.currentClicked = 'match';
      this.currentMatchId = filterObj.matchId;
      this.currentSportId = this.filterForm.value.matchId;
      body = {
        sportId: this.filterForm.value.matchId,
        matchId: filterObj.matchId,
        myPT: this.MyPT
      }
    }
    if(filterObj.clicked == 'firstTime'){
      this.currentClicked = 'firstTime';
      this.currentMatchId = filterObj.matchId;
      this.currentSportId = filterObj.sportId;
      body = {
        sportId: filterObj.sportId,
        matchId: filterObj.matchId,
        myPT: this.MyPT
      }
    }
    console.log('body',body);
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

  // redirectUrl(type,id,matchName){
  //   localStorage.setItem('matchName',matchName);
  //   this._router.navigate(['/book-management/advance-workstation/'+type+'/'+id]);
  // }

  redirectUrl(data){
    console.log(data)
    let marketIds = data.map(id=>`${id.marketId}`).join(",");
    console.log(marketIds)

    this._router.navigate(['/book-management/advance-workstation/'+marketIds]);
  }

}
