import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-all-bets',
  templateUrl: './all-bets.component.html',
  styleUrls: ['./all-bets.component.scss']
})
export class AllBetsComponent implements OnInit {

  filterForm: FormGroup;
  isLoading:boolean = false;
  betList:any = [];

  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 0;
  limit:number = 50;

  constructor() { }

  ngOnInit(): void {
  }

  next(): void {
    this.currentPage++;
    this.getMemberBets();
  }

  prev(): void {
    this.currentPage--;
    this.getMemberBets();
  }

  getMemberBets(){

  }

}
