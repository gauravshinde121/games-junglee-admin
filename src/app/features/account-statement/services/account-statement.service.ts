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

  _getPlayerAccountStatementApi(filterObj){
    return this._apiHttpService
      .post(this._apiEndpointsService.getPlayerAccountStatementEndpoint(),filterObj);
  }

  _getCasinoReportDetailForAdminApi(filterObj){
    return this._apiHttpService
      .post(this._apiEndpointsService.getCasinoReportDetailForAdminEndpoint(),filterObj);
  }

  _getCasinoReportForAdminApi(filterObj){
    let fromDate = new Date(filterObj.fromDate);
    fromDate.setHours(0);
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(filterObj.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    filterObj.fromDate = fromDate;
    filterObj.toDate = toDate;

    return this._apiHttpService
      .post(this._apiEndpointsService.getCasinoReportForAdminEndpoint(),filterObj);
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

  _getAdminAccountStatement(paramObj){
    return this._apiHttpService.post(this._apiEndpointsService.getAdminAccountStatementEndpoint(),paramObj)
  }


  _getCommissionReportEndpoint(paramObj){
    return this._apiHttpService.post(this._apiEndpointsService.getCommissionReportEndpoint(),paramObj)
  }

  _resetCommissionReportEndpoint(paramObj){
    return this._apiHttpService.post(this._apiEndpointsService.getResetCommissionReportEndpoint(),paramObj)
  }
}
