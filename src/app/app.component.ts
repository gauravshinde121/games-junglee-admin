import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { webSocket } from 'rxjs/webSocket';
import { Observable, fromEvent, merge, of } from 'rxjs';
import { mapTo } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'gamesjunglee';
  isblur: any = false;
  realDataWebSocket: any;
  isPageDestroyed = false;
  online$: Observable<boolean>;


  constructor(
    private _sharedService: SharedService,
    private _router: Router
  ) { 

    this.online$ = merge(

      of(navigator.onLine),

      fromEvent(window, 'online').pipe(mapTo(true)),

      fromEvent(window, 'offline').pipe(mapTo(false))

    );

  }

  ngOnInit(): void {
    this._sharedService.currentUserIp.next({
      'userIp': this._sharedService.getIpAddress()
    });

    this._sharedService.getIPApiv2();
    /*this._sharedService.getIPApi().subscribe(res => {
      this._sharedService.currentUserIp.next({
        'userIp': res['ip']
      });
    });*/
    this._sharedService.sharedSubject.subscribe((res: any) => {
      this.isblur = res['isShowRightSideBar'];
    })

    this.getWebSocketUrl();
    

    this.online$.subscribe((isOnline) =>{
      if(isOnline) {
        // console.log(isOnline);
        this.isPageDestroyed = false;
        this.getPubSubUrl();
        } else {
          // console.log("you are offline");
          // console.log(isOnline);
          this.isPageDestroyed = true;
        }
    });
  }



  getPubSubUrl() {
    this._sharedService.getUserAdminPubSubApi().subscribe(
      (res: any) => {
        if (res) {
          this.realDataWebSocket = webSocket(res['url']);
         
          this.realDataWebSocket.subscribe(
            data => {
              const user = this._sharedService.getUserDetails();
              if (data.message == "PASSWORD_CHANGED" && data.userId == user.userId) {
                this._sharedService.removeJWTToken();
                this._sharedService.removeUserDetails();
                localStorage.clear();
                this._router.navigate(['/login']);
              }if (data.message == "STATUS_CHANGED" && data.userId == user.userId) {
                this._sharedService.removeJWTToken();
                this._sharedService.removeUserDetails();
                localStorage.clear();
                this._router.navigate(['/login']);
              }if (data.message == "CUSTOM_MARKET_STATUS_CHANGED") {
                this._sharedService.customMarketSubjectSubject.next(true);
              }if (data.message == "MARKET_NOTICE") {
                this._sharedService.marketNoticeChanged.next(true);
              }
            }, 
            err => {
              console.log(err)
              if(!this.isPageDestroyed){
                this.getPubSubUrl();
              }
            }, 
            () => {
              console.log('complete')
              if(!this.isPageDestroyed){
                this.getPubSubUrl();
              }
            } 
          );
        }
      });
  }


  getWebSocketUrl(){
    this._sharedService.getWebSocketURLApi().subscribe(url=>{
      console.log(url)
      this._sharedService.socketUrlSubject.next(url)
    })
  }


  ngOnDestroy(): void {
    if (this.realDataWebSocket) this.realDataWebSocket.complete();
  }

}

