import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccountStatementService } from '../../services/account-statement.service';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-turnover',
  templateUrl: './turnover.component.html',
  styleUrls: ['./turnover.component.scss']
})
export class TurnoverComponent implements OnInit {

  limit:number = 50;
  filterForm:FormGroup;
  plStatement:any = [];
  dateFormat = "yyyy-MM-dd";
  language = "en";
  games:any = [];
  isLoading:boolean = false;
  currentPage: number = 1;
  totalPages: number = 0;
  pageSize:number = 50;
  display = '';
  turnoverDetails:any;
  marketInfo:any;
  betInfo:any;

  sortColumn: string = '';
  sortAscending: boolean = true;// 1: ascending, -1: descending

  fileName= 'Turnover'+'_'+new Date()+'.xlsx';


  constructor(
    private _accountStatementService:AccountStatementService,
    private _sharedService:SharedService
  ) { }

  ngOnInit(): void {
    this._preConfig();
  }

  _preConfig(){
    this._initForm();
    this.getTurnOver();
    this._getGames();
  }


  _initForm(){
    this.filterForm = new FormGroup({
      fromDate:new FormControl(this.formatFormDate(new Date())),
      toDate:new FormControl(this.formatFormDate(new Date())),
      sportsId:new FormControl(null),
    })
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat,this.language);
  }

  getTurnOver(){
    this.isLoading = true;

    let fromDate = new Date(this.filterForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.filterForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    let body = {
      fromDate: fromDate,
      toDate: toDate,
      sportId:this.filterForm.value.sportsId?+this.filterForm.value.sportsId:null,
      pageNo: this.currentPage,
      limit: this.limit,
    }
    this._accountStatementService._getCategoryForTO(body).subscribe((res:any)=>{
      this.plStatement = res.finalList;
      this.isLoading = false;
      this.totalPages = Math.ceil(res.finalList.length / this.pageSize);
      // this.plStatement.map((pl: { event: any; matchName: any; })=>pl.event = pl.matchName)
      // this.plStatement.map((pl: { date: any; matchTime: any; })=>pl.date = pl.matchTime)
    })
  }


  _getGames(){
    this._sharedService._getSports().subscribe((data:any)=>{
      if(data){
        this.games = data;
      }
    });
  }

  getTOForMatch(matchId){
      this._accountStatementService._getTOForMatch({matchId:matchId}).subscribe((res:any)=>{
        this.marketInfo = res;
      });
  }

  getBetDetailsForMatch(matchId){
    this._accountStatementService._getBetDetailForMatch({matchId:matchId}).subscribe((res:any)=>{
      this.betInfo = res.betsForTO;
    });
  }

  next(): void {
    this.currentPage++;
    this.getTurnOver();
  }

  prev(): void {
    this.currentPage--;
    this.getTurnOver();
  }


  closeModal(){
    this.display = 'none';
  }

  exportExcel(){
    let transfetStatemnt : any = []
    this.betInfo.forEach(element => {

      transfetStatemnt.push({
        Member : element.member,
        Placed: element.placeTime,
        MatchedDate:element.placeTime,
        Event : element.event,
        Market:element.market,
        Selection  : element.selection,
        OrderPlaced:element.oddsPlaced,
        OrderMatched:element.oddsPlaced,
        Matched:element.isMatched == true? element.stake:'-',
        Unmatched:element.isMatched == false? element.stake:'-'
      })
    });
    this._sharedService.exportExcel(transfetStatemnt,this.fileName);
    // this._sharedService.exportExcel(this.transferStatements,this.fileName);
 }


  toggleSort(columnName: string) {
    if (this.sortColumn === columnName) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = columnName;
      this.sortAscending = true;
    }
  }

}
