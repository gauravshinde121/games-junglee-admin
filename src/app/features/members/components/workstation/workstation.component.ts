import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-workstation',
  templateUrl: './workstation.component.html',
  styleUrls: ['./workstation.component.scss']
})
export class WorkstationComponent implements OnInit {

  isLoading = false;
  viewTotal: any = [];
  searchTerm:any;
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  selectedRoleId = 7;
  matchName:any;

  constructor(
    private _sharedService:SharedService,
    private route: ActivatedRoute,
    private _location: Location
  ) { }

  ngOnInit(): void {
    this.matchName = localStorage.getItem('matchName');
    var MarketAndMatchId = this._getPayLoad();
    this._getNetExposureViewTotal(MarketAndMatchId);
  }

  backClicked() {
    this._location.back();
  }

  _getNetExposureViewTotal(netExposure) {
    this.isLoading = true;
    this.viewTotal = [];

    let body = {
      marketId:netExposure.marketId,
      matchId:netExposure.matchId,
      pageNo: this.currentPage,
      limit: 50,
      searchText: this.searchTerm,
    };

    this._sharedService._getBetDetailsForWorkStationApi(body).subscribe((data: any) => {
      this.isLoading = false;
      if(data.booksForBackend.length > 0){
        this.viewTotal = data.booksForBackend[0].result;
      }
      this.totalPages = Math.ceil(this.viewTotal.length / this.pageSize);
    });
  }

  _getPayLoad(){
    var payload = {};
    var type = this.route.snapshot.params['type'];
    var id = this.route.snapshot.params['id'];
    if(type == 'market'){
      payload = {
        marketId:id,
        matchId:null
      }
    }
    if(type == 'match'){
      payload = {
        marketId:null,
        matchId:id
      }
    }
    return payload;
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
