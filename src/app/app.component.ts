import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent  implements OnInit {
  title = 'gamesjunglee';
  isblur:any = false;

  constructor(
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {

    this._sharedService.getIPApi().subscribe(res => {
      this._sharedService.currentUserIp.next(res['ip']);
      console.log('res',res);
    });
    this._sharedService.sharedSubject.subscribe((res:any)=>{
       this.isblur=res['isShowRightSideBar'];
       console.log(res['isShowRightSideBar'])
    })

  }

}

