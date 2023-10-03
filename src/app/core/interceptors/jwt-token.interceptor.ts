import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SharedService } from '@shared/services/shared.service';

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {
  constructor(private _sharedService: SharedService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url !== "https://jsonip.com" && request.url !== "https://ipv4.jsonip.com" && request.url !== "https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_O9SDuoswBQEZ23Act1whK9doGxRSQ&ipAddress=" && !request.url.includes("format=json")) {
      console.log('www',request.url);
      const jwtTokenHeader: { [header: string]: string } = {};

      if (this._sharedService.getJWTToken() !== null && request.url !== "https://jsonip.com" && request.url !== "https://ipv4.jsonip.com" && request.url !== "https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_O9SDuoswBQEZ23Act1whK9doGxRSQ&ipAddress=" && !request.url.includes("format=json")) {
        jwtTokenHeader['Authorization'] = 'Bearer ' + this._sharedService.getJWTToken();
      }

      jwtTokenHeader['X-Client-Domain'] = window.location.hostname;

      const reqWithHeader = request.clone({
        setHeaders: jwtTokenHeader,
      });

      return next.handle(reqWithHeader);
    } else {
      console.log('testtt');
      return next.handle(request);
    }
  }
}
