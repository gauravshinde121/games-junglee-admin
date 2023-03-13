import { Injectable } from '@angular/core';
import { ApiEndpointsService } from 'src/app/core/services/api-endpoint.service';
import { ApiHttpService } from 'src/app/core/services/api-http.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  constructor(
    private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService
    ) { }

  _updateGameControlApi(gameControls){
    return this._apiHttpService
    .post(this._apiEndpointsService.updateGameControlEndpoint(),gameControls);
  }

  _updateSportsControlApi(sportsControls){
    return this._apiHttpService
    .post(this._apiEndpointsService.updateSportsControlEndpoint(),sportsControls);
  }

  _getMemberActivityApi(activityObj){
    return this._apiHttpService.post(this._apiEndpointsService.getMemberActivityEndpoint(),activityObj)
  }

  _getMemberBalanceApi(balanceObj){
    return this._apiHttpService.post(this._apiEndpointsService.getMemberBalanceEndpoint(),balanceObj)
  }

  _getMemberBetseApi(betsObj){
    return this._apiHttpService.post(this._apiEndpointsService.getMemberBetsEndpoint(),betsObj)
  }

  _getTransferStatementApi(paramObj){
    return this._apiHttpService.post(this._apiEndpointsService.getTransferStatementEndpoint(),paramObj)
  }

  _getDownlineAccountsDataForMemberApi(paramObj){
    return this._apiHttpService.post(this._apiEndpointsService.getDownlineAccountsDataForMembersEndpoint(),paramObj)
  }

  _getCreateNewUserApi(user){
    return this._apiHttpService
      .post(this._apiEndpointsService.getCreateNewUserEndpoint(),user);
  }

  _getEditUserApi(user){
    return this._apiHttpService
      .post(this._apiEndpointsService.getEditUserEndpoint(),user);
  }

  _getRolesApi(){
    return this._apiHttpService.get(this._apiEndpointsService.getRolesEndpoint())
  }

}
