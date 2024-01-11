import { Component, OnInit } from '@angular/core';
import { BookManagementService } from '../../services/book-management.service';
import { FormGroup, FormControl } from '@angular/forms';
import { SharedService } from '@shared/services/shared.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-net-exposure',
  templateUrl: './net-exposure.component.html',
  styleUrls: ['./net-exposure.component.scss']
})
export class NetExposureComponent implements OnInit {

  filterForm: FormGroup;
  booksForBackend: any = [];
  isLoading = false;
  games: any;
  matchList: any = [];
  sport: any;
  MyPT: boolean = false;

  currentMatchId: any;
  currentSportId: any;
  currentClicked: any;

  loggedInUser: any;
  refreshCount: number = 8;
  resetTimerInterval: any;
  bookObj: any = [];
  isMobileView = false;

  constructor(
    private _bookManagementService: BookManagementService,
    private _sharedService: SharedService,
    private _router: Router
  ) {
    this.onResize();
  }

  ngOnInit(): void {
    this._preConfig();
    console.log('net view')
  }

  _preConfig() {
    this._getGames();
    this._initForm();
    this.onFilterChange({ MyPT: this.MyPT, matchId: null, sportId: null, clicked: 'firstTime', refreshCallVar: false });
    this.loggedInUser = this._sharedService.getUserDetails();

    this.resetTimerInterval = setInterval(() => {
      if (this.refreshCount == 0) {
        this.refreshCall();
        this.refreshCount = 9;
      }
      this.refreshCount--;
    }, 1000)
    this.isLoading = true;
  }

  refreshCall() {
    var myPTonRefresh: any;
    if (this.filterForm.value.selectedType == 'TotalBook') {
      myPTonRefresh = false;
    } else if (this.filterForm.value.selectedType == 'MyPT') {
      myPTonRefresh = true;
    }
    this.onFilterChange({ selectedType: this.filterForm.value.selectedType, matchId: this.currentMatchId, sportId: this.currentSportId, clicked: this.currentClicked, refreshCallVar: true });
  }

  _initForm() {
    this.filterForm = new FormGroup({
      selectedType: new FormControl('TotalBook'),
      sport: new FormControl(null),
      matchId: new FormControl(null)
    });
  }

  onFilterChangeDropDown(event) {
    this.isLoading = true;

    if (this.filterForm.value.matchId == 'null') {
      this.filterForm.patchValue({ 'matchId': null });
    }
    this.currentMatchId = this.filterForm.value.matchId;
    let body = {
      matchId: this.currentMatchId,
      sportId: this.currentSportId,
      myPT: this.MyPT
    }
    this._bookManagementService._getBookForBackendApi(body).subscribe((res: any) => {
      this.bookObj = [];

      if (res.booksForBackend) {
        for (let book of res.booksForBackend) {
          this.bookObj.push({
            matchName: book.matchName,
            leftMarkets: book.data.filter(b => b.fancyFlag == false),
            rightMarkets: book.data.filter(b => b.fancyFlag == true)
          });
        }
      }

      // this.alterData(res);

    })
  }

 

  onFilterChange(filterObj) {
    this.MyPT = filterObj.selectedType == 'MyPT' ? true : false;
    this.currentMatchId = this.filterForm.value.matchId;
    this.currentSportId = filterObj.sportId;
    this.currentClicked = filterObj.clicked;
    if (this.currentSportId && !filterObj.refreshCallVar) {
      this._getMatchBySportId(this.currentSportId);
    }
    if (!this.currentSportId) {
      this.currentMatchId = null;
      this.currentSportId = null;
    }

    let body = {
      matchId: this.currentMatchId,
      sportId: this.currentSportId,
      myPT: this.MyPT
    }

    this._bookManagementService._getBookForBackendApi(body).subscribe((res: any) => {
      // this.alterData(res);

      this.bookObj = [];

      // if (res.booksForBackend) {
      //   for (const book of res.booksForBackend) {
      //     book.data.forEach(d => {
      //       let amounts: any = [];
      //       d.horses.forEach(h => {
      //         amounts.push(h.finalAmount)
      //       })
      //       let lowestVal = Math.min(...amounts);
      //       d.netExposure = lowestVal;
      //     })
      //   }
      // }

      if (res.booksForBackend) {
        for (let book of res.booksForBackend) {
          this.bookObj.push({
            matchName: book.matchName,
            leftMarkets: book.data.filter(b => b.fancyFlag == false),
            rightMarkets: book.data.filter(b => b.fancyFlag == true)
          })


        }
      }



      this.booksForBackend = res.booksForBackend;
      this.isLoading = false;
    },
      () => this.isLoading = false,
      () => this.isLoading = false
    )

  }

  alterData(res) {
    this.isLoading = true;
    for (let index = 0; index < res.booksForBackend.length; index++) {
      if (res.booksForBackend[index].data.length > 1) {
        let obj = res.booksForBackend[index].data.find(
          (obj) => obj.fancyFlag == true
        );
        if (obj)
          res.booksForBackend[index].data[0].fancyExposure = obj.netExposure;
      }
      res.booksForBackend[index].data = res.booksForBackend[index].data.filter(obj => obj.fancyFlag == false)
    }
    this.booksForBackend = res.booksForBackend;
    this.isLoading = false;
  }

  _getGames() {
    this.isLoading = true;
    this._sharedService._getSports().subscribe((data: any) => {
      if (data) {
        this.games = data;
      }
      //this.isLoading = false;
    });
  }

  _getMatchBySportId(sportId) {
    this._sharedService.getMatchBySportId(sportId).subscribe((data: any) => {
      if (data.matchList) {
        this.matchList = data.matchList;
      }
    });
  }

  redirectUrlByMarket(data) {
    let marketIds = data.map(id => `${id.marketId}`).join(",");
    this._router.navigate(['/book-management/advance-workstation-market/' + marketIds]);
  }

  redirectUrlByMatch(data) {
    this._router.navigate(['/book-management/advance-workstation-match/' + data['matchId']]);
  }

  ngOnDestroy(): void {
    clearInterval(this.resetTimerInterval)
  }

  getViewTotal(book) {
    const market = book.leftMarkets.concat(book.rightMarkets);
    this.redirectUrlByMarket(market);
  }
  onResize() {
    if (window.innerWidth <= 767) {
      this.isMobileView = true;
    } else {
      this.isMobileView = false;
    }
  }

}
