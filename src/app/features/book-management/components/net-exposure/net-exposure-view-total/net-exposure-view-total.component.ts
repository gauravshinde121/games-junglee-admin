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
  myPT:boolean = false;
  refreshCount:number =8;
  resetTimerInterval:any;
  totalBooks:any = [];

  constructor(
    private _sharedService:SharedService,
    private _bookMgmService:BookManagementService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.matchName = localStorage.getItem('matchName');
    this._initConfig();
    this.resetTimerInterval = setInterval(()=>{
      if(this.refreshCount == 0){
        this.refreshCall();
        this.refreshCount = 9;
      }
      this.refreshCount--;
    },1000)
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
    // this.viewTotal = [];

    this._sharedService._getBetDetailsForWorkStationApi(this.payload).subscribe((data: any) => {
      this.isLoading = false;
      if(data.booksForBackend.length > 0){
        this.viewTotal = data.booksForBackend[0].result;
      }
      this.totalPages = Math.ceil(this.viewTotal.length / this.pageSize);
    });
  }

  getTotalBookViewTotal(marketId,totalBookStatus) {
    if(totalBookStatus){
      this.adminBooksList.map((adminBook)=>{
        if(adminBook['marketId'] == marketId){
          adminBook['totalBook'] = [];
          adminBook['isTotaltotalBookView'] = false;
        }
        return adminBook;
      })
      this.totalBooks.map((singleBook)=>{
        if(singleBook['marketId'] == marketId){
          this.totalBooks = this.totalBooks.filter((item) => item.marketId !== marketId);
        }
        return singleBook;
      })
      return;
    }
    let totalBookParams = {
      marketId:marketId
    };
    this._bookMgmService._postTotalBookApi(totalBookParams).subscribe((data: any) => {
      console.log(data);
      if(data['book'].length >0){
        this.totalBooks.push({marketId:marketId,totalBook:data['book'],isTotaltotalBookView:true});
        this.adminBooksList.map((adminBook)=>{
          if(adminBook['marketId'] == marketId){
            adminBook['totalBook'] = data['book'];
            adminBook['isTotaltotalBookView'] = true;
          }
          return adminBook;
        })
      }
    });
  }
  

  onFilterChange(params){
    this.myPT = params;
    this._postBooksForAdminBookMgmApi(this.payload['marketIds']);
  }

  refreshCall(){
    this._getNetExposureViewTotal();
    this._postBooksForAdminBookMgmApi(this.payload['marketIds']);
  }

  _postBooksForAdminBookMgmApi(marketIdArr){
    let bookMgmParams = {
      marketIds: marketIdArr,
      myPT:this.myPT
    };
    this._bookMgmService._postBooksForAdminBookMgmApi(bookMgmParams).subscribe((res:any)=>{
      if(res['book'].length >0){
        res['book'].map((singleBook)=>{
          singleBook['isExpand'] = true;
          this.setOrUnsetWebSocketParamsObj.push(singleBook.centralId);
          let totalBookMarket = _.find(this.totalBooks, ['marketId', singleBook['marketId']]);
          if(totalBookMarket != undefined){
            singleBook['totalBook'] = totalBookMarket['totalBook']
            singleBook['isTotaltotalBookView'] = totalBookMarket['isTotaltotalBookView']
          } 
          return singleBook['adminBook'].map(runnerRes=>{
            switch(singleBook['marketTypName']){
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

  private _updateMarketData(data: any) {
    let parseData = JSON.parse(data);
    if(parseData.hasOwnProperty('data') && typeof parseData?.data !== 'string'){
      // console.log('data', JSON.parse(data));
        let webSocketData = parseData['data'];
        this.adminBooksList.map((singleBook)=>{
          let singleWebSocketMarketData = _.find(webSocketData, ['bmi', +singleBook['marketId']]);
          if(singleWebSocketMarketData != undefined){
              return singleBook['adminBook'].map((runnerRes) => {
                let webSocketRunners = _.filter(singleWebSocketMarketData?.['rt'], ['ri', runnerRes['SelectionId']]);
                for (let singleWebsocketRunner of webSocketRunners) {
                  if (singleWebsocketRunner['ib']) {
                    //back

                    //Live Rate
                    runnerRes['back' + singleWebsocketRunner['pr']] = singleWebsocketRunner['rt'];

                    //Volume from Betfair
                    runnerRes['vback' + singleWebsocketRunner['pr']] = singleWebsocketRunner['bv'];

                  } else {
                    //lay

                    //Live Rate
                    runnerRes['lay' + singleWebsocketRunner['pr']] = singleWebsocketRunner['rt'];

                    //Volume from Betfair
                    runnerRes['vlay' + singleWebsocketRunner['pr']] = singleWebsocketRunner['bv'];

                  }
                }
                return runnerRes;
              })
          }
      })
    }
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
        if(typeof data == 'string') this._updateMarketData(data);
        // if(typeof data == 'string') console.log('sub',data);
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
    clearInterval(this.resetTimerInterval)
  }

}
