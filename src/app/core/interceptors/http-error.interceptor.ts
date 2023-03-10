import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
//for catch:
import { catchError, finalize } from 'rxjs/operators';
import { SharedService } from '@shared/services/shared.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Constants } from '@config/constant';
import * as _ from "lodash";
import { Router } from '@angular/router';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private _sharedService: SharedService,
    private _ngxLoader:NgxUiLoaderService,
    private _constant:Constants,
    private _router:Router
    ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse)=>{
        console.log('hello',err);
        if(err['status'] === 401){
          console.log("inside unauthorize")
          this._sharedService.removeJWTToken();
          // this._router.navigate(['/home'])
        }
        if(err['error'] !== null){
          this._sharedService.getToastPopup(err['error']['message'],err['statusText'],'error');
        }else{
          this._sharedService.getToastPopup(err['message'],err['statusText'],'error');
        }
        return EMPTY;
      }),
      finalize(()=>{
      })
    );
  }
}
