import { Component, OnInit } from '@angular/core';
import { BookManagementService } from '../../services/book-management.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-net-exposure',
  templateUrl: './net-exposure.component.html',
  styleUrls: ['./net-exposure.component.scss']
})
export class NetExposureComponent implements OnInit {

  filterForm: FormGroup;
  booksForBackend:any = [];
  isLoading = false;

  constructor(private _bookManagementService:BookManagementService) { }

  ngOnInit(): void {
    this._preConfig();
  }


  _preConfig(){
    this._initForm();
    this.onFilterChange({selectedType:"MyPt",event:"All"});
  }


  _initForm(){
    this.filterForm = new FormGroup({
      selectedType: new FormControl('MyPT'),
      event: new FormControl('All')
    });
  }


  onFilterChange(filterObj){
    let payload = {
      selectedType:filterObj.selectedType,
      event:"All"
    }

    console.log(payload)
    this.isLoading = true;
    this._bookManagementService._getBookForBackendApi(payload).subscribe((res:any)=>{
    this.isLoading = false;
    this.booksForBackend = res.booksForBackend
      console.log(res)
    })
  }

}
