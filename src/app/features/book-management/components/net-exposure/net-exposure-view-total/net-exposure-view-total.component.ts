import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { BookManagementService } from '../../../services/book-management.service';
import * as _ from "lodash";
import { webSocket } from 'rxjs/webSocket';
import {DomSanitizer} from '@angular/platform-browser'

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
  prevSetOrUnsetWebSocketParamsObj:any =[];
  realDataWebSocket:any;
  myPT:boolean = false;
  refreshCount:number =8;
  resetTimerInterval:any;
  totalBooks:any = [];
  isTVEnable:boolean = false;
  liveStreamingTVUrl:any;
  matchId:any;

  fileName= 'NetExposureViewTotal.xlsx';
  newAdminBooksList:any;

  constructor(
    private _sharedService:SharedService,
    private _bookMgmService:BookManagementService,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // this._initConfig();
    this._getWebSocketUrl();
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

  _getWebSocketUrl(isComplete = false){
    this._sharedService.getWebSocketURLApi().subscribe(
      (res: any) => {
        console.log('url',res);
        if(res){
          this.realDataWebSocket = webSocket(res['url']);
          if(!isComplete){
            this.route.params.subscribe((routeParams)=>{
              let bookMgmParams = {};
              this.payload = {
                pageNo:this.currentPage,
                limit:this.pageSize,
                searchText:this.searchTerm
              };
              if(routeParams['marketIds']){
                bookMgmParams['marketIds'] = routeParams['marketIds'].split(',');
                this.payload['marketIds'] = routeParams['marketIds'].split(',');
              }else{
                bookMgmParams['matchId'] = routeParams['matchId'];
                this.payload['matchId'] = routeParams['matchId'];
              }
              bookMgmParams['myPT'] = this.myPT
              this._postBooksForAdminBookMgmApi(bookMgmParams);
              this._getNetExposureViewTotal();
              this._subscribeWebSocket()
            })
          }
        }
      });
   
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
    let bookMgmParams = {};
    if(this.payload['marketIds']){
      bookMgmParams['marketIds'] = this.payload['marketIds'];
    }else{
      bookMgmParams['matchId'] = this.payload['matchId'];
    }
    this.myPT = bookMgmParams['myPT'] = params;
    this._postBooksForAdminBookMgmApi(bookMgmParams);
  }

  refreshCall(){
    let bookMgmParams = {};
    if(this.payload['marketIds']){
      bookMgmParams['marketIds'] = this.payload['marketIds'];
    }else{
      bookMgmParams['matchId'] = this.payload['matchId'];
    }
    bookMgmParams['myPT'] = this.myPT;

    this._getNetExposureViewTotal();
    if(_.differenceBy(this.newAdminBooksList,this.adminBooksList,'marketName').length > 0){
      this._postBooksForAdminBookMgmApi(bookMgmParams);
    }else{
      this._postBooksForAdminBookMgmRefreshApi(bookMgmParams);
      
    }
  }

  _postBooksForAdminBookMgmRefreshApi(bookMgmParams){
    this._bookMgmService._postBooksForAdminBookMgmApi(bookMgmParams).subscribe((res:any)=>{
      this.newAdminBooksList = res['book']
      if(res['book'].length >0){
        this.setOrUnsetWebSocketParamsObj = [];
        res['book'].map((singleBook)=>{
            this.adminBooksList.map((adminSingleBook)=>{
              if(+singleBook['marketId'] == +adminSingleBook['marketId']){
                adminSingleBook['userBook'] = singleBook['userBook'];
                adminSingleBook['adminBook'].map(sinlgeRunner=>{
                  let runnerRes = _.filter(singleBook['adminBook'], ['SelectionId', sinlgeRunner['SelectionId']]);
                  if(runnerRes.length >0 ) sinlgeRunner['amount'] = runnerRes[0]['amount'];
                  return sinlgeRunner;
                })
              }
              return adminSingleBook;
            })
        })
      }
    })
  }

  _postBooksForAdminBookMgmApi(bookMgmParams){
    this._bookMgmService._postBooksForAdminBookMgmApi(bookMgmParams).subscribe((res:any)=>{
      this.matchName = res['matchName']
      if(res['book'].length >0){
        this.setOrUnsetWebSocketParamsObj = [];
        res['book'].map((singleBook)=>{
          this.matchId = singleBook['marketId'];
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
                if((runnerRes['batb'] == undefined) || (runnerRes['batl'] == undefined)){
                  runnerRes['back0'] ='';
                  runnerRes['vback0'] ='';
    
                  runnerRes['back1'] =  '';
                  runnerRes['vback1'] = '';
    
                  runnerRes['back2'] ='';
                  runnerRes['vback2'] = '';
    
                  runnerRes['lay0'] = '';
                  runnerRes['vlay0'] = '';
    
                  runnerRes['lay1'] =  '';
                  runnerRes['vlay1'] = '';
    
                  runnerRes['lay2'] = '';
                  runnerRes['vlay2'] = '';
    
                }else{
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
                }
              break;

              case 'Bookmaker':
                if((runnerRes['batb'] == undefined) || (runnerRes['batl'] == undefined)){
                  runnerRes['back0'] = '';
                  runnerRes['vback0'] = '';
    
                  runnerRes['lay0'] = '';
                  runnerRes['vlay0'] = '';
                }else{
                runnerRes['back0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['odds']: '';
                runnerRes['vback0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['tv']:'';

                runnerRes['lay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['odds']: '';
                runnerRes['vlay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['tv']:'';
                }
              break;

              case 'Fancy':
                if((runnerRes['batb'] == undefined) || (runnerRes['batl'] == undefined)){
                  runnerRes['back1'] = '';
                  runnerRes['vback1'] = '';
    
                  runnerRes['lay1'] = '';
                  runnerRes['vlay1'] = '';
                }else{
                runnerRes['back1'] = runnerRes['batb'][1] !== undefined ? runnerRes['batb'][1]['odds']: '';
                runnerRes['vback1'] = runnerRes['batb'][1] !== undefined ? runnerRes['batb'][1]['tv']:'';

                runnerRes['lay1'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['odds']: '';
                runnerRes['vlay1'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['tv']:'';
                }
              break;
            }
            return runnerRes;
          })
        })
        this.adminBooksList = res['book'];


        if(this.prevSetOrUnsetWebSocketParamsObj.length !== this.setOrUnsetWebSocketParamsObj.length){
          let setObj = {
            set:{
              deviceId:sessionStorage.getItem('deviceId'),
              centralIdList:this.setOrUnsetWebSocketParamsObj
              }
            }
            let unsetObj = {};
            unsetObj['unset'] = setObj['set']; 
            this._setOrUnsetWebSocketData(unsetObj);
            this._setOrUnsetWebSocketData(setObj);
        }
        this.prevSetOrUnsetWebSocketParamsObj = this.setOrUnsetWebSocketParamsObj;
      }
    })
  }

  private _updateMarketData(data: any) {
    let parseData = JSON.parse(data);
    if(parseData.hasOwnProperty('data') && typeof parseData?.data !== 'string'){
      // console.log('data', JSON.parse(data));
        let webSocketData = parseData['data'];
        if(webSocketData.length >0){
          webSocketData = webSocketData.map((singleItem)=>{
            singleItem['bmi'] = +singleItem['bmi'];
            return singleItem;
          })
        }
        
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
    // this._sharedService._getWebSocketURLByDeviceApi(setOrUnsetWebSocketParamsObj).subscribe(
    //   (res: any) => {
    //     console.log('market',res);
    //     if(res?.token?.url){
    //       this.realDataWebSocket = webSocket(res?.token?.url);
    //       this._subscribeWebSocket()
    //     }
    //   });
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
      this._getWebSocketUrl();
    }
  }

  hideShowTV(){
    this.isTVEnable = !this.isTVEnable;
    if(this.isTVEnable){
      this.startStreamingLiveTV();
    }else{
      this.liveStreamingTVUrl = undefined;
    }
  }

  startStreamingLiveTV(){
    this._sharedService.postLiveStreamForMarket({domain:window.location.hostname,matchId:this.matchId}).subscribe((res:any)=>{
      this.liveStreamingTVUrl = res?.streamObj?.data?.streamingUrl;
      console.log("tv",res);
    })
  }

  ngOnDestroy(): void {
    let unSetObj = {
      unset:{
        deviceId:sessionStorage.getItem('deviceId'),
        centralIdList:this.setOrUnsetWebSocketParamsObj
        }
    }
    this._setOrUnsetWebSocketData(unSetObj);
    // if(this.realDataWebSocket) this.realDataWebSocket.complete();
    if(this.realDataWebSocket) this.realDataWebSocket.unsubscribe();
    clearInterval(this.resetTimerInterval)
  }

  exportExcel(){
    console.log(this.viewTotal)
    let viewtotal : any = []
    this.viewTotal.forEach(element => {
      viewtotal.push({
        username:element.username,
        date : new Date(element.placedDate),
        event: element.event,
        market:element.marketName,
        OrderPlace:element.oddsPlaced,
        selection : element.selectionName,
        OrderPlaced:element.betRate,
        OrderMatched:element.betRate,
        // mathedStake:element.stake,
        // umatchedStake:element.stake,
        profit_Liablity:element.profitLiability
      })
    });
    this._sharedService.exportExcel(viewtotal,this.fileName);
 }

}
