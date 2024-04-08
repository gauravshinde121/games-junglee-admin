import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import * as _ from "lodash";

@Component({
  selector: 'app-market-watch',
  templateUrl: './market-watch.component.html',
  styleUrls: ['./market-watch.component.scss']
})
export class MarketWatchComponent implements OnInit {


  inPlayMatchListBySport:any=[];
  upComingMatchListBySport:any=[];
  loadUpcomingMatched = false;
  realDataWebSocket:any;
  webSocketUrl:string;
  setOrUnsetWebSocketParamsObj:any = {
    upcoming:{
      centralIds:[]
    },
    inplay:{
      centralIds:[]
    }
  };
  setResponse:any= {};
  isLoggedIn:boolean = false;
  isMobileView:boolean;
  clientId:any = environment.clientId;
  isCasinoEnabled:boolean = false;
  bannerUrls: string[] = [];
  isPageDestroyed = false;
  showModal: boolean;
  maintenanceMode: boolean = false;
  modalImage:any;
  banners:any;
  socketSub:Subscription;

  constructor(
    private _sharedService: SharedService,
  ) { }

  ngOnInit(): void {
    this.isMobileViewCallInit();

    this.getInPlayUpcomingData({upComing:false}); //in-play
    this.getInPlayUpcomingData({upComing:true});  //upcoming

    this.socketSub = this._sharedService.socketUrlSubject.subscribe(res=>{
      if(res){
        this.realDataWebSocket = webSocket(res['url']);
        this._getWebSocketUrl();
      }
    })
    
  }

  isMobileViewCallInit(){
    this.isMobileView =  this._sharedService.isMobileViewFn();
    this._sharedService.isMobileView.subscribe((res:any)=>{
      this.isMobileView = res;
    })
  }


  _getWebSocketUrl(isComplete = false){

    this._subscribeWebSocket()
  }



  getInPlayUpcomingData(paramsObj){
    this.loadUpcomingMatched = true;
    this._sharedService._postInPlayUpcomingApi(paramsObj).subscribe((res)=>{
      if(res['matchDetails'].length > 0){
         res['matchDetails'][0]['sports'].map(sportsObj =>{

          paramsObj['upComing'] ?
          this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds'] = _.concat(_.map(sportsObj['markets'], 'market.centralId'),this.setOrUnsetWebSocketParamsObj['upcoming']['centralIds']):
          this.setOrUnsetWebSocketParamsObj['inplay']['centralIds'] = _.concat(_.map(sportsObj['markets'], 'market.centralId'),this.setOrUnsetWebSocketParamsObj['inplay']['centralIds']);

          sportsObj['isShowCard'] = false;
          return sportsObj['markets'].map(marketObj=>{
              if(marketObj['market']['appMarketStatus'] !=4 && marketObj['market']['appMarketStatus'] !=2) sportsObj['isShowCard'] = true;
              return marketObj['market']['runners'].map((runnerRes) => {
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

                runnerRes['suspended'] = true;
                return runnerRes;
              })
          })
        })

      }
      paramsObj['upComing'] ?  this.upComingMatchListBySport = res['matchDetails']: this.inPlayMatchListBySport = res['matchDetails'];
      this.loadUpcomingMatched = false;
    })
  }



  private _updateMarketData(data: any) {
    let parseData = JSON.parse(data);
    if(parseData.hasOwnProperty('data') && typeof parseData?.data !== 'string'){
      let webSocketData = parseData['data'];
      if(this.inPlayMatchListBySport.length > 0 && this.inPlayMatchListBySport[0]['sports'].length >0){
        this.inPlayMatchListBySport[0]['sports'].map(sportsObj =>{
          return sportsObj['markets'].map(resObj=>{
              let singleWebSocketMarketData = _.find(webSocketData, ['bmi', resObj['market']['marketId']]);
              if(singleWebSocketMarketData != undefined){
                resObj['market']['appMarketStatus'] = singleWebSocketMarketData['ms'];



                if(resObj['market']['appMarketStatus'] !=4 && resObj['market']['appMarketStatus'] !=2) sportsObj['isShowCard'] = true;
                return resObj['market']['runners'].map((runnerRes) => {

                  runnerRes['back0'] = null;
                  runnerRes['back1'] = null;
                  runnerRes['back2'] = null;
                  runnerRes['vback0'] = null;
                  runnerRes['vback1'] = null;
                  runnerRes['vback2'] = null;

                  runnerRes['lay0'] = null;
                  runnerRes['lay1'] = null;
                  runnerRes['lay2'] = null;
                  runnerRes['vlay0'] = null;
                  runnerRes['vlay1'] = null;
                  runnerRes['vlay2'] = null;


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
                  // if((runnerRes['back0'] !==0 || runnerRes['back1'] !==0 || runnerRes['back2'] !==0)
                  //     || runnerRes['lay0'] !==0 || runnerRes['lay1'] !==0 || runnerRes['lay2'] !==0){
                  //       runnerRes['suspended'] = false;
                  // }
                  return runnerRes;
                })
              }
          })
        })
      }

      if(this.upComingMatchListBySport.length > 0 &&this.upComingMatchListBySport[0]['sports'].length >0){
        this.upComingMatchListBySport[0]['sports'].map(sportsObj =>{
          return sportsObj['markets'].map(resObj=>{
              let singleWebSocketMarketData = _.find(webSocketData, ['bmi', resObj['market']['marketId']]);
              if(singleWebSocketMarketData != undefined){
                resObj['market']['appMarketStatus'] = singleWebSocketMarketData['ms'];
                resObj['market']['inPlayStatus'] = singleWebSocketMarketData['ip'];

                if(singleWebSocketMarketData['ip'] == 1) {
                  this.getInPlayUpcomingData({upComing:false}); //in-play
                  this.getInPlayUpcomingData({upComing:true});  //upcoming
                }

                if(resObj['market']['appMarketStatus'] !=4 && resObj['market']['appMarketStatus'] !=2) sportsObj['isShowCard'] = true;
                return resObj['market']['runners'].map((runnerRes) => {
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
                  // if((runnerRes['back0'] !==0 || runnerRes['back1'] !==0 || runnerRes['back2'] !==0)
                  //     || runnerRes['lay0'] !==0 || runnerRes['lay1'] !==0 || runnerRes['lay2'] !==0){
                  //       runnerRes['suspended'] = false;
                  // }
                  return runnerRes;
                })
              }
          })
        })
      }
    }
  }

  _subscribeWebSocket(){
    this.realDataWebSocket.subscribe(
      data => {
        if(typeof data == 'string') this._updateMarketData(data);
        // if(typeof data == 'string') console.log('sub',data);
      }, // Called whenever there is a message from the server.
      err => {
        console.log('ip err')

        if(!this.isPageDestroyed)this._getWebSocketUrl(true);

      }, // Called if at any point WebSocket API signals some kind of error.
      () => {
        console.log('ip compl')
        console.log(this.isPageDestroyed)
        if(!this.isPageDestroyed)this._getWebSocketUrl(true);
      } // Called when connection is closed (for whatever reason).
    );
  }

}
