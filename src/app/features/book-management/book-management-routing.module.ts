import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookManagementMainComponent } from './components/book-management-main/book-management-main.component';
import { NetExposureComponent } from './components/net-exposure/net-exposure.component';

const routes: Routes = [{
  path:'book-management',
  component:BookManagementMainComponent,
  children:[
    {path:'net-exposure', component:NetExposureComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookManagementRoutingModule { }
