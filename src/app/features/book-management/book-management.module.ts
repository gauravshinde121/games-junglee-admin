import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookManagementRoutingModule } from './book-management-routing.module';
import { BookManagementMainComponent } from './components/book-management-main/book-management-main.component';
import { NetExposureComponent } from './components/net-exposure/net-exposure.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BookManagementMainComponent,
    NetExposureComponent
  ],
  imports: [
    CommonModule,
    BookManagementRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BookManagementModule { }
