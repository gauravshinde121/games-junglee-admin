import { Injectable } from '@angular/core';
import { ApiEndpointsService } from '@core/services/api-endpoint.service';
import { ApiHttpService } from '@core/services/api-http.service';

@Injectable({
  providedIn: 'root'
})
export class AccountStatementService {

  constructor(private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService,) { }


  _getTransferStatementApi(filterObj){
    return this._apiHttpService
      .post(this._apiEndpointsService.getTransferStatementEndpoint(),filterObj);
  }


  _getPlBySubgameAPi(filterObj){
    return this._apiHttpService
    .post(this._apiEndpointsService.getPlBySubgame(),filterObj);
  }

  _getDownlineAccountsDataApi(filterObj){
    return this._apiHttpService.post(this._apiEndpointsService.getDownlineAccountsDataEndpoint(),filterObj)
  }

  _getCategoryForTO(filterObj){
    return this._apiHttpService.post(this._apiEndpointsService.getCategoryForTO(),filterObj)
  }

  _getTOForMatch(filterObj){
    return this._apiHttpService.post(this._apiEndpointsService.getTOForMatch(),filterObj)
  }

  _getBetDetailForMatch(filterObj){
    return this._apiHttpService.post(this._apiEndpointsService.getBetsForMatch(),filterObj)
  }

  _getUserBetsForAdminMyPLApi(filterObj){
    return this._apiHttpService.post(this._apiEndpointsService.getUserBetsForAdminMyPLEndpoint(),filterObj)
  }

  _getDownlineAccountsData(paramObj){
    return this._apiHttpService.post(this._apiEndpointsService.getDownlineAccountsDataEndpoint(),paramObj)
  }
}
