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

  _searchMembersApi(betsObj){
    return this._apiHttpService.post(this._apiEndpointsService.searchMembersEndpoint(),betsObj)
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

  _getAllMembers(){
    return this._apiHttpService.get(this._apiEndpointsService.getAllMembersEndpoint())
  }

  _getInvalidBetsApi(paramObj){
    return this._apiHttpService
    .post(this._apiEndpointsService.getInvalidBetsEndpoint(),paramObj);
  }

  _getTransferStatementForUserApi(paramObj){
    return this._apiHttpService
    .post(this._apiEndpointsService.getTransferStatementForUserEndpoint(),paramObj);
  }

  _getMemberLoginHistoryApi(paramObj){
    return this._apiHttpService
    .post(this._apiEndpointsService.getMemberLoginHistoryEndpoint(),paramObj);
  }

  _getMemberBooksForBackedApi(paramObj){
    return this._apiHttpService
    .post(this._apiEndpointsService.getMemberBooksForBackendEndpoint(),paramObj);
  }

  _changeMemberStatusApi(paramObj){
    return this._apiHttpService
    .post(this._apiEndpointsService.changeMemberStatusEndpoint(),paramObj);
  }

  _changeMemberPasswordApi(paramObj){
    return this._apiHttpService
    .post(this._apiEndpointsService.changePasswordEndpoint(),paramObj);
  }

  _adjustWinningsForSingleUserApi(paramObj){
    return this._apiHttpService
    .post(this._apiEndpointsService.adjustWinningsForSingleUserEndpoint(),paramObj);
  }

  _getCasinoProviderApi(){
    return this._apiHttpService
    .get(this._apiEndpointsService.getCasinoProvideEndpoint());
  }
}
