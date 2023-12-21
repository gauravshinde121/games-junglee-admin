import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiEndpointsService } from 'src/app/core/services/api-endpoint.service';
import { ApiHttpService } from 'src/app/core/services/api-http.service';
import { Isports } from '../models/shared';
import { Location } from '@angular/common';
import * as XLSX from 'xlsx';
import { ClipboardService } from 'ngx-clipboard'

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  currentUserIp = new BehaviorSubject({'userIp':''});
  sharedSubject = new Subject();
  getUserBalance = new Subject();
  selectedUserRoleId = new BehaviorSubject({ 'createUserWithRoleId': 7 });
  maxBetMinValue = new BehaviorSubject({ 'value': 100 });
  leftMenuStatus = new BehaviorSubject({ 'leftMenuOpen': true });
  refreshHeader = new BehaviorSubject({ 'value': false });
  callAdminDetails = new Subject();
  private currentAdmin = null;
  ipAddress:any;

  sportsList: Isports[];
  isisExpandedNavSideBar = new BehaviorSubject(true);
  router: any;
  constructor(
    private _toastr: ToastrService,
    private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService,
    private _location: Location,
    private _clipboardService: ClipboardService
  ) {
  }

  public getPreviousUrl() {
    return this._location.back();
  }

  _getAdminDetailsApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getAdminDetailEndpoint());
  }

  _getPlayerListApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getPlayerListEndpoint());
  }

  _getCasinoProviderstApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getCasinoProvidersEndpoint());
  }

  _getAllUsersApi(body) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getAllUserEndpoint(), body);
  }

  _getBankUsersApi(body) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getBankUserEndpoint(), body);
  }


  testFunc(body) {
    return this._apiHttpService
      .post(this._apiEndpointsService.testFuncEndpoint(), body);
  }

  getUplineSummaryApi(userId) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getUplineSummaryEndpoint(), {"userId":userId});
  }

  _getSingleUsersApi(user) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getSingleUserEndpoint(), user);
  }

  _getGames() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getGames());
  }

  _getSports() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getSports());
  }

  _adjustWinningsApi(userList) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getAdjustWinningsEndpoint(), userList);
  }

  _adjustCasinoApi(adjustObj) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getAdjustCasinoEndpoint(), adjustObj);
  }

  copy(text: string){
    this._clipboardService.copy(text)
  }

  getUserByUplineIdApi(reqBody) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getUserByUplineId(), reqBody);
  }

  getToastPopup(errorMsg: string, errorModule: string, errorType: string) {
    switch (errorType) {
      case 'error':
        this._toastr.error(errorMsg, errorModule, {
          progressBar: true
        });
        break;
      case 'info':
        this._toastr.info(errorMsg, errorModule, {
          progressBar: true
        });
        break;
      case 'success':
        this._toastr.success(errorMsg, errorModule, {
          progressBar: true
        });
        break;
    }
  }

  isLoggedIn() {
    return sessionStorage.getItem('GJA_jwtToken') ? true : false;
  }

  getJWTToken() {
    return sessionStorage.getItem('GJA_jwtToken');
  }

  setJWTToken(jwtToken: string) {
    sessionStorage.setItem('GJA_jwtToken', jwtToken)
  }

  getIPApi() {
    return this._apiHttpService.get('https://api.ipify.org?format=json');
  }

  getIPV2Api(ip: any) {
    return this._apiHttpService.get('https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_O9SDuoswBQEZ23Act1whK9doGxRSQ&ipAddress=',ip);
  }

  removeJWTToken() {
    sessionStorage.removeItem('GJA_jwtToken');
  }

  rtnSingleObjFromArrObj(arrObjParams: any, obj: any) {
    let key = Object.keys(obj)[0];
    return arrObjParams.filter(arrObjParam => arrObjParam[key] == obj[key])[0];
  }

  _replaceArrayObject(arr1, arr2, objKey) {
    return arr1.map(obj => arr2.find(o => o[objKey] === obj[objKey]) || obj);
  }

  _removeObjectFromArray(arr1, data) {
    return arr1.filter(obj => obj.key != data.key);
  }
  removeToken() {
    sessionStorage.removeItem('GJA_jwtToken');
  }

  getUserDetails() {
    return JSON.parse(sessionStorage.getItem('GJA_adminDetails') || '{}');
  }

  setUserDetails(adminDetails) {
    sessionStorage.setItem('GJA_adminDetails', JSON.stringify(adminDetails['admin']));
  }

  _addBalance(balanceData) {
    return this._apiHttpService
      .post(this._apiEndpointsService.addBalanceDataEndpoint(), balanceData);
  }

  removeUserDetails() {
    sessionStorage.removeItem('GJA_adminDetails');
  }

  getUserAdminPubSubApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getUserAdminPubSubEndPoint());
  }

  getMatchBySportId(sportId) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getMatchBySportIdEndpoint(), { sportId: sportId });
  }

  getTournamentBySportIdApi(sportId) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getTournamentBySportIdEndpoint(), { sportId: sportId });
  }

  getMatchByTournamentIdApi(id) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getMatchByTournamentIdEndpoint(), { tourId: id });
  }

  getOneAccount(body) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getOneAccountEndpoint(), body);
  }

  _getBetDetailsForWorkStationApi(body) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getBetDetailsForWorkStationEndpoint(), body);
  }

  _getSurveillanceDataApi(body) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getSurveillanceDataEndpoint(), body);
  }

  getMarketsByMatchId(matchId) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getMarketsByMatchIdEndpoint(), { matchId: matchId });
  }

  getAllMarketTypeList() {
    return this._apiHttpService
      .post(this._apiEndpointsService.getAllMarketTypeEndpoint(), {});
  }

  getMarketBySportId(sportId) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getMarketBySportIdEndpoint(), { sportId: sportId });
  }

  _getWebSocketURLByDeviceApi(liveStreamMatchObj: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getWebSocketURLByDevice(), liveStreamMatchObj);
  }

  _getUniqueDeviceKeyApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getUniqueDeviceKey());
  }

  public exportExcel(fileData, fileName) {
    /* pass here the table id */
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(fileData);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName);
  }

  getWebSocketURLApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getWebSocketURLEndpoint());
  }

  postLiveStreamForMarket(liveStreamMatchObj: any) {
    return this._apiHttpService
      .post(this._apiEndpointsService.getLiveStreamMatch(), liveStreamMatchObj);
  }


  getWebSettings(){
    return this._apiHttpService
      .get(this._apiEndpointsService.getWebSettingsEndpoint());
  }


  saveWebSettings(body){
    return this._apiHttpService
      .post(this._apiEndpointsService.saveWebSettingsEndpoint(),body);
  }

  getIPData() {
    return sessionStorage.getItem(('ipdata'));
  }

  getIPApiv2() {
    this._apiHttpService.get('https://api.ipgeolocation.io/getip').subscribe(res=>{
     this.ipAddress = res['ip'];
    })
 }

 getIpAddress(){
   return this.ipAddress || '127.0.0.1';
 }


 _getExposureDetailsApi(userId) {
  return this._apiHttpService
    .post(this._apiEndpointsService.getExposureDetailEndpoint(),{userId});
}


_getCasinoSummaryApi(memberId){
  return this._apiHttpService
    .post(this._apiEndpointsService.getCasinoSummaryEndpoint(),{memberId});
}


_getPubSubStatusApi(){
  return this._apiHttpService
    .get(this._apiEndpointsService.getPubSubStatusEndpoint());
}


_getStartWebJobApi(status){
  return this._apiHttpService
    .post(this._apiEndpointsService.getStartWebJobEndpoint(),{status:status});
}


}

