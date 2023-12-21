import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { environment } from 'src/environments/environment';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss']
})
export class AppSettingsComponent implements OnInit {

  display:any = '';
  saveSettingObj:any;
  socketStatus = false;
  betStatus:any = false;
  settingObj:any = {
    mobile1:null,
    mobile2:null,
    noticeMessage : ""
  }
  clientId = environment.clientId;
  mobile1 = null;
  mobile2 = null;
  noticeMessage = "";
  isLoading = false;
  submitting = false;


  constructor(private _sharedService:SharedService,private _settingService: SettingsService,) { }

  ngOnInit(): void {
    this.getWebSettings();
    this.getSocketStatus()
    this._getBetStatus();
  }

  closeModal(){
    this.display = 'none';
  }


  getWebSettings(refetch=false){
    if(!refetch){
      this.isLoading = true;
    }
    this._sharedService.getWebSettings().subscribe((res=>{
      this.isLoading = false;
      this.settingObj = JSON.parse(res['webAppSetting'][0].propertyValue)

    }))
  }


  saveWebSettings(){
    this.submitting = true;
    this.saveSettingObj = {
      "propertyValue":this.settingObj,
      "clientId": this.clientId
    }
    this._sharedService.saveWebSettings(this.saveSettingObj).subscribe((res=>{
      this.submitting = false;
      this._sharedService.getToastPopup('Settings saved!',"","success")
      this.getWebSettings(true);
    }),error=>{
      this.submitting = false;
    })
  }



  getSocketStatus(){
    this._sharedService._getPubSubStatusApi().subscribe((res:any)=>{
      console.log(res)
      this.socketStatus = res.status;
    })
  }


  _getBetStatus(){
    this._settingService._getBetStatusApi().subscribe((data:any)=>{
      console.log(data)
      this.betStatus = data.betStatus
    });
  }

  _toggleBetStatus(status){
    console.log(this.betStatus)
    this._settingService._toggleBetApi({allowBet:this.betStatus}).subscribe((res)=>{
      console.log(res)
      this._getBetStatus()
    })
  }


  _toggleSocketStatus(status){
    console.log(this.betStatus)
    this._sharedService._getStartWebJobApi(this.betStatus).subscribe((res)=>{
      console.log(res)
    })
  }
  


  submit(){
    this.saveWebSettings();
  }

}
