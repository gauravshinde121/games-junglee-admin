import { Component, OnInit } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { BookManagementService } from '../../../services/book-management.service';
import * as _ from "lodash";
import { webSocket } from 'rxjs/webSocket';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
  selector: 'app-net-exposure-view-total',
  templateUrl: './net-exposure-view-total.component.html',
  styleUrls: ['./net-exposure-view-total.component.scss']
})
export class NetExposureViewTotalComponent implements OnInit {

  isLoading = false;
  viewTotal: any = [];
  searchTerm: any = null;
  currentPage: number = 1;
  pageSize: number = 50;
  totalPages: number = 0;
  selectedRoleId = 7;
  matchName: any;
  payload: any;
  adminBooksList: any = [];
  setOrUnsetWebSocketParamsObj: any = [];
  prevSetOrUnsetWebSocketParamsObj: any = [];
  realDataWebSocket: any;
  myPT: boolean = false;
  refreshCount: number = 8;
  resetTimerInterval: any;
  totalBooks: any = [];
  isTVEnable: boolean = false;
  liveStreamingTVUrl: any;
  matchId: any;

  fileName = 'NetExposureViewTotal' + new Date().toString() + '.xlsx';
  newAdminBooksList: any;
  ladderObj: never[];
  downlineBooks: any = [];

  sortColumn: string = '';
  sortAscending: boolean = true;// 1: ascending, -1: descending

  constructor(
    private _sharedService: SharedService,
    private _bookMgmService: BookManagementService,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // this._initConfig();
    this._getWebSocketUrl();
    this.resetTimerInterval = setInterval(() => {
      if (this.refreshCount == 0) {
        this.refreshCall();
        this.refreshCount = 9;
      }
      this.refreshCount--;
    }, 1000)
  }




  _getWebSocketUrl(isComplete = false) {
    this._sharedService.getWebSocketURLApi().subscribe(
      (res: any) => {
        if (res) {
          this.realDataWebSocket = webSocket(res['url']);
          if (!isComplete) {
            this.route.params.subscribe((routeParams) => {
              let bookMgmParams = {};
              this.payload = {
                pageNo: this.currentPage,
                limit: this.pageSize,
                searchText: this.searchTerm
              };
              if (routeParams['marketIds']) {
                bookMgmParams['marketIds'] = routeParams['marketIds'].split(',');
                this.payload['marketIds'] = routeParams['marketIds'].split(',');
              } else {
                bookMgmParams['matchId'] = routeParams['matchId'];
                this.payload['matchId'] = routeParams['matchId'];
              }
              bookMgmParams['myPT'] = this.myPT
              this._postBooksForAdminBookMgmApi(bookMgmParams);
              this._getNetExposureViewTotal();
              this._subscribeWebSocket()
            })
          }
        }
      });

  }


  _getNetExposureViewTotal() {
    this.isLoading = true;
    this._sharedService._getBetDetailsForWorkStationApi(this.payload).subscribe((data: any) => {
      this.isLoading = false;
      if (data.booksForBackend.length > 0) {
        this.viewTotal = data.booksForBackend[0].result;
      }
      this.totalPages = Math.ceil(this.viewTotal.length / this.pageSize);
    });
  }

  getTotalBookViewTotal(marketId, totalBookStatus, adminBook) {


    if (totalBookStatus) {

      this.adminBooksList.map((adminBook) => {
        if (adminBook['marketId'] == marketId) {
          adminBook['totalBook'] = [];
          adminBook['isTotaltotalBookView'] = false;
        }
        return adminBook;
      })
      this.totalBooks.map((singleBook) => {
        if (singleBook['marketId'] == marketId) {
          this.totalBooks = this.totalBooks.filter((item) => item.marketId !== marketId);
        }
        return singleBook;
      })
      return;
    }
    let totalBookParams = {
      marketId: marketId,
      myPT: this.myPT
    };


    this._bookMgmService._postTotalBookApi(totalBookParams).subscribe((data: any) => {

      this.downlineBooks = [];

      if (data.book.length > 0) {
        data.book = data.book.map((el) => ({ ...el, marketId: totalBookParams.marketId, isExpanded: false }));

        for (let book of data.book) {
          this.downlineBooks.push(book)
        }

        this.addMarketIdsRecursive(this.downlineBooks, totalBookParams.marketId)
      } else {
        this.downlineBooks = [];
      }


      // console.log(this.downlineBooks)

      if (data['book'].length > 0) {
        this.totalBooks.push({ marketId: marketId, totalBook: data['book'], isTotaltotalBookView: true });
        this.adminBooksList.map((adminBook) => {
          if (adminBook['marketId'] == marketId) {
            adminBook['totalBook'] = data['book'];
            adminBook['isTotaltotalBookView'] = true;
          } else {
            adminBook['isTotaltotalBookView'] = false;
          }
          return adminBook;
        })
      }
    });


  }


  addMarketIdsRecursive(userBook, marketId) {
    for (let book of userBook) {
      book.marketId = marketId;
      book.isExpanded = false;
      if (book.downline.length > 0) {
        this.addMarketIdsRecursive(book.downline, marketId)
      }
    }
  }

  onFilterChange(params) {
    let bookMgmParams = {};
    if (this.payload['marketIds']) {
      bookMgmParams['marketIds'] = this.payload['marketIds'];
    } else {
      bookMgmParams['matchId'] = this.payload['matchId'];
    }
    this.myPT = bookMgmParams['myPT'] = params;
    this._postBooksForAdminBookMgmApi(bookMgmParams);
  }

  refreshCall() {
    let bookMgmParams = {};
    if (this.payload['marketIds']) {
      bookMgmParams['marketIds'] = this.payload['marketIds'];
    } else {
      bookMgmParams['matchId'] = this.payload['matchId'];
    }
    bookMgmParams['myPT'] = this.myPT;

    this._getNetExposureViewTotal();
    if (_.differenceBy(this.newAdminBooksList, this.adminBooksList, 'marketName').length > 0) {
      this._postBooksForAdminBookMgmApi(bookMgmParams);
    } else {
      this._postBooksForAdminBookMgmRefreshApi(bookMgmParams);

    }
  }

  _postBooksForAdminBookMgmRefreshApi(bookMgmParams) {
    this._bookMgmService._postBooksForAdminBookMgmApi(bookMgmParams).subscribe((res: any) => {
      this.newAdminBooksList = res['book'];
      if (this.newAdminBooksList) {
        for (let i = this.adminBooksList.length - 1; i >= 0; i--) {
          let newMarket = res['book'].findIndex(mrkt => mrkt.marketId === this.adminBooksList[i].marketId);
          if (newMarket === -1) {
            this.adminBooksList.splice(i, 1);
          }
        }


      }


      if (res['book'].length > 0) {
        this.setOrUnsetWebSocketParamsObj = [];
        res['book'].map((singleBook) => {
          this.adminBooksList.map((adminSingleBook) => {
            if (+singleBook['marketId'] == +adminSingleBook['marketId']) {
              adminSingleBook['userBook'] = singleBook['userBook'];
              adminSingleBook['adminBook'].map(sinlgeRunner => {
                let runnerRes = _.filter(singleBook['adminBook'], ['SelectionId', sinlgeRunner['SelectionId']]);
                if (runnerRes.length > 0) sinlgeRunner['amount'] = runnerRes[0]['amount'];
                return sinlgeRunner;
              })
            }
            return adminSingleBook;
          })
        })
      }


    })
  }

  _postBooksForAdminBookMgmApi(bookMgmParams) {
    this._bookMgmService._postBooksForAdminBookMgmApi(bookMgmParams).subscribe((res: any) => {
      // console.log(res['book'])
      this.matchName = res['matchName']
      if (res['book'].length > 0) {
        this.setOrUnsetWebSocketParamsObj = [];
        res['book'].map((singleBook) => {
          // console.log("single book",singleBook)
          this.matchId = singleBook['marketId'];
          singleBook['isExpand'] = true;
          this.setOrUnsetWebSocketParamsObj.push(singleBook.centralId);
          let totalBookMarket = _.find(this.totalBooks, ['marketId', singleBook['marketId']]);
          if (totalBookMarket != undefined) {
            singleBook['totalBook'] = totalBookMarket['totalBook']
            singleBook['isTotaltotalBookView'] = totalBookMarket['isTotaltotalBookView']
          }
          return singleBook['adminBook'].map(runnerRes => {
            switch (singleBook['marketTypName']) {
              case 'Match Odds':
                if ((runnerRes['batb'] == undefined) || (runnerRes['batl'] == undefined)) {
                  runnerRes['back0'] = '';
                  runnerRes['vback0'] = '';

                  runnerRes['back1'] = '';
                  runnerRes['vback1'] = '';

                  runnerRes['back2'] = '';
                  runnerRes['vback2'] = '';

                  runnerRes['lay0'] = '';
                  runnerRes['vlay0'] = '';

                  runnerRes['lay1'] = '';
                  runnerRes['vlay1'] = '';

                  runnerRes['lay2'] = '';
                  runnerRes['vlay2'] = '';

                } else {
                  runnerRes['back0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['odds'] : '';
                  runnerRes['vback0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['tv'] : '';

                  runnerRes['back1'] = runnerRes['batb'][1] !== undefined ? runnerRes['batb'][1]['odds'] : '';
                  runnerRes['vback1'] = runnerRes['batb'][1] !== undefined ? runnerRes['batb'][1]['tv'] : '';

                  runnerRes['back2'] = runnerRes['batb'][2] !== undefined ? runnerRes['batb'][2]['odds'] : '';
                  runnerRes['vback2'] = runnerRes['batb'][2] !== undefined ? runnerRes['batb'][2]['tv'] : '';

                  runnerRes['lay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['odds'] : '';
                  runnerRes['vlay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['tv'] : '';

                  runnerRes['lay1'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['odds'] : '';
                  runnerRes['vlay1'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['tv'] : '';

                  runnerRes['lay2'] = runnerRes['batl'][2] !== undefined ? runnerRes['batl'][2]['odds'] : '';
                  runnerRes['vlay2'] = runnerRes['batl'][1] !== undefined ? runnerRes['batl'][1]['tv'] : '';
                }
                break;

              case 'Bookmaker':
                if ((runnerRes['batb'] == undefined) || (runnerRes['batl'] == undefined)) {
                  runnerRes['back0'] = '';
                  runnerRes['vback0'] = '';

                  runnerRes['lay0'] = '';
                  runnerRes['vlay0'] = '';
                } else {
                  runnerRes['back0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['odds'] : '';
                  runnerRes['vback0'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['tv'] : '';

                  runnerRes['lay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['odds'] : '';
                  runnerRes['vlay0'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['tv'] : '';
                }
                break;

              case 'Fancy':
                if ((runnerRes['batb'] == undefined) || (runnerRes['batl'] == undefined)) {
                  runnerRes['back1'] = '';
                  runnerRes['vback1'] = '';

                  runnerRes['lay1'] = '';
                  runnerRes['vlay1'] = '';
                } else {
                  runnerRes['back1'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['odds'] : '';
                  runnerRes['vback1'] = runnerRes['batb'][0] !== undefined ? runnerRes['batb'][0]['tv'] : '';

                  runnerRes['lay1'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['odds'] : '';
                  runnerRes['vlay1'] = runnerRes['batl'][0] !== undefined ? runnerRes['batl'][0]['tv'] : '';
                }
                break;
            }
            return runnerRes;
          })
        })
        this.adminBooksList = res['book'];


        if (this.prevSetOrUnsetWebSocketParamsObj.length !== this.setOrUnsetWebSocketParamsObj.length) {
          let setObj = {
            set: {
              deviceId: sessionStorage.getItem('deviceId'),
              centralIdList: this.setOrUnsetWebSocketParamsObj
            }
          }
          let unsetObj = {};
          unsetObj['unset'] = setObj['set'];
        }
        this.prevSetOrUnsetWebSocketParamsObj = this.setOrUnsetWebSocketParamsObj;
      }
    })
  }

  private _updateMarketData(data: any) {
    let parseData = JSON.parse(data);
    if (parseData.hasOwnProperty('data') && typeof parseData?.data !== 'string') {
      // console.log('data', JSON.parse(data));
      let webSocketData = parseData['data'];
      if (webSocketData.length > 0) {
        webSocketData = webSocketData.map((singleItem) => {
          singleItem['bmi'] = +singleItem['bmi'];
          return singleItem;
        })
      }

      this.adminBooksList.map((singleBook) => {
        let singleWebSocketMarketData = _.find(webSocketData, ['bmi', +singleBook['marketId']]);
        if (singleWebSocketMarketData != undefined) {


          singleBook['appMarketStatus'] = singleWebSocketMarketData['ms'];

          if (singleBook['marketTypName'] == 'Bookmaker') {
            for (let rnr of singleBook['adminBook']) {
              rnr['back1'] = null;
              rnr['lay1'] = null;
              rnr['vback1'] = null;
              rnr['vlay1'] = null;
            }
          }

          if (singleBook['marketTypName'] == 'Match Odds') {
            for (let rnr of singleBook['adminBook']) {
              rnr['back0'] = null;
              rnr['back1'] = null;
              rnr['back2'] = null;
              rnr['lay0'] = null;
              rnr['lay1'] = null;
              rnr['lay2'] = null;
              rnr['vback0'] = null;
              rnr['vback1'] = null;
              rnr['vback2'] = null;
              rnr['vlay0'] = null;
              rnr['vlay1'] = null;
              rnr['vlay2'] = null;
            }
          }

          return singleBook['adminBook'].map((runnerRes) => {
            let webSocketRunners = _.filter(singleWebSocketMarketData?.['rt'], ['ri', runnerRes['SelectionId']]);
            // console.log(webSocketRunners)
            if (singleBook['marketTypName'] == 'Match Odds') {

              for (let singleWebsocketRunner of webSocketRunners) {

                if (singleWebsocketRunner['ib']) {
                  //back

                  //Live Rate
                  runnerRes['back' + singleWebsocketRunner['pr']] = singleWebsocketRunner['rt'];

                  //Volume from Betfair
                  runnerRes['vback' + singleWebsocketRunner['pr']] = singleWebsocketRunner['bv'];

                } else {
                  //lay

                  //Live Rate
                  runnerRes['lay' + singleWebsocketRunner['pr']] = singleWebsocketRunner['rt'];

                  //Volume from Betfair
                  runnerRes['vlay' + singleWebsocketRunner['pr']] = singleWebsocketRunner['bv'];

                }
              }
            } else if (singleBook['marketTypName'] == 'Bookmaker' || singleBook['marketTypName'] == 'Fancy') {
              // console.log(webSocketRunners)
              for (let singleWebsocketRunner of webSocketRunners) {

                if (singleWebsocketRunner['ib']) {
                  //back

                  //Live Rate
                  runnerRes['back1'] = singleWebsocketRunner['rt'];

                  //Volume from Betfair
                  runnerRes['vback1'] = singleWebsocketRunner['bv'];

                } else {
                  //lay

                  //Live Rate
                  runnerRes['lay1'] = singleWebsocketRunner['rt'];

                  //Volume from Betfair
                  runnerRes['vlay1'] = singleWebsocketRunner['bv'];

                }
              }
            }

            return runnerRes;
          })
        }
      })
    }
  }


  _subscribeWebSocket() {
    this.realDataWebSocket.subscribe(
      data => {
        if (typeof data == 'string') this._updateMarketData(data);
        // if(typeof data == 'string') console.log('sub',data);
      }, // Called whenever there is a message from the server.
      err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
      () => console.log('complete') // Called when connection is closed (for whatever reason).
    );
  }

  next(): void {
    this.currentPage++;
    this._getNetExposureViewTotal();
  }

  prev(): void {
    this.currentPage--;
    this._getNetExposureViewTotal();
  }

  search(): void {
    if (this.searchTerm.length > 2 || this.searchTerm.length == 0) {
      this._getNetExposureViewTotal();
      this._getWebSocketUrl();
    }
  }

  hideShowTV() {
    this.isTVEnable = !this.isTVEnable;
    if (this.isTVEnable) {
      this.startStreamingLiveTV();
    } else {
      this.liveStreamingTVUrl = undefined;
    }
  }

  startStreamingLiveTV() {
    // sportszone365.org
    // domain: window.location.hostname
    this._sharedService.postLiveStreamForMarket({ domain: 'sportszone365.org', matchId: this.matchId }).subscribe((res: any) => {
      this.liveStreamingTVUrl = res?.streamObj?.data?.streamingUrl;
      // console.log("tv",res);
    })
  }

  ngOnDestroy(): void {
    let unSetObj = {
      unset: {
        deviceId: sessionStorage.getItem('deviceId'),
        centralIdList: this.setOrUnsetWebSocketParamsObj
      }
    }
    // if(this.realDataWebSocket) this.realDataWebSocket.complete();
    if (this.realDataWebSocket) this.realDataWebSocket.unsubscribe();
    clearInterval(this.resetTimerInterval)
  }

  exportExcel() {
    // console.log(this.viewTotal)
    let viewtotal: any = []
    this.viewTotal.forEach(element => {
      viewtotal.push({
        member: element.userName,
        date: moment(element.placedDate).format("MMM D, YYYY, h:mm:ss a"),
        event: element.event,
        market: element.marketName,
        selection: element.selectionName,
        odds_placed: element.placedOdds,
        odds_matched: element.betRate,
        mathedStake: element.isMatched ? element.stake : null,
        umatchedStake: element.isMatched ? null : element.stake,
        profit_Liablity: element.profitLiability
      })
    });
    this._sharedService.exportExcel(viewtotal, this.fileName);
  }


  getLadderDataByMarket(marketId: any) {
    this.ladderObj = [];
    this._bookMgmService._postLadderDataByMarketApi({ marketId: marketId }).subscribe((res: any) => {
      this.ladderObj = res?.ladderDetails;
    })
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
