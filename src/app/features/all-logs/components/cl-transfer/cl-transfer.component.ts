import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cl-transfer',
  templateUrl: './cl-transfer.component.html',
  styleUrls: ['./cl-transfer.component.scss']
})
export class ClTransferComponent implements OnInit {

  clTransfers:any = [];

  constructor() { }

  ngOnInit(): void {
  }


  getClTransfers(){

  }

}
