import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss']
})
export class AppSettingsComponent implements OnInit {

  display:any = '';
  saveSettingObj:any;
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


  constructor(private _sharedService:SharedService) { }

  ngOnInit(): void {
    this.getWebSettings();
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


  submit(){
    this.saveWebSettings();
  }

}
