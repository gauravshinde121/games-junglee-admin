import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SettingsService } from '../services/settings.service';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-match-settings',
  templateUrl: './match-settings.component.html',
  styleUrls: ['./match-settings.component.scss'],
})
export class MatchSettingsComponent implements OnInit {
  filterForm: FormGroup;
  matchSettingsForm: FormGroup;
  display: any = 'none';
  matchSettingsList: any = [];
  isLoading = false;
  language = 'en';
  sports: any;
  toggleValue: boolean = false;
  selectedMatchSettings: any;

  sortColumn: string = '';
  sortAscending: boolean = true; // 1: ascending, -1: descending
  selectedUserForAdjustment: any = [];
  allChecked = false;
  modalNumber: number;

  constructor(
    private settingsService: SettingsService,
    private _sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this._preConfig();
  }

  _preConfig() {
    this._initForm();
    this._getAllSports();
    this.getMatchSettingsList();
  }

  _initForm() {
    this.filterForm = new FormGroup({
      status: new FormControl(null),
      sportName: new FormControl(null),
      matchName: new FormControl(),
    });

    this.matchSettingsForm = new FormGroup({
      matchOddsMaxBet: new FormControl(null, Validators.required),
      matchOddsMinBet: new FormControl(null, Validators.required),
      bookmakerMaxBet: new FormControl(null, Validators.required),
      bookmakerMinBet: new FormControl(null, Validators.required),
      fancyMaxBet: new FormControl(null, Validators.required),
      fancyMinBet: new FormControl(null, Validators.required),
      matchOddDelay: new FormControl(null, Validators.required),
      bookmakerDelay: new FormControl(null, Validators.required),
      fancyDelay: new FormControl(null, Validators.required),
      maxMatchOddsSize: new FormControl(null, Validators.required),
      maxBookmakerSize: new FormControl(null, Validators.required),
      maxFancySize: new FormControl(null, Validators.required),
      maxFancySessionSize: new FormControl(null, Validators.required),
      maxFancySessionMinBet: new FormControl(null, Validators.required),
      maxFancySessionMaxBet: new FormControl(null, Validators.required),
      maxFancySessionDelay: new FormControl(null, Validators.required),
    });
  }

  preventNegativeKeyPress(event: KeyboardEvent): boolean {
    return event.charCode == 8 || event.charCode == 0
      ? true
      : event.charCode >= 48 && event.charCode <= 57;
  }

  getMatchSettingsList() {
    this.selectedUserForAdjustment = [];
    this.isLoading = true;
    this.matchSettingsList = [];
    if (this.filterForm.value.memberName == null) {
      this.filterForm.patchValue({ memberName: null });
    }
    var status: any;
    //if (this.filterForm.value.status) {
    if (this.filterForm.value.status == 1) {
      status = true;
    } else if (this.filterForm.value.status == 0) {
      status = false;
    } else {
      status = null;
    }
    // } else {
    //   status = this.filterForm.value.status;
    // }
    let body = {
      matchIsActive: status,
      sportId: this.filterForm.value.sportName
        ? +this.filterForm.value.sportName
        : null,
      matchName: this.filterForm.value.matchName,
    };
    this.settingsService
      ._getMatchSettingsListApi(body)
      .subscribe((data: any) => {
        this.isLoading = false;
        this.matchSettingsList = data.matches;
      });
  }

  _getAllSports() {
    this._sharedService._getSports().subscribe((data: any) => {
      if (data) {
        this.sports = data;
      }
    });
  }

  openSettingModal(matchSettings) {
    this.selectedUserForAdjustment = [];
    this.matchSettingsForm.reset();
    this.selectedMatchSettings = matchSettings;
    this.selectedUserForAdjustment.push(this.selectedMatchSettings.matchId)
    this.matchSettingsForm.patchValue({
      matchOddsMaxBet: matchSettings.matchOddsMaxBet,
      matchOddsMinBet: matchSettings.matchOddsMinBet,
      bookmakerMaxBet: matchSettings.bookmakerMaxBet,
      bookmakerMinBet: matchSettings.bookmakerMinBet,
      fancyMaxBet: matchSettings.fancyMaxBet,
      fancyMinBet: matchSettings.fancyMinBet,
      matchOddDelay: matchSettings.matchOddDelay,
      bookmakerDelay: matchSettings.bookmakerDelay,
      fancyDelay: matchSettings.fancyDelay,
      maxMatchOddsSize: matchSettings.maxMatchOddsSize,
      maxBookmakerSize: matchSettings.maxBookmakerSize,
      maxFancySize: matchSettings.maxFancySize,
      maxFancySessionSize: matchSettings.maxFancySessionSize,
      maxFancySessionMinBet: matchSettings.maxFancySessionMinBet,
      maxFancySessionMaxBet: matchSettings.maxFancySessionMaxBet,
      maxFancySessionDelay: matchSettings.maxFancySessionDelay,
    });
    this.display = 'block';
  }

  closeModal() {
    this.display = 'none';
    this.selectedUserForAdjustment = [];

    this.matchSettingsList.map(i=>{
      i.state = false;
    })
  }

  saveMatchSettings() {
    this.display = 'none';
    // console.log("this.selectedUserForAdjustment,",this.selectedUserForAdjustment)
    // return;

    let body = {
      // matchId: this.selectedMatchSettings.matchId,
      matchId: this.selectedUserForAdjustment,
      matchOddsMaxBet: this.matchSettingsForm.value.matchOddsMaxBet,
      matchOddsMinBet: this.matchSettingsForm.value.matchOddsMinBet,
      bookmakerMaxBet: this.matchSettingsForm.value.bookmakerMaxBet,
      bookmakerMinBet: this.matchSettingsForm.value.bookmakerMinBet,
      fancyMaxBet: this.matchSettingsForm.value.fancyMaxBet,
      fancyMinBet: this.matchSettingsForm.value.fancyMinBet,
      matchOddDelay: this.matchSettingsForm.value.matchOddDelay,
      bookmakerDelay: this.matchSettingsForm.value.bookmakerDelay,
      fancyDelay: this.matchSettingsForm.value.fancyDelay,
      maxMatchOddsSize: this.matchSettingsForm.value.maxMatchOddsSize,
      maxBookmakerSize: this.matchSettingsForm.value.maxBookmakerSize,
      maxFancySize: this.matchSettingsForm.value.maxFancySize,
      maxFancySessionSize: this.matchSettingsForm.value.maxFancySessionSize,
      maxFancySessionMinBet: this.matchSettingsForm.value.maxFancySessionMinBet,
      maxFancySessionMaxBet: this.matchSettingsForm.value.maxFancySessionMaxBet,
      maxFancySessionDelay: this.matchSettingsForm.value.maxFancySessionDelay,
    };
    this.settingsService
      ._setBetLimitForMatchApi(body)
      .subscribe((data: any) => {
        this._sharedService.getToastPopup(
          'Settings updated.',
          'Match Settings',
          'success'
        );
        this.selectedUserForAdjustment = [];
        this.getMatchSettingsList();
      });
  }

  onToggleChange(event: Event, matchId) {
    const checkbox = event.target as HTMLInputElement;
    checkbox.classList.toggle('active', checkbox.checked);
    let body = {
      matchId: matchId,
      matchIsActive: checkbox.checked,
    };
    this.settingsService
      ._setMatchActiveStatusApi(body)
      .subscribe((data: any) => {
        this._sharedService.getToastPopup(
          'Settings updated.',
          'Match Settings',
          'success'
        );
        this.getMatchSettingsList();
      });
    // this.getMatchSettingsList();
  }

  toggleSort(columnName: string) {
    if (this.sortColumn === columnName) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = columnName;
      this.sortAscending = true;
    }
  }

  checkMatchId(matchId: any) {
    if (this.selectedUserForAdjustment.includes(matchId)) {
      this.selectedUserForAdjustment.splice(
        this.selectedUserForAdjustment.indexOf(matchId),
        1
      );
      return;
    }
    this.selectedUserForAdjustment.push(matchId);
  }

  checkAll(ev) {
    if (ev.target.checked) {
      this.selectedUserForAdjustment = [];
    }

    this.allChecked = !this.allChecked;

    this.matchSettingsList.forEach((x) => (x.state = ev.target.checked));

    for (const match of this.matchSettingsList) {
      this.checkMatchId(match.matchId);
    }
  }

  isAllChecked() {
    return this.matchSettingsList.every((_) => _.state);
  }

  openBulkTransferModal() {
    this.modalNumber = 1;
    this.matchSettingsForm.patchValue({
      matchOddsMinBet: 100,
      matchOddsMaxBet: 100000,
      matchOddDelay: 5,
      maxMatchOddsSize: 400000,

      bookmakerMinBet: 100,
      bookmakerMaxBet: 500000,
      bookmakerDelay: 0,
      maxBookmakerSize: 1500000,

      fancyMinBet: 100,
      fancyMaxBet: 25000,
      fancyDelay: 0,
      maxFancySize: 100000,

      maxFancySessionMinBet: 100,
      maxFancySessionMaxBet: 100000,
      maxFancySessionDelay: 0,
      maxFancySessionSize: 400000,
    });
    this.display = 'block';
  }
}
