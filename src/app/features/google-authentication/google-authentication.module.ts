import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GoogleAuthenticationRoutingModule } from './google-authentication-routing.module';
import { GoogleAuthenticationComponent } from './components/google-authentication/google-authentication.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    GoogleAuthenticationComponent
  ],
  imports: [
    CommonModule,
    GoogleAuthenticationRoutingModule,
    SharedModule
  ]
})
export class GoogleAuthenticationModule { }
