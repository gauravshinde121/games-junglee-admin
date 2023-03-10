import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.scss']
})
export class CommissionComponent implements OnInit {

  currentDate = new Date();
  constructor() { }

  ngOnInit(): void {
  }

  searchActivity(){

  }

}
