import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../services/settings.service';
import { SharedService } from '@shared/services/shared.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-market-settings',
  templateUrl: './market-settings.component.html',
  styleUrls: ['./market-settings.component.scss']
})
export class MarketSettingsComponent implements OnInit {

  filterForm: FormGroup;
  matchSettingsForm: FormGroup;
  display: any = 'none';
  marketSettingsList: any = [];
  isLoading = false;
  language = "en";
  sports: any;
  toggleValue: boolean = false;
  selectedMatchSettings: any;
  tournamentList:any;
  matchList: any;
  sportId:any;
  marketList: any = [];
  modalNumber: number;
  allChecked = false;
  sortedData: any[];
  sortColumn: string = '';
  sortAscending: boolean = true;// 1: ascending, -1: descending
  searchTerm: string = '';

  searchTermChanged: Subject<string> = new Subject<string>();

  sortAction: string = 'isActive';
  sortDirection: number = 1; // 1: ascending, -1: descending
  booleanValue: any = false;
  selectedUserForAdjustment: any = [];


  constructor(
    private settingsService: SettingsService,
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this._preConfig();

    this.searchTermChanged
    .pipe(debounceTime(150), distinctUntilChanged())
    .subscribe(searchTerm => {
      this.filterData(searchTerm);
    });
  }

  _preConfig() {
    this._initForm();
    this._getAllSports();
    this.getMarketSettingsList();
  }

  _initForm() {
    this.filterForm = new FormGroup({
      status: new FormControl(null),
      sportName: new FormControl(null),
      matchName: new FormControl(),
      tournamentId : new FormControl(),
      marketTypeId : new FormControl()
    })

    this.matchSettingsForm = new FormGroup({
      marketIds:new FormControl(null),
      minBet: new FormControl(null,Validators.required),
      maxBet: new FormControl(null,Validators.required),
      maxMarketSize: new FormControl(null,Validators.required),
      marketDelay: new FormControl(null,Validators.required),
    })
  }

  getMarketSettingsList() {
    this.selectedUserForAdjustment = [];
    if(this.filterForm.value.sportId == null || this.filterForm.value.sportId== "null"){
      this.filterForm.value.tournamentId = null;
    }
    this.isLoading = true;
    // this.marketSettingsList = [];
    if (this.filterForm.value.memberName == null) {
      this.filterForm.patchValue({ 'memberName': null });
    }
    var status: any;
    if (this.filterForm.value.status) {
      if (this.filterForm.value.status == 1) {
        status = true;
      } else {
        status = false;
      }
    } else {
      status = this.filterForm.value.status;
    }

    if(this.filterForm.value.sportsId == 'null'){
      this.filterForm.value.sportsId = null;
    }
    if(this.filterForm.value.tournamentId == 'null'){
      this.filterForm.value.tournamentId = null;
    }
    if(this.filterForm.value.marketTypeId == 'null'){
      this.filterForm.value.marketTypeId = null;
    }
    let body = {
      marketIsActive: status,
      sportId: this.filterForm.value.sportName?+this.filterForm.value.sportName:null,
      matchId: this.filterForm.value.matchName,
      tournamentId: this.filterForm.value.tournamentId?+this.filterForm.value.tournamentId:null,
      marketTypeId: this.filterForm.value.marketTypeId?+this.filterForm.value.marketTypeId:null
    }

    this.settingsService._getMarketForAdminMarketSettingsListApi(body).subscribe((data: any) => {
      this.isLoading = false;
      this.marketSettingsList = data.markets;
      //console.log('this.marketSettingsList', this.marketSettingsList);
      const uniqueMarketTypeIds = Array.from(new Set(this.marketSettingsList.map(market => market.marketTypeId)));
      //console.log(uniqueMarketTypeIds);
      this.sortedData = data.markets.slice();
    })
  }


  _getAllSports() {
    this._sharedService._getSports().subscribe((data: any) => {
      if (data) {
        this.sports = data;
      }
    });
  }

  _onSportSelect(){
    if(this.sportId == null ||this.sportId == 'null' ) {
      this.filterForm.value.tournamentId = null;
    }
    this.filterForm.patchValue({tournamentId:null, matchName:null});
    var sportId = this.filterForm.value.sportName;
    if(!sportId) return
    this._sharedService.getTournamentBySportIdApi(sportId).subscribe((data:any)=>{
      if(data){
        this.tournamentList = data;
      }
    });

  }

  _onTournamentSelect(){
    var tournamentId = this.filterForm.value.tournamentId;
    if(!tournamentId) return
    this.filterForm.patchValue({ matchName:null});
    this._sharedService.getMatchByTournamentIdApi(tournamentId).subscribe((data:any)=>{
      if(data){
        this.matchList = data;
      }
    });
  }

  onToggleChange(event: Event, marketId, isCustomMarket) {
    const checkbox = event.target as HTMLInputElement;
    checkbox.classList.toggle('active', checkbox.checked);
    let body = {
      marketId: marketId,
      marketIsActive: checkbox.checked,
      ipAddress : this._sharedService.getIpAddress(),
      isCustom : isCustomMarket
    }
    this.settingsService._setMarketStatusForMarketSettingsApi(body).subscribe((data: any) => {
      this._sharedService.getToastPopup("Settings updated.", 'Market Settings', 'success');

      this.getMarketSettingsList();
    })

  }

  // changeGame(evt) {
  //   // this.sportsId = evt.target.value;
  //   this.filterForm.value.sportsId = evt.target.value;
  //   if(evt.target.value == null) {
  //     this.filterForm.value.tournamentId = null;
  //   }
  // }


  openSettingModal(matchSettings) {
    this.matchSettingsForm.reset();
    this.selectedMatchSettings = matchSettings;

    this.matchSettingsForm.patchValue({
      minBet: matchSettings.minBet,
      maxBet: matchSettings.maxBet,
      maxMarketSize: matchSettings.maxMarketSize,
      marketDelay: matchSettings.marketDelay
    });
    this.display = 'block';
  }

  closeModal() {
    this.display = 'none';
  }

  saveMatchSettings() {

    this.display = 'none';
    let body = {

      marketId: this.selectedMatchSettings.marketId,
      marketDelay: this.matchSettingsForm.value.marketDelay,
      minBet: this.matchSettingsForm.value.minBet,
      maxBet: this.matchSettingsForm.value.maxBet,
      maxMarketSize: this.matchSettingsForm.value.maxMarketSize
    }

    this.settingsService._setBetLimitForMarketApi(body).subscribe((data: any) => {
      this._sharedService.getToastPopup("Settings updated.", 'Market Settings', 'success');
      this.getMarketSettingsList();
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

  filterData(searchTerm: string) {

    if (searchTerm.length === 0) {
      this.getMarketSettingsList();
    } else {
      const searchTermLowerCase = searchTerm.toLowerCase();

      this.marketSettingsList = this.marketSettingsList.filter(item =>
        item.marketName.toLowerCase().includes(searchTermLowerCase)
      );

      // Apply sorting if required
      if (this.sortColumn) {
        this.marketSettingsList.sort((a, b) =>
          a[this.sortColumn].localeCompare(b[this.sortColumn]) * (this.sortAscending ? 1 : -1)
        );
      }

      return this.marketSettingsList;
    }

  }

  applyFilter() {

    this.searchTermChanged.next(this.searchTerm);

  }

  checkMarketId(marketId: any) {
    if (this.selectedUserForAdjustment.includes(marketId)) {
      this.selectedUserForAdjustment.splice(
        this.selectedUserForAdjustment.indexOf(marketId),
        1
      );
      return;
    }

      this.selectedUserForAdjustment.push(marketId);
  }

  checkAll(ev) {

    if(ev.target.checked){
      this.selectedUserForAdjustment = [];
    }

    this.allChecked = !this.allChecked;

    this.marketSettingsList.forEach(x => x.state = ev.target.checked);

    for(const market of this.marketSettingsList){
      this.checkMarketId(market.marketId);
    }

  }

  isAllChecked() {
    return this.marketSettingsList.every(_ => _.state);
  }

  openBulkTransferModal() {
    this.modalNumber = 1;
    this.matchSettingsForm.patchValue({
      minBet: 100,
      maxBet: 50000,
      maxMarketSize:200000,
      marketDelay: 0
    });
    this.display = 'block';
  }

  submitBulkMarket(){
    this.display = 'none';
    let payload = {

      marketIds: this.selectedUserForAdjustment,
      marketDelay: this.matchSettingsForm.value.marketDelay,
      minBet: this.matchSettingsForm.value.minBet,
      maxBet: this.matchSettingsForm.value.maxBet,
      maxMarketSize: this.matchSettingsForm.value.maxMarketSize
    }

    this.settingsService._setBetLimitForMultipleMarketApi(payload).subscribe((data: any) => {
      this._sharedService.getToastPopup("Settings updated.", 'Muttiple Markets Settings', 'success');
      this.getMarketSettingsList();
      this.marketSettingsList.forEach(x => x.state = false);
    })

    this.selectedUserForAdjustment = []
  }


  preventNegativeKeyPress(event: KeyboardEvent): boolean {
    return (event.charCode == 8 || event.charCode == 0) ? true : (event.charCode >= 48 && event.charCode <= 57);
  }

}
