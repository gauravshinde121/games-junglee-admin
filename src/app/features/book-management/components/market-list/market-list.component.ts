import { ChangeDetectorRef, Component, HostListener, Input, OnInit, SimpleChanges, ElementRef, ViewChild, OnDestroy  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { webSocket } from 'rxjs/webSocket';
import * as _ from "lodash";
import {Location} from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EMarketType } from '@shared/models/shared';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BookManagementService } from '../../services/book-management.service';

@Component({
  selector: 'app-market-list',
  templateUrl: './market-list.component.html',
  styleUrls: ['./market-list.component.scss']
})
export class MarketListComponent implements OnInit,OnDestroy {

  fancyInterval:any;
  customBookmakerMarkets: any = [];

  subNavList:any =[];
  inPlayUpcomingMarket:any=[];
  bookMakerMarket:any=[];
  fancyMarket:any=[];
  customFancyMarket:any=[];
  lineMarket:any[] = [];
  fancyDelay = 0;
  lineDelay = 0;
  isPageDestroyed = false;
  matchOddRate:any = null;
  bookmakerRate:any = null;
  matchOddRunner:any = [];
  bookmakerRunner:any = null;
  myPT = true;
  realDataWebSocket:any;
  realCustomDataWebSocket:any;
  webSocketUrl:string;

  setResponse:any= {};

  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 0;
  tourId:any;
  matchId:any;
  matchName:string = 'NO MATCH AVAILABLE';

  isBetSlipShow:boolean = false;
  isLoggedIn:boolean = false;

  isBetSlipActive:boolean = false;
  betSlipObj:any = {};
  sports:string;

  EMarketType:typeof EMarketType = EMarketType;
  marketType = EMarketType.MATCH_TYPE;
  placeBetData:any;
  booksForMarket:any;
  booksForBookMakerMarket:any;
  ladderObj:any = {};
  isTVEnable:boolean = false;
  isScoreBoardEnable:boolean = false;
  isMatchLive:number =0;
  isFancyCardShow:boolean = false;
  isLineCardShow = false;
  isMobileView:boolean;
  liveScoreBoardUrl:any;
  liveScoreBoardActaulUrl:any;
  liveScoreBoardActaulTVUrl:any;
  liveStreamingTVUrl:any;
  matchedBets :any[] = [];
  unMatchedBets :any[] = [];
  betListForm: FormGroup;
  timerId: any;


  showFancyMarkets = true;
  showBookmakerMarkets = true;
  showMatchOddMarkets = true;
  showCustomBookmakerMarkets = true;
  showCustomFancyMarkets = true;

  matchOddLastUpdatedAt = new Date();
  bookmakerLastUpdatedAt = new Date();
  fancyLastUpdatedAt = new Date();
  customBookmakerLastUpdatedAt = new Date();
  customFancyLastUpdatedAt = new Date();
  socketSub:Subscription;
  isSocketCompleted = false;
  betList:any = [];
  allBets:any = [];

  oddCount = 0;
  bookmakerCount = 0;
  fancyCount = 0;
  marketList:any = [];
  bookArray:any = [];
  selectedBookRunners:any = [];



  constructor(
    private _sharedService: SharedService,
    private _route: ActivatedRoute,
    private _location: Location,
    private _cdref: ChangeDetectorRef,
    private _sanitizer: DomSanitizer,
    private _fb: FormBuilder,
    private _bookMgmService:BookManagementService
  ) { }


  get f() {
    return this.betListForm.controls;
  }

  ngOnInit(): void {
    this.isSocketCompleted = false;
    this._route.params.subscribe(routeParams =>{
      this.sports = routeParams.sports;
      this.tourId = routeParams.tourId;
      this.matchId = routeParams.matchId;
      this.isSocketCompleted = false;
      this.getInitialMarkets();
    });
    this._preConfig();


    this._sharedService.marketNoticeChanged.subscribe((res)=>{
      this.getNoticeForMarket();
    });

    this._sharedService.markrtStatusChangedSubject.subscribe((res)=>{
      this.getBookMakerData();
      this.getInPlayUpcomingData();
      this.getFancyData(false) //fancy
      this.getCustomMarket();
      this.getCustomFancyMarket();
    });

    this._sharedService.customMarketSubjectSubject.subscribe((res)=>{
      this.getCustomMarket();
      this.getCustomFancyMarket();
    });

  }


  onBookOpened(marketObj){
    this.selectedBookRunners = marketObj.runners;
    this.getUserwiseBooks(marketObj.marketId);
  }


  getUserwiseBooks(marketId){
    this.bookArray = [];
    this._bookMgmService._postUserWiseBookForMarketWatchApi({marketId:marketId,myPT:this.myPT}).subscribe((res:any)=>{
      this.bookArray = res.book;
    })
  }

  private _preConfig(){
    this._initForm();
    this.socketSub = this._sharedService.socketUrlSubject.subscribe(res=>{
      if(res){
        this.realDataWebSocket = webSocket(res['url']);
        // this.realDataWebSocket = webSocket('ws://localhost:8888');
        this._getWebSocketUrl();
      }
    })

    this.realCustomDataWebSocket = webSocket(environment.oddsSocketUrl);
    // this.realDataWebSocket = webSocket('ws://localhost:8888');
    this._subscribeCustomWebSocket();



    this.isMobileViewCallInit();
      this._cdref.detectChanges();

      this.getBetsForMarketWatch();
      this.getMarketForMarketWatch()

      this.callBetTimer();
  }


  restartWebpage() {
    console.log('restart app')
    this.getInitialMarkets();
  }

  isMobileViewCallInit(){
    this.isMobileView =  this._sharedService.isMobileViewFn();

  }


  getInPlayUpcomingData(){

    this._sharedService._postInPlayUpcomingApi({matchId:this.matchId}).subscribe((res:any)=>{
      if(res?.inPlayUpcomingMarket && res['inPlayUpcomingMarket']?.matchName){
          this.matchName =  res['inPlayUpcomingMarket']['matchName'];
          this.isMatchLive = res['inPlayUpcomingMarket']['inPlayStatus'];

          if(res['inPlayUpcomingMarket']['runnerStatus']){
          for(let rnr of res['inPlayUpcomingMarket']['runners']){

            for(let rnrStatus of res['inPlayUpcomingMarket']['runnerStatus']){
              if(rnr.SelectionId == rnrStatus.SelectionId){
                rnr['isSuspended'] = rnrStatus['isSuspended']
              }
            }
          }
        }

          res['inPlayUpcomingMarket']['runners'].map(runnerRes=>{
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
        //merge both centralId
        this.inPlayUpcomingMarket = res['inPlayUpcomingMarket'];
}
    })
  }


  getBookMakerData(){
    this._sharedService._postBookMakerMarketApi({matchId:this.matchId, "typeId":12}).subscribe((res:any)=>{
      if(res.length > 0){

        res.map(sportsObj =>{
          sportsObj['updatedAt'] = new Date().getTime();

          if(sportsObj['runnerStatus']){
            for(let rnr of sportsObj['runners']){
              for(let rnrStatus of sportsObj['runnerStatus']){
                if(rnr.SelectionId == rnrStatus.SelectionId){
                  rnr['isSuspended'] = rnrStatus['isSuspended']
                }
              }
            }
          }


          return sportsObj['runners'].map(runnerRes=>{
            if((runnerRes['batb'] == undefined) || (runnerRes['batl'] == undefined)){
              runnerRes['back1'] = '';
              runnerRes['vback1'] = '';

              runnerRes['lay1'] = '';
              runnerRes['vlay1'] = '';
            }else if(runnerRes['batb']){
              if(runnerRes['batb'][0]!=undefined){
                runnerRes['back0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['odds']: '';
                runnerRes['vback0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['tv']:'';

                runnerRes['lay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['odds']: '';
                runnerRes['vlay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['tv']:'';

                if(runnerRes['back' + 0] == runnerRes['lay' + 0]){
                  runnerRes['showBookMakerSuspended'] = true;
                } else {
                  runnerRes['showBookMakerSuspended'] = false;
                }

                if((runnerRes['back' + 0]>99) || (runnerRes['lay' + 0]>99)){
                  runnerRes['showBookMakerSuspended'] = true;
                } else {
                  runnerRes['showBookMakerSuspended'] = false;
                }
              }
            }

                runnerRes['suspended'] = true;
                return runnerRes;
          })
        })

        this.bookmakerRunner = res[res.length-1]['runners'];
        this.bookmakerRate = res[res.length-1]['lastMarketRate']

        //merge both centralId
        this.bookMakerMarket = res;

        this.checkRateDiff();
      }else{
        this.bookMakerMarket = [];
      }
    })
  }

  getFancyData(calledFromTimer){
    this._sharedService._postFancyMarketApi({matchId:this.matchId}).subscribe((res:any)=>{

      if(res.length > 0){
        this.fancyDelay = res[0].fancyDelay
        res.map(sportsObj =>{
          sportsObj['updatedAt'] = new Date().getTime();
          if(sportsObj['appMarketStatus'] !=4 && sportsObj['appMarketStatus'] !=2) this.isFancyCardShow = true;

                if((sportsObj['batb'] == undefined) || (sportsObj['batl'] == undefined)){
                  sportsObj['back1'] = '';
                  sportsObj['vback1'] = '';

                  sportsObj['lay1'] = '';
                  sportsObj['vlay1'] = '';
                }else{
                  sportsObj['back1'] = sportsObj['batb'][0] !== undefined ? sportsObj['batb'][0]['odds']: '';
                  sportsObj['vback1'] = sportsObj['batb'][0] !== undefined ? sportsObj['batb'][0]['tv']:'';

                  sportsObj['lay1'] = sportsObj['batl'][0] !== undefined ? sportsObj['batl'][0]['odds']: '';
                  sportsObj['vlay1'] = sportsObj['batl'][0] !== undefined ? sportsObj['batl'][0]['tv']:'';
                }

                sportsObj['suspended'] = true;
        })

        if(this.fancyMarket){
          for (let i = this.fancyMarket.length - 1; i >= 0; i--) {
            let newMarket = res.findIndex(mrkt => mrkt.marketId === this.fancyMarket[i].marketId);
            if (newMarket === -1) {
              this.fancyMarket.splice(i, 1);
            }
        }

        const oldFancyMarkets = res.filter(o => this.fancyMarket.some(market => o.marketId === market.marketId));
          if(oldFancyMarkets.length>0){

            for(let market of this.fancyMarket){
              for (let oldMarket of oldFancyMarkets) {
                if(market.marketId == oldMarket.marketId){
                  market.maxBet = oldMarket.maxBet;
                  market.minBet = oldMarket.minBet;
                  market.maxMarketSize = oldMarket.maxMarketSize;
                  market.marketDelay = oldMarket.marketDelay;
                  market.isMarketSuspended = oldMarket.isMarketSuspended
                }
              }
            }
          }


          const newFancyMarkets = res.filter(o => !this.fancyMarket.some(market => o.marketId === market.marketId));
          if(newFancyMarkets.length>0){
            this.fancyMarket.push(...newFancyMarkets);
          }
          // this.fancyMarket = res;


        }
      }else{
        this.fancyMarket = [];
      }
    })
  }

  getUpdatedFancyMarketOnInterval(){
    console.log("called")
    if(this.fancyInterval){
      clearInterval(this.fancyInterval)
    }

   this.fancyInterval =  setInterval(()=>{
      this.getFancyData(true);
    },10000)
  }



  getNoticeForMarket(){
    this._sharedService.getNoticeForUserApi({matchId:this.matchId}).subscribe((res:any)=>{
      if(res.noticeList){
        this._updateMarketWithNotice(res.noticeList)
      }
    })
  }



  _getWebSocketUrl(){
    console.log('get match market subed')
    // this.realDataWebSocket = webSocket('ws://localhost:8888');
    this._subscribeWebSocket();
  }


  getInitialMarkets(){
    this.getInPlayUpcomingData(); //in-play
    this.getCustomMarket();
    this.getCustomFancyMarket();
    if(this.sports == "Cricket"){
      // this._sharedService.markrtStatusChangedSubject.next(this.getBookMakerData());
      // this.getLineMarkets();
      this.getBookMakerData() //bookmaker
      this.getFancyData(false) //fancy
      this.getUpdatedFancyMarketOnInterval(); // Update Fancy Market every 30 seconds
    }
  }


  next(): void {
    this.currentPage++;
    this.onClickAllBet();
    //this._getAllUserInfo(this.selectedRoleId);
  }

  prev(): void {
    this.currentPage--;
    this.onClickAllBet();
    //this._getAllUserInfo(this.selectedRoleId);
  }
  getCustomMarket(){
    let body = {
      "matchId": this.matchId,
      "typeId": 12
    }

    this._sharedService._getCustomMarketApi(body).subscribe((res: any)=>{
      // console.log("Res",res);

      if(res.length > 0){
        res.map(sportsObj =>{
          sportsObj['updatedAt'] = new Date().getTime();
          if(sportsObj['runnerStatus']){
            for(let rnr of sportsObj['runners']){
              for(let rnrStatus of sportsObj['runnerStatus']){
                if(rnr.SelectionId == rnrStatus.SelectionId){
                  rnr['isSuspended'] = rnrStatus['isSuspended']
                }
              }
            }
          }

          return sportsObj['runners'].map(runnerRes=>{
            if((runnerRes['batb'] == undefined) || (runnerRes['batl'] == undefined)){
              runnerRes['back1'] = '';
              runnerRes['vback1'] = '';

              runnerRes['lay1'] = '';
              runnerRes['vlay1'] = '';
            }else if(runnerRes['batb']){
              if(runnerRes['batb'][0]!=undefined){
                runnerRes['back0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['odds']: '';
                runnerRes['vback0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['tv']:'';

                runnerRes['lay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['odds']: '';
                runnerRes['vlay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['tv']:'';

                if(runnerRes['back' + 0] == runnerRes['lay' + 0]){
                  runnerRes['showBookMakerSuspended'] = true;
                } else {
                  runnerRes['showBookMakerSuspended'] = false;
                }
              }
            }

                runnerRes['suspended'] = true;
                return runnerRes;
          })
        })
        //merge both centralId
        this.customBookmakerMarkets = res;

      }else{
        this.customBookmakerMarkets = [];
      }

      this.getNoticeForMarket();
    },(err)=>{
      console.log("Err",err);
    })
  }

  getCustomFancyMarket(){
    let body = {
      "matchId": this.matchId,
      "typeId": 10
    }

    this._sharedService._getCustomMarketApi(body).subscribe((res: any)=>{

      if(res.length > 0){
        this.fancyDelay = res[0].fancyDelay
        res.map(sportsObj =>{
          sportsObj['updatedAt'] = new Date().getTime();
          if(sportsObj['appMarketStatus'] !=4 && sportsObj['appMarketStatus'] !=2) this.isFancyCardShow = true;
            if((sportsObj['batb'] == undefined) || (sportsObj['batl'] == undefined)){
              sportsObj['back1'] = '';
              sportsObj['vback1'] = '';

              sportsObj['lay1'] = '';
              sportsObj['vlay1'] = '';
            }else{
              sportsObj['back1'] = sportsObj['batb'][0] !== undefined ? sportsObj['batb'][0]['odds']: '';
              sportsObj['vback1'] = sportsObj['batb'][0] !== undefined ? sportsObj['batb'][0]['tv']:'';

              sportsObj['lay1'] = sportsObj['batl'][0] !== undefined ? sportsObj['batl'][0]['odds']: '';
              sportsObj['vlay1'] = sportsObj['batl'][0] !== undefined ? sportsObj['batl'][0]['tv']:'';
            }

            sportsObj['suspended'] = true;
        })

        if(this.customFancyMarket){
          for (let i = this.customFancyMarket.length - 1; i >= 0; i--) {
            let newMarket = res.findIndex(mrkt => mrkt.marketId === this.customFancyMarket[i].marketId);
            if (newMarket === -1) {
              this.customFancyMarket.splice(i, 1);
            }
        }

        const oldFancyMarkets = res.filter(o => this.customFancyMarket.some(market => o.marketId === market.marketId));

          if(oldFancyMarkets.length>0){

            for(let market of this.customFancyMarket){
              for (let oldMarket of oldFancyMarkets) {
                if(market.marketId == oldMarket.marketId){
                  market.maxBet = oldMarket.maxBet;
                  market.minBet = oldMarket.minBet;
                  market.maxMarketSize = oldMarket.maxMarketSize;
                  market.marketDelay = oldMarket.marketDelay;
                  market.isMarketSuspended = oldMarket.isMarketSuspended
                }
              }
            }
          }

          const newFancyMarkets = res.filter(o => !this.customFancyMarket.some(market => o.marketId === market.marketId));
          if(newFancyMarkets.length>0){
            this.customFancyMarket.push(...newFancyMarkets);
          }

          this.customFancyMarket.sort((a,b)=>a.sequenceNo - b.sequenceNo)
        }
      }else{
        this.customFancyMarket = []
      }

      this.getNoticeForMarket();
    })
    /*
    this._sportsBookService._getCustomMarketApi(body).subscribe((res: any)=>{
      console.log("Res",res);

      if(res.length > 0){
        res.map(sportsObj =>{

          if(sportsObj['runnerStatus']){
            for(let rnr of sportsObj['runners']){
              for(let rnrStatus of sportsObj['runnerStatus']){
                if(rnr.SelectionId == rnrStatus.SelectionId){
                  rnr['isSuspended'] = rnrStatus['isSuspended']
                }
              }
            }
          }

          return sportsObj['runners'].map(runnerRes=>{
            if((runnerRes['batb'] == undefined) || (runnerRes['batl'] == undefined)){
              runnerRes['back1'] = '';
              runnerRes['vback1'] = '';

              runnerRes['lay1'] = '';
              runnerRes['vlay1'] = '';
            }else if(runnerRes['batb']){
              if(runnerRes['batb'][0]!=undefined){
                runnerRes['back0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['odds']: '';
                runnerRes['vback0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['tv']:'';

                runnerRes['lay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['odds']: '';
                runnerRes['vlay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['tv']:'';

                if(runnerRes['back' + 0] == runnerRes['lay' + 0]){
                  runnerRes['showBookMakerSuspended'] = true;
                } else {
                  runnerRes['showBookMakerSuspended'] = false;
                }
              }
            }

                runnerRes['suspended'] = true;
                return runnerRes;
          })
        })
        //merge both centralId
        this.customBookmakerMarkets = res;

        if(this.customBookmakerMarkets && this.isLoggedIn) this.getBooksForMarket({marketIds :this.customBookmakerMarkets.map(singleMarket=>singleMarket.marketId)},EMarketType.BOOKMAKER_TYPE);
      }



    },(err)=>{
      console.log("Err",err);
    })*/
  }

  private _updateMarketData(data: any) {

    this.checkRateDiff();

    let parseData = JSON.parse(data);
    if(parseData.hasOwnProperty('data') && typeof parseData?.data !== 'string'){
      let webSocketData = parseData['data'];
      if(this.inPlayUpcomingMarket?.matchName){
            let singleWebSocketMarketData = _.find(webSocketData, ['bmi', this.inPlayUpcomingMarket['marketId']]);

            if(singleWebSocketMarketData != undefined){
              this.matchOddRate = singleWebSocketMarketData;
              this.matchOddRunner = this.inPlayUpcomingMarket['runners'];
              this.inPlayUpcomingMarket['appMarketStatus'] = singleWebSocketMarketData['ms'];
              this.showMatchOddMarkets = true;
              this.matchOddLastUpdatedAt = new Date();
              for(let rnr of this.inPlayUpcomingMarket['runners']){
                rnr['back0'] = null;
                rnr['back1'] = null;
                rnr['back2'] = null;
                rnr['lay0'] = null;
                rnr['lay1'] = null;
                rnr['lay2'] = null;
                rnr['vback0'] = null;
                rnr['vback1'] = null;
                rnr['vback2'] = null;
                rnr['vlay0'] = null;
                rnr['vlay1'] = null;
                rnr['vlay2'] = null;
              }

              this.inPlayUpcomingMarket['inPlayStatus'] = singleWebSocketMarketData['ip'];
              this.inPlayUpcomingMarket['runners'].map((runnerRes) => {
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
      }


      if(this.lineMarket){
        this.lineMarket.map(singleLineMarket=>{
          let singleWebSocketMarketData = _.find(webSocketData, ['bmi', singleLineMarket['marketId']]);

        if(singleWebSocketMarketData != undefined){
          singleLineMarket['appMarketStatus'] = singleWebSocketMarketData['ms'];

          for(let rnr of singleLineMarket['runners']){
            rnr['back0'] = null;
            rnr['back1'] = null;
            rnr['back2'] = null;
            rnr['lay0'] = null;
            rnr['lay1'] = null;
            rnr['lay2'] = null;
            rnr['vback0'] = null;
            rnr['vback1'] = null;
            rnr['vback2'] = null;
            rnr['vlay0'] = null;
            rnr['vlay1'] = null;
            rnr['vlay2'] = null;
          }

          singleLineMarket['inPlayStatus'] = singleWebSocketMarketData['ip'];
          singleLineMarket['runners'].map((runnerRes) => {
            let webSocketRunners = _.filter(singleWebSocketMarketData?.['rt'], ['ri', runnerRes['SelectionId']]);
            for (let singleWebsocketRunner of webSocketRunners) {
              if (singleWebsocketRunner['ib']) {
                //back

                //Live Rate
                runnerRes['back' + singleWebsocketRunner['pr']] = Math.round(singleWebsocketRunner['rt']);

                //Volume from Betfair
                runnerRes['vback' + singleWebsocketRunner['pr']] = singleWebsocketRunner['bv'];

              } else {
                //lay

                //Live Rate
                runnerRes['lay' + singleWebsocketRunner['pr']] = Math.round(singleWebsocketRunner['rt']);

                //Volume from Betfair
                runnerRes['vlay' + singleWebsocketRunner['pr']] = singleWebsocketRunner['bv'];

              }
            }
            return runnerRes;
          })
        }
        })

      }

      if(this.bookMakerMarket){
        this.bookMakerMarket.map(bookMakerObj=>{
          let singleWebSocketMarketDataBook = _.find(webSocketData, ['bmi', +bookMakerObj['marketId']]);
          if(singleWebSocketMarketDataBook != undefined){

            this.bookmakerRate = singleWebSocketMarketDataBook;
            this.bookmakerRunner = bookMakerObj['runners'];

            this.showBookmakerMarkets = true;
            this.bookmakerLastUpdatedAt = new Date();

            bookMakerObj['appMarketStatus'] = singleWebSocketMarketDataBook['ms'];
            bookMakerObj['updatedAt'] = new Date().getTime();

            for(let rnr of bookMakerObj['runners']){
              rnr['back0'] = null;
              rnr['lay0'] = null;
              rnr['vback0'] = null;
              rnr['vlay0'] = null;
            }

            return bookMakerObj['runners'].map((runnerRes) => {

              runnerRes['SelectionId'] = runnerRes['SelectionId'].toString();
              let webSocketRunnersBook = _.filter(singleWebSocketMarketDataBook?.['rt'], ['ri', runnerRes['SelectionId']]);
              for (let singleWebsocketRunnerBook of webSocketRunnersBook) {
                // runnerRes['status'] = singleWebsocketRunnerBook['st'];

                if (singleWebsocketRunnerBook['ib']) {
                  //back
                  runnerRes['showBookMakerSuspended'] = false;

                  //Live Rate
                  if(singleWebsocketRunnerBook['rt']){
                    runnerRes['back' + 0] = singleWebsocketRunnerBook['rt']>1?+((singleWebsocketRunnerBook['rt']-1)*100).toFixed(2):+((1-singleWebsocketRunnerBook['rt'])*100).toFixed(2);
                  }else{
                    runnerRes['back' + 0] = null;
                  }

                  //Volume from Betfair

                  if(singleWebsocketRunnerBook['bv']){
                    runnerRes['vback' + 0] = singleWebsocketRunnerBook['bv'];
                  }else{
                    runnerRes['vback' + 0] = null;
                  }

                } else {
                  //lay
                  runnerRes['showBookMakerSuspended'] = false;
                  //Live Rate
                  if(singleWebsocketRunnerBook['rt']){
                    runnerRes['lay' + 0] = singleWebsocketRunnerBook['rt']>1?+((singleWebsocketRunnerBook['rt']-1)*100).toFixed(2):+((1-singleWebsocketRunnerBook['rt'])*100).toFixed(2);
                  }else{
                    runnerRes['lay' + 0] = null;
                  }

                  //Volume from Betfair

                  if(singleWebsocketRunnerBook['bv']){
                    runnerRes['vlay' + 0] = singleWebsocketRunnerBook['bv'];
                  }else{
                    runnerRes['vlay' + 0] = null;
                  }
                }
                // console.log('runnerRes[back0]',runnerRes['back' + 0],'---',runnerRes['lay' + 0]);
                if(runnerRes['back' + 0] == runnerRes['lay' + 0]){
                  runnerRes['showBookMakerSuspended'] = true;
                } else {
                  runnerRes['showBookMakerSuspended'] = false;
                }

                if((runnerRes['back' + 0]>99) || (runnerRes['lay' + 0]>99)){
                  runnerRes['showBookMakerSuspended'] = true;
                } else {
                  runnerRes['showBookMakerSuspended'] = false;
                }
              }
              return runnerRes;
            })
          }
        })
      }

      if(this.fancyMarket){
        this.fancyMarket.map(fancyMarketObj=>{

          let singleWebSocketMarketDataBook = _.find(webSocketData, ['bmi', +fancyMarketObj['marketId']]);
              if(singleWebSocketMarketDataBook != undefined){

                this.showFancyMarkets = true;
                this.fancyLastUpdatedAt = new Date();

                fancyMarketObj['appMarketStatus'] = singleWebSocketMarketDataBook['ms'];
                fancyMarketObj['updatedAt'] = new Date().getTime();

                if(fancyMarketObj['appMarketStatus'] !=4 && fancyMarketObj['appMarketStatus'] !=2) this.isFancyCardShow = true;
                fancyMarketObj['SelectionId'] = fancyMarketObj['SelectionId']?.toString();

                let webSocketRunnersBook = _.filter(singleWebSocketMarketDataBook?.['rt'], ['ri', fancyMarketObj['SelectionId']]);

                for (let singleWebsocketRunnerBook of webSocketRunnersBook) {
                  if (singleWebsocketRunnerBook['ib']) {
                    //back
                    //Live Rate
                    fancyMarketObj['back' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['rt'];

                    //Volume from Betfair
                    fancyMarketObj['vback' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['pt'];

                  } else {
                    //lay

                    //Live Rate
                    fancyMarketObj['lay' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['rt'];

                    //Volume from Betfair
                    fancyMarketObj['vlay' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['pt'];

                  }
                }
                return fancyMarketObj;
              }
        })
      }

      if(this.customFancyMarket){
        this.customFancyMarket.map(fancyMarketObj=>{
          let singleWebSocketMarketDataBook = _.find(webSocketData, ['bmi', fancyMarketObj['marketId']]);
              if(singleWebSocketMarketDataBook != undefined){

                this.showCustomFancyMarkets = true;
                this.customFancyLastUpdatedAt = new Date();

                fancyMarketObj['appMarketStatus'] = singleWebSocketMarketDataBook['ms'];
                fancyMarketObj['updatedAt'] = new Date().getTime();


                if(fancyMarketObj['appMarketStatus'] !=4 && fancyMarketObj['appMarketStatus'] !=2) this.isFancyCardShow = true;
                fancyMarketObj['SelectionId'] = fancyMarketObj['SelectionId']?.toString();
                let webSocketRunnersBook = _.filter(singleWebSocketMarketDataBook?.['rt'], ['ri', fancyMarketObj['SelectionId']]);
                for (let singleWebsocketRunnerBook of webSocketRunnersBook) {
                  if (singleWebsocketRunnerBook['ib']) {
                    //back

                    //Live Rate
                    fancyMarketObj['back' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['rt'];

                    //Volume from Betfair
                    fancyMarketObj['vback' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['pt'];

                  } else {
                    //lay

                    //Live Rate
                    fancyMarketObj['lay' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['rt'];

                    //Volume from Betfair
                    fancyMarketObj['vlay' + singleWebsocketRunnerBook['pr']] = singleWebsocketRunnerBook['pt'];

                  }
                }
                return fancyMarketObj;
              }
        })
      }

      if(this.customBookmakerMarkets){
        this.customBookmakerMarkets.map(bookMakerObj=>{
          let singleWebSocketMarketDataBook = _.find(webSocketData, ['bmi', bookMakerObj['marketId']]);

          if(singleWebSocketMarketDataBook != undefined){

            this.showCustomBookmakerMarkets = true;
            this.customBookmakerLastUpdatedAt = new Date();
            bookMakerObj['updatedAt'] = new Date().getTime();

            bookMakerObj['appMarketStatus'] = singleWebSocketMarketDataBook['ms'];
            bookMakerObj['inPlayStatus'] = singleWebSocketMarketDataBook['ip'];

            for(let rnr of bookMakerObj['runners']){
              rnr['back0'] = null;
              rnr['lay0'] = null;
              rnr['vback0'] = null;
              rnr['vlay0'] = null;
            }

            return bookMakerObj['runners'].map((runnerRes) => {

              runnerRes['SelectionId'] = runnerRes['SelectionId'].toString();
              let webSocketRunnersBook = _.filter(singleWebSocketMarketDataBook?.['rt'], ['ri', runnerRes['SelectionId']]);
              for (let singleWebsocketRunnerBook of webSocketRunnersBook) {
                // runnerRes['status'] = singleWebsocketRunnerBook['st'];

                if (singleWebsocketRunnerBook['ib']) {
                  //back
                  runnerRes['showBookMakerSuspended'] = false;

                  //Live Rate
                  if(singleWebsocketRunnerBook['rt']){
                    //runnerRes['back' + 0] = singleWebsocketRunnerBook['rt']>1?+((singleWebsocketRunnerBook['rt']-1)*100).toFixed(0):+((1-singleWebsocketRunnerBook['rt'])*100).toFixed(0);
                    if (singleWebsocketRunnerBook['rt'] > 1) {
                      runnerRes['back0'] = ((singleWebsocketRunnerBook['rt'] - 1) * 100).toFixed(2);
                    } else {
                      runnerRes['back0'] = ((1 - singleWebsocketRunnerBook['rt']) * 100).toFixed(2);
                    }
                    if (runnerRes['back0'] % 1 === 0 || runnerRes['back0'] % 1 === 0.0) {
                      runnerRes['back0'] = Math.floor(runnerRes['back0']);
                    }
                  }else{
                    runnerRes['back' + 0] = null;
                  }

                  //Volume from Betfair

                  if(singleWebsocketRunnerBook['bv']){
                    runnerRes['vback' + 0] = singleWebsocketRunnerBook['bv'];
                  }else{
                    runnerRes['vback' + 0] = null;
                  }

                } else {
                  //lay
                  runnerRes['showBookMakerSuspended'] = false;
                  //Live Rate
                  if(singleWebsocketRunnerBook['rt']){
                    //runnerRes['lay' + 0] = singleWebsocketRunnerBook['rt']>1?+((singleWebsocketRunnerBook['rt']-1)*100).toFixed(0):+((1-singleWebsocketRunnerBook['rt'])*100).toFixed(0);
                    if (singleWebsocketRunnerBook['rt'] > 1) {
                      runnerRes['lay0'] = ((singleWebsocketRunnerBook['rt'] - 1) * 100).toFixed(2);
                    } else {
                      runnerRes['lay0'] = ((1 - singleWebsocketRunnerBook['rt']) * 100).toFixed(2);
                    }
                    if (runnerRes['lay0'] % 1 === 0 || runnerRes['lay0'] % 1 === 0.0) {
                      runnerRes['lay0'] = Math.floor(runnerRes['lay0']);
                    }
                  }else{
                    runnerRes['lay' + 0] = null;
                  }

                  //Volume from Betfair

                  if(singleWebsocketRunnerBook['bv']){
                    runnerRes['vlay' + 0] = singleWebsocketRunnerBook['bv'];
                  }else{
                    runnerRes['vlay' + 0] = null;
                  }
                }
                // console.log('runnerRes[back0]',runnerRes['back' + 0],'---',runnerRes['lay' + 0]);
                if(runnerRes['back' + 0] == runnerRes['lay' + 0]){
                  runnerRes['showBookMakerSuspended'] = true;
                } else {
                  runnerRes['showBookMakerSuspended'] = false;
                }

              }
              return runnerRes;
            })
          }
        })
      }
    }
  }

  private _updateMarketWithNotice(noticeMessageList:any){
    if(this.customFancyMarket){
      this.customFancyMarket.map(fancyMarketObj=>{
        fancyMarketObj['marketNotice'] = noticeMessageList.filter(nm=>nm.marketId == fancyMarketObj['marketId'])[0]?.marketNotice;
        return fancyMarketObj;
      })
    }

    if(this.customBookmakerMarkets){
      this.customBookmakerMarkets.map(fancyMarketObj=>{
        fancyMarketObj['marketNotice'] = noticeMessageList.filter(nm=>nm.marketId == fancyMarketObj['marketId'])[0]?.marketNotice;
        return fancyMarketObj;
      })
    }
  }

  checkRateDiff(){

    let matchOddRateRunnerWise:any = [];
    let bookmakerRateRunnerWise:any = [];

    if(this.matchOddRate){
      if(this.matchOddRunner && this.matchOddRate.rt){
        for(let rnr of this.matchOddRunner){
            let runnerBackArray = this.matchOddRate.rt.filter(si=>si.ri == rnr.SelectionId && si.ib==true);
            let runnerLayArray = this.matchOddRate.rt.filter(si=>si.ri == rnr.SelectionId && si.ib==false);

            if(runnerBackArray[0]){
              matchOddRateRunnerWise.push({runnername:rnr.RunnerName,backRate:runnerBackArray[0].rt,selectionId:rnr.SelectionId})
            }

            if(runnerLayArray[0]){
              matchOddRateRunnerWise.push({runnername:rnr.RunnerName,layRate:runnerLayArray[0].rt,selectionId:rnr.SelectionId})
            }
      }
      }
    }


    if(this.bookmakerRate){
      if(this.bookmakerRunner && this.bookmakerRate.rt){
        for(let rnr of this.bookmakerRunner){
            let runnerBackArray = this.bookmakerRate.rt.filter(si=>si.ri == rnr.SelectionId && si.ib==true);
            let runnerLayArray = this.bookmakerRate.rt.filter(si=>si.ri == rnr.SelectionId && si.ib==false);

            if(runnerBackArray[0]){
              bookmakerRateRunnerWise.push({runnername:rnr.RunnerName,backRate:runnerBackArray[0].rt,selectionId:rnr.SelectionId})
            }

            if(runnerLayArray[0]){
              bookmakerRateRunnerWise.push({runnername:rnr.RunnerName,layRate:runnerLayArray[0].rt,selectionId:rnr.SelectionId})
            }
      }
      }
    }

    for(let mo of matchOddRateRunnerWise){
      for(let bm of bookmakerRateRunnerWise){
        if(mo.runnername.toLowerCase() == bm.runnername.toLowerCase()){
          if((Math.abs(mo.backRate - bm.backRate) >= 0.18) || (Math.abs(mo.layRate - bm.layRate) >= 0.18)){
            // console.log("difference is grt than 6");
            // console.log(Math.abs(mo.backRate - bm.backRate))

            for(let mrkt of this.bookMakerMarket){
              for(let rnr of mrkt.runners){
                if(rnr.SelectionId == bm.selectionId){
                  rnr['isSuspended'] = true;
                }
              }
            }
          }else if((Math.abs(mo.backRate - bm.backRate) <= 0.18) || (Math.abs(mo.layRate - bm.layRate) <= 0.18)){
            for(let mrkt of this.bookMakerMarket){
              for(let rnr of mrkt.runners){
                if(rnr.SelectionId == bm.selectionId){
                  rnr['isSuspended'] = false;
                }
              }
            }
          }
        }
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
        console.log('err',err)
        console.log(this.isPageDestroyed)
        if(!this.isPageDestroyed)this._getWebSocketUrl();
      }, // Called if at any point WebSocket API signals some kind of error.
      () => {
        console.log('completed')
        console.log(this.isPageDestroyed)
        if(!this.isPageDestroyed){
          this.isSocketCompleted = true;
          this._getWebSocketUrl();
        }
      }
    );
  }

  goBack(){
    this._location.back();
  }


  onClickAllBet(){
    const payload = {
      "matchId":this.matchId,
      "clientName": null,
      "marketTypeId": null,
      "marketId": null,
      "ammountFrom":null,
      "ammountTo":null,
      "limit":15,
      "pageNo":this.currentPage
  }

  this.getMarketForMarketWatch();

    this._sharedService._getBetsForMarketWatchApi(payload).subscribe((res:any)=>{
      this.allBets = [];
      for(let bet of res.booksForBackend){
        if(bet.marketType == 1){
          this.oddCount = bet.betlist.length;
        }
        if(bet.marketType == 12){
          this.bookmakerCount = bet.betlist.length;
        }
        if(bet.marketType == 10){
          this.fancyCount = bet.betlist.length;
        }
        for(let singleBet of bet.betlist){
          this.allBets.push(singleBet)
        }
      }
      const totalCount = res.booksForBackend.reduce((total, obj) => total + obj.betlist.length, 0);
      //console.log('totalCount', totalCount);
      this.totalPages = Math.ceil(totalCount / this.pageSize);
    })
  }


  getMarketForMarketWatch(){

    this._sharedService._getMarketForMarketWatchApi({matchId:this.matchId}).subscribe((res:any)=>{
      if(res){
        this.marketList = res.booksForBackend
      }
    })
  }


  _initForm() {
    this.betListForm = this._fb.group({
      memberName: null,
      marketTypeId: null,
      marketId: null,
      stakesFromValue: [null],
      stakesToValue: [null]
    });
  }


  getBetsForMarketWatch(){

    const payload = {
      "matchId":this.matchId,
      "clientName": null,
      "marketTypeId": null,
      "marketId": null,
      "ammountFrom":null,
      "ammountTo":null,
      "limit":15,
      "pageNo":1
  }

    this._sharedService._getBetsForMarketWatchApi(payload).subscribe((res:any)=>{
      this.betList = [];
      for(let bet of res.booksForBackend){
        if(bet.marketType == 1){
          this.oddCount = bet.betlist.length;
        }
        if(bet.marketType == 12){
          this.bookmakerCount = bet.betlist.length;
        }
        if(bet.marketType == 10){
          this.fancyCount = bet.betlist.length;
        }
        for(let singleBet of bet.betlist){
          this.betList.push(singleBet)
        }
      }

      this.betList.sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime());

      this._postBooksForAdminBookMgmApi()

    })
  }


  _subscribeCustomWebSocket(){
    this.realCustomDataWebSocket.subscribe(
      data => {
        if(typeof data == 'string') this._updateMarketData(data);
        // if(typeof data == 'string') console.log('sub',data);
      }, // Called whenever there is a message from the server.
      err => {
        console.log('err',err)
        console.log(this.isPageDestroyed)
        if(!this.isPageDestroyed)this._subscribeCustomWebSocket();
      }, // Called if at any point WebSocket API signals some kind of error.
      () => {
        console.log('completed')
        console.log(this.isPageDestroyed)
        if(!this.isPageDestroyed){
          this._subscribeCustomWebSocket();
        }
      }
    );
  }




  onSubmit(){

    for (let key in this.betListForm.value) {
      if (this.betListForm.value.hasOwnProperty(key)) {
        if(this.betListForm.value[key]== "null"){
          this.betListForm.value[key] = null
        }
      }
    }
    // console.log(this.betListForm.value);

    const payload = {
      "matchId":this.matchId,
      "clientName": this.betListForm.value.memberName,
      "marketTypeId": this.betListForm.value.marketTypeId,
      "marketId": this.betListForm.value.marketTypeId,
      "ammountFrom":this.betListForm.value.stakesFromValue,
      "ammountTo":this.betListForm.value.stakesToValue,
      "limit":15,
      "pageNo":1
  }

    this._sharedService._getBetsForMarketWatchApi(payload).subscribe((res:any)=>{
      for(let bet of res.booksForBackend){
        if(bet.marketType == 1){
          this.oddCount = bet.betlist.length;
        }
        if(bet.marketType == 12){
          this.bookmakerCount = bet.betlist.length;
        }
        if(bet.marketType == 10){
          this.fancyCount = bet.betlist.length;
        }
        for(let singleBet of bet.betlist){
          this.allBets.push(singleBet)
        }
      }
    })
  }


  callBetTimer(){
    this.timerId = setInterval(()=>{
     this.getBetsForMarketWatch();
    },3000)
  }



  _postBooksForAdminBookMgmApi() {

    let marketIdList = this.betList.map(a=>a.marketId);

    let bookMgmParams = {
      "marketIds": marketIdList,
      "myPT": this.myPT
    }

    this._bookMgmService
      ._postBooksForAdminBookMgmApi(bookMgmParams)
      .subscribe((res: any) => {
        this.matchName = res['matchName'];
        if (res['book'].length > 0) {

          res['book'].map((singleBook) => {

            if(singleBook['marketTypName'] == 'Match Odds'){

              if(this.inPlayUpcomingMarket){
                if(this.inPlayUpcomingMarket.marketId == singleBook.marketId){
                  for(let runner of this.inPlayUpcomingMarket.runners){
                    for(let bookrnr of singleBook.adminBook){
                      if(runner.SelectionId == bookrnr.SelectionId){
                        runner.amount = bookrnr.amount
                      }
                    }
                  }
                }
              }
            }

            if(singleBook['marketTypName'] == 'Bookmaker'){


              for(let market of this.bookMakerMarket){
                if(market.marketId == singleBook.marketId){
                  for(let runner of market.runners){
                    for(let bookrnr of singleBook.adminBook){
                      if(runner.SelectionId == bookrnr.SelectionId){
                        runner.amount = bookrnr.amount
                      }
                    }
                  }
                }
              }

              for(let market of this.customBookmakerMarkets){
                if(market.marketId == singleBook.marketId){
                  for(let runner of market.runners){
                    for(let bookrnr of singleBook.adminBook){
                      if(runner.SelectionId == bookrnr.SelectionId){
                        runner.amount = bookrnr.amount
                      }
                    }
                  }
                }
              }
            }

            if(singleBook['marketTypName'] == 'Fancy'){

              for(let market of this.customFancyMarket){
                if(market.marketId == singleBook.marketId){
                  market.amount = singleBook.adminBook[0]?.amount
                }
              }

              for(let market of this.fancyMarket){
                if(market.marketId == singleBook.marketId){
                  market.amount = singleBook.adminBook[0]?.amount
                }
              }
            }

          });
        }
      });
  }


  checkSuspendCondition(marketObj){
    // const timeDifferenceInSeconds = Math.abs((new Date().getTime() - marketObj['updatedAt']) / 1000);
    // return timeDifferenceInSeconds > 60;
    return false;
  }


  getLadderDataByMarket(marketId){
    this.ladderObj = [];
    this._bookMgmService
      ._postLadderDataByMarketApi({ marketId: marketId, myPt: this.myPT })
      .subscribe((res: any) => {
        this.ladderObj = res?.ladderDetails;
      });
  }



  ngOnDestroy(): void {
    clearInterval(this.fancyInterval);
    clearInterval(this.timerId);

    this.socketSub.unsubscribe()

    if(this.realDataWebSocket){
      this.isPageDestroyed = true;
      this.realDataWebSocket.complete()
    }
  }



}
