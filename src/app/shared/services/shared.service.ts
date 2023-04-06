import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Subject } from 'rxjs';
import { ApiEndpointsService } from 'src/app/core/services/api-endpoint.service';
import { ApiHttpService } from 'src/app/core/services/api-http.service';
import { Isports } from '../models/shared';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  sharedSubject=new Subject();
  getUserBalance = new Subject();
  selectedUserRoleId = new BehaviorSubject( {'createUserWithRoleId': 7} );
  maxBetMinValue = new BehaviorSubject( {'value': 100} );
  leftMenuStatus = new BehaviorSubject( {'leftMenuOpen': true} );
  private currentAdmin = null;

  sportsList:Isports[];
  isisExpandedNavSideBar = new BehaviorSubject(true);
  router: any;
  constructor(
    private _toastr: ToastrService,
    private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService,
    private _location:Location
  ) {
  }

   public getPreviousUrl(){
    return this._location.back();
  }

  _getAdminDetailsApi() {
    return this._apiHttpService
      .get(this._apiEndpointsService.getAdminDetailEndpoint());
  }

  _getAllUsersApi(body){
    return this._apiHttpService
      .post(this._apiEndpointsService.getAllUserEndpoint(),body);
  }

  testFunc(body){
    return this._apiHttpService
      .post(this._apiEndpointsService.testFuncEndpoint(),body);
  }

  _getSingleUsersApi(user){
    return this._apiHttpService
      .post(this._apiEndpointsService.getSingleUserEndpoint(),user);
  }

  _getGames(){
    return this._apiHttpService
    .get(this._apiEndpointsService.getGames());
  }

  _getSports(){
    return this._apiHttpService
    .get(this._apiEndpointsService.getSports());
  }

  _adjustWinningsApi(userList){
    return this._apiHttpService
    .post(this._apiEndpointsService.getAdjustWinningsEndpoint(),userList);
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

  isLoggedIn(){
    return sessionStorage.getItem('GJA_jwtToken') ? true: false;
  }

  getJWTToken() {
    return sessionStorage.getItem('GJA_jwtToken');
  }

  setJWTToken(jwtToken:string){
    sessionStorage.setItem('GJA_jwtToken',jwtToken)
  }

  getIPApi(){
    return this._apiHttpService.get('https://jsonip.com');
  }

  removeJWTToken(){
    sessionStorage.removeItem('GJA_jwtToken');
  }

  rtnSingleObjFromArrObj(arrObjParams:any, obj:any) {
    let key = Object.keys(obj)[0];
    return arrObjParams.filter(arrObjParam => arrObjParam[key] == obj[key])[0];
  }

  _replaceArrayObject(arr1, arr2,objKey) {
    return arr1.map(obj => arr2.find(o => o[objKey] === obj[objKey]) || obj);
  }

  _removeObjectFromArray(arr1,data){
    return arr1.filter(obj => obj.key != data.key);
  }
  removeToken(){
    sessionStorage.removeItem('GJA_jwtToken');
  }

  getUserDetails() {
    return JSON.parse(sessionStorage.getItem('GJA_adminDetails') || '{}');
  }

  setUserDetails(adminDetails){
    sessionStorage.setItem('GJA_adminDetails',JSON.stringify(adminDetails['admin']));
  }

  _addBalance(balanceData){
    return this._apiHttpService
    .post(this._apiEndpointsService.addBalanceDataEndpoint(),balanceData);
  }

  removeUserDetails(){
    sessionStorage.removeItem('GJA_adminDetails');
  }

  getUserAdminPubSubApi(){
    return this._apiHttpService
      .get(this._apiEndpointsService.getUserAdminPubSubEndPoint());
  }

  getMatchBySportId(sportId){
    return this._apiHttpService
      .post(this._apiEndpointsService.getMatchBySportIdEndpoint(),{sportId:sportId});
  }

  getOneAccount(body){
    return this._apiHttpService
      .post(this._apiEndpointsService.getOneAccountEndpoint(),body);
  }

  _getBetDetailsForWorkStationApi(body){
    return this._apiHttpService
      .post(this._apiEndpointsService.getBetDetailsForWorkStationEndpoint(),body);
  }

  _getSurveillanceDataApi(body){
    return this._apiHttpService
      .post(this._apiEndpointsService.getSurveillanceDataEndpoint(),body);
  }

  getMarketsByMatchId(matchId){
    return this._apiHttpService
      .post(this._apiEndpointsService.getMarketsByMatchIdEndpoint(),{matchId:matchId});
  }

  getAllMarketTypeList(){
    return this._apiHttpService
    .post(this._apiEndpointsService.getAllMarketTypeEndpoint(),{});
  }

  getMarketBySportId(sportId){
    return this._apiHttpService
    .post(this._apiEndpointsService.getMarketBySportIdEndpoint(),{sportId:sportId});
  }

}

