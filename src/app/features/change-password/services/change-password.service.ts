import { Injectable } from '@angular/core';
import { ApiEndpointsService } from '@core/services/api-endpoint.service';
import { ApiHttpService } from '@core/services/api-http.service';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor(private _apiHttpService: ApiHttpService,
    private _apiEndpointsService: ApiEndpointsService ) { }


    _getChangePasswordeApi(authObj){
      return this._apiHttpService.post(this._apiEndpointsService.getChangePasswordEndpoint(),authObj)
    }
}
