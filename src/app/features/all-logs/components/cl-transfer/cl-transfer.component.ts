import { Component, OnInit } from '@angular/core';
import { AllLogsService } from '../../services/all-logs.service';

@Component({
  selector: 'app-cl-transfer',
  templateUrl: './cl-transfer.component.html',
  styleUrls: ['./cl-transfer.component.scss']
})
export class ClTransferComponent implements OnInit {

  clTransfers:any = [];
  isLoading = false;
  currentPage: number = 1;
  totalPages: number = 0;
  pageSize: number = 10;

  constructor(private allLogService:AllLogsService) { }

  ngOnInit(): void {
    this._preConfig()
  }


  _preConfig(){
    this.getClTransfers();
  }


  getClTransfers(){
    this.isLoading = true;
    this.clTransfers = [];
    var body = {
      pageNo: this.currentPage,
      limit: 50,
    }
    this.allLogService._getClTransferApi(body).subscribe((data:any)=>{
      this.isLoading = false;
      if(data.clTransferStatement){
        this.clTransfers = data.clTransferStatement
      }
      this.totalPages = Math.ceil(this.clTransfers.length / this.pageSize);
    })
  }


  next(): void {
    this.currentPage++;
    this.getClTransfers();
  }

  prev(): void {
    this.currentPage--;
    this.getClTransfers();
  }

}
