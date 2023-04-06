import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { BookManagementService } from '../../../services/book-management.service';
import * as _ from "lodash";
import { webSocket } from 'rxjs/webSocket';

@Component({
  selector: 'app-net-exposure-view-total',
  templateUrl: './net-exposure-view-total.component.html',
  styleUrls: ['./net-exposure-view-total.component.scss']
})
export class NetExposureViewTotalComponent implements OnInit {

  isLoading = false;
  viewTotal: any = [];
  searchTerm:any = null;
  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 0;
  selectedRoleId = 7;
  matchName:any;
  payload:any;
  adminBooksList:any = [];
  setOrUnsetWebSocketParamsObj:any =[];
  realDataWebSocket:any;

  constructor(
    private _sharedService:SharedService,
    private _bookMgmService:BookManagementService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.matchName = localStorage.getItem('matchName');
    this._initConfig();
  }

  _initConfig(){
    (sessionStorage.getItem('deviceId') === null) ? this._getUniqueDeviceKeyApi(): this._getWebSocketUrl();
  }

  _getUniqueDeviceKeyApi(){
    this._sharedService._getUniqueDeviceKeyApi().subscribe((res:any)=>{
      sessionStorage.setItem('deviceId',res?.deviceId);
      this._getWebSocketUrl();
    })
  }

  _getWebSocketUrl(){
    this.route.params.subscribe((routeParams)=>{
      let marketIdArr = routeParams['marketIds'].split(',');
      this._postBooksForAdminBookMgmApi(marketIdArr);
      this.payload = {
        marketIds:marketIdArr,
        pageNo:this.currentPage,
        limit:this.pageSize,
        searchText:this.searchTerm
      }
      this._getNetExposureViewTotal();
    })
  }


  _getNetExposureViewTotal() {
    this.isLoading = true;
    this.viewTotal = [];

    this._sharedService._getBetDetailsForWorkStationApi(this.payload).subscribe((data: any) => {
      this.isLoading = false;
      if(data.booksForBackend.length > 0){
        this.viewTotal = data.booksForBackend[0].result;
      }
      this.totalPages = Math.ceil(this.viewTotal.length / this.pageSize);
    });
  }

  _postBooksForAdminBookMgmApi(marketIdArr){
    let bookMgmParams = {
      marketIds: marketIdArr,
      myPT:false
    };
    this._bookMgmService._postBooksForAdminBookMgmApi(bookMgmParams).subscribe((res:any)=>{
      if(res['book'].length >0){
        res['book'].map((singleBook)=>{
          singleBook['isExpand'] = true;
          this.setOrUnsetWebSocketParamsObj.push(singleBook.centralId);
          return singleBook['adminBook'].map(runnerRes=>{
            switch(singleBook['marketName']){
              case 'Match Odds':
                runnerRes['back0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['odds']: '';
                runnerRes['vback0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['tv']:'';

                runnerRes['back1'] = runnerRes['batb'][1] !== undefined ? runnerRes['batb'][1]['odds']: '';
                runnerRes['vback1'] = runnerRes['batb'][1] !== undefined ? runnerRes['batb'][1]['tv']:'';

                runnerRes['back2'] = runnerRes['batb'][2] !== undefined ? runnerRes['batb'][2]['odds']: '';
                runnerRes['vback2'] = runnerRes['batb'][2] !== undefined ? runnerRes['batb'][2]['tv']:'';

                runnerRes['lay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['odds']: '';
                runnerRes['vlay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['tv']:'';

                runnerRes['lay1'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['odds']: '';
                runnerRes['vlay1'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['tv']:'';

                runnerRes['lay2'] = runnerRes['batl'][2] !== undefined ? runnerRes['batl'][2]['odds']: '';
                runnerRes['vlay2'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['tv']:'';
              break;

              case 'Bookmaker':
                runnerRes['back0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['odds']: '';
                runnerRes['vback0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['tv']:'';
    
                runnerRes['lay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['odds']: '';
                runnerRes['vlay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['tv']:'';
              break;

              case 'Fancy':
                runnerRes['back1'] = runnerRes['batb'][1] !== undefined ? runnerRes['batb'][1]['odds']: '';
                runnerRes['vback1'] = runnerRes['batb'][1] !== undefined ? runnerRes['batb'][1]['tv']:'';

                runnerRes['lay1'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['odds']: '';
                runnerRes['vlay1'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['tv']:'';
              break;
            }
            return runnerRes;
          })
        })
        this.adminBooksList = res['book'];
        let setObj = {
          set:{
            deviceId:sessionStorage.getItem('deviceId'),
            centralIdList:this.setOrUnsetWebSocketParamsObj
            }
          }
        this._setOrUnsetWebSocketData(setObj);
      }
    })
  }


  _setOrUnsetWebSocketData(setOrUnsetWebSocketParamsObj){
    this._sharedService._getWebSocketURLByDeviceApi(setOrUnsetWebSocketParamsObj).subscribe(
      (res: any) => {
        console.log('market',res);
        if(res?.token?.url){
          this.realDataWebSocket = webSocket(res?.token?.url);
          this._subscribeWebSocket()
        }
      });
  }

  _subscribeWebSocket(){
    this.realDataWebSocket.subscribe(
      data => {
        // if(typeof data == 'string') this._updateMarketData(data);
        if(typeof data == 'string') console.log('sub',data);
      }, // Called whenever there is a message from the server.
      err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      () => console.log('complete') // Called when connection is closed (for whatever reason).
    );
  }

  


  next(): void {
    this.currentPage++;
    this._getNetExposureViewTotal();
  }

  prev(): void {
    this.currentPage--;
    this._getNetExposureViewTotal();
  }

  search(): void {
    if(this.searchTerm.length > 2 || this.searchTerm.length == 0){
      this._getNetExposureViewTotal();
    }
  }

  ngOnDestroy(): void {
    let unSetObj = {
      unset:{
        deviceId:sessionStorage.getItem('deviceId'),
        centralIdList:this.setOrUnsetWebSocketParamsObj
        }
    }
    this._setOrUnsetWebSocketData(unSetObj);
    if(this.realDataWebSocket) this.realDataWebSocket.complete();
  }

}
