import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoogleAuthenticationComponent } from './components/google-authentication/google-authentication.component';

const routes: Routes = [
  {path:'google-authentication',component:GoogleAuthenticationComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GoogleAuthenticationRoutingModule { }
