import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { webSocket } from 'rxjs/webSocket';


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


  constructor(
    private _sharedService: SharedService,
    private _router: Router
  ) { }

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

    this.getPubSubUrl();
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
              }
            }, 
            err => {
              console.log(err)
              this.getPubSubUrl();
            }, 
            () => {
              console.log('complete')
              this.getPubSubUrl();
            } 
          );
        }
      });
  }


  ngOnDestroy(): void {
    if (this.realDataWebSocket) this.realDataWebSocket.complete();
  }

}

