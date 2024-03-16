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
  }

  isMobileViewCallInit(){
    this.isMobileView =  this._sharedService.isMobileViewFn();
    this._sharedService.isMobileView.subscribe((res:any)=>{
      this.isMobileView = res;
    })
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

}
