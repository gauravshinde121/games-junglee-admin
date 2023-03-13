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
    this.allLogService._getClTransferEndpoint().subscribe((data:any)=>{
      console.log(data)
      this.isLoading = false;
      if(data.clTransferStatement){
        this.clTransfers = data.clTransferStatement
      }
    })
  }

}
