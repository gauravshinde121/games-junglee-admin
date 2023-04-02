import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-net-exposure-view-total',
  templateUrl: './net-exposure-view-total.component.html',
  styleUrls: ['./net-exposure-view-total.component.scss']
})
export class NetExposureViewTotalComponent implements OnInit {

  isLoading = false;
  viewTotal: any = [];
  searchTerm:any;
  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 0;
  selectedRoleId = 7;
  matchName:any;

  constructor(
    private _sharedService:SharedService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.matchName = localStorage.getItem('matchName');
    var payload = this._getPayLoad();
    this._getNetExposureViewTotal(payload);
  }


  _getPayLoad(){
    var payload = {};
    var marketIds = this.route.snapshot.params['marketIds'];

      payload = {
        marketIds:marketIds.split(','),
        pageNo:1,
        limit:50,
        searchText:null
      }
      console.log(payload)

    return payload;
  }


  _getNetExposureViewTotal(payload) {
    this.isLoading = true;
    this.viewTotal = [];

    this._sharedService._getBetDetailsForWorkStationApi(payload).subscribe((data: any) => {
      this.isLoading = false;
      if(data.booksForBackend.length > 0){
        this.viewTotal = data.booksForBackend[0].result;
      }
      this.totalPages = Math.ceil(this.viewTotal.length / this.pageSize);
    });
  }



  next(): void {
    this.currentPage++;
    this._getNetExposureViewTotal(this.selectedRoleId);
  }

  prev(): void {
    this.currentPage--;
    this._getNetExposureViewTotal(this.selectedRoleId);
  }

  search(): void {
    if(this.searchTerm.length > 2 || this.searchTerm.length == 0){
      var MarketAndMatchId = this._getPayLoad();
      this._getNetExposureViewTotal(MarketAndMatchId);
    }
  }

}
