import { Injectable } from '@angular/core';
import { ApiEndpointsService } from '@core/services/api-endpoint.service';
import { ApiHttpService } from '@core/services/api-http.service';

@Injectable({
  providedIn: 'root'
})
export class BookManagementService {

  constructor(private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService) { }


  _getBookForBackendApi(bookObj){
    return this._apiHttpService.post(this._apiEndpointsService.getBookForBackendEndpoint(),bookObj)
  }

  _getAllUserBetsApi(filterObj){
    return this._apiHttpService.post(this._apiEndpointsService.getAllUserBetsEndpoint(),filterObj)
  }

  _postBooksForAdminBookMgmApi(bodyObj:any){
    return this._apiHttpService.post(this._apiEndpointsService.getBooksForAdminBookMgmEndpoint(),bodyObj)
  }

  _postTotalBookApi(bodyObj:any){
    return this._apiHttpService.post(this._apiEndpointsService.getTotalBookEndpoint(),bodyObj)
  }

  _postLadderDataByMarketApi(bodyObj:any){
    return this._apiHttpService.post(this._apiEndpointsService.getLadderForAdminEndpoint(),bodyObj)
  }

  _postLadderMemberListDataByMarketApi(bodyObj:any){
    return this._apiHttpService.post(this._apiEndpointsService.getLadderForAdminMemberListExposureEndpoint(),bodyObj)
  }

  
}
