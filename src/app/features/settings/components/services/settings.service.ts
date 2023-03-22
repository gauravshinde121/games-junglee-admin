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
    
}
