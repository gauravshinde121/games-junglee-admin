import { Injectable } from '@angular/core';
import { ApiEndpointsService } from 'src/app/core/services/api-endpoint.service';
import { ApiHttpService } from 'src/app/core/services/api-http.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService) { }


    _updateSuperAdminBalanceApi(amount){
      return this._apiHttpService
      .post(this._apiEndpointsService.getUpdateSuperAdminBalanceEndpoint(),{amount:amount});
    }

    _getAllUserBetsApi(filterObj){
      return this._apiHttpService.post(this._apiEndpointsService.getAllUserBetsEndpoint(),filterObj)
    }

    _deleteBetApi(paramsObj) {
      return this._apiHttpService.post(this._apiEndpointsService.deleteBetEndpoint(),paramsObj)
    }

    _deleteBetAfterMatchApi(paramsObj) {
      return this._apiHttpService.post(this._apiEndpointsService.deleteBetAfterMatchEndpoint(),paramsObj)
    }

    _ifSuspectBetApi(paramsObj) {
      return this._apiHttpService.post(this._apiEndpointsService.ifSuspectBetEndpoint(),paramsObj)
    }
    _getMatchSettingsListApi(filterObj){
      return this._apiHttpService.post(this._apiEndpointsService.getMatchSettingsListEndpoint(),filterObj)
    }

    _getMarketForAdminMarketSettingsListApi(filterObj){
      return this._apiHttpService.post(this._apiEndpointsService.getMarketForAdminMarketSettingsListEndpoint(),filterObj)
    }

    _suspendMarketApi(filterObj){
      return this._apiHttpService.post(this._apiEndpointsService.suspendMarketEndpoint(),filterObj)
    }

    _setBetLimitForMatchApi(filterObj){
      return this._apiHttpService.post(this._apiEndpointsService.setBetLimitForMatchEndpoint(),filterObj)
    }

    _setBetLimitForMarketApi(filterObj){
      return this._apiHttpService.post(this._apiEndpointsService.setBetLimitForMarketEndpoint(),filterObj)
    }

    _setMatchActiveStatusApi(filterObj){
      return this._apiHttpService.post(this._apiEndpointsService.setMatchActiveStatusEndpoint(),filterObj)
    }

    _setMarketStatusForMarketSettingsApi(filterObj){
      return this._apiHttpService.post(this._apiEndpointsService.setMarketStatusForMarketSettingsEndpoint(),filterObj)
    }

    _getBetsApi(filterObj){
      return this._apiHttpService.post(this._apiEndpointsService.getBetsForBetSettingsEndpoint(),filterObj)
    }

    _getVoidBetsApi(filterObj){
      return this._apiHttpService.post(this._apiEndpointsService.getVoidBetsForBetSettingsEndpoint(),filterObj)
    }

    _getDeletedBetAfterResultListApi(filterObj){
      return this._apiHttpService.post(this._apiEndpointsService.getDeletedBetAfterResultListEndpoint(),filterObj)
    }

    _setBetLimitForMultipleMarketApi(filterObj){
      return this._apiHttpService.post(this._apiEndpointsService.setBetLimitForMultipleMarketEndpoint(),filterObj)
    }


    _toggleBetApi(status){
      return this._apiHttpService.post(this._apiEndpointsService.getToggleBetEndpoint(),status)
    }

    _getBetStatusApi(){
      return this._apiHttpService.get(this._apiEndpointsService.getBetStatusEndpoint())
    }
}
