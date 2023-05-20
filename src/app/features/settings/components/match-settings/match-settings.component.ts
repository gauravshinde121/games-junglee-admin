import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SettingsService } from '../services/settings.service';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-match-settings',
  templateUrl: './match-settings.component.html',
  styleUrls: ['./match-settings.component.scss']
})
export class MatchSettingsComponent implements OnInit {

  filterForm: FormGroup;
  matchSettingsForm: FormGroup;
  display: any = 'none';
  matchSettingsList: any = [];
  isLoading = false;
  language = "en";
  sports: any;
  toggleValue: boolean = false;
  selectedMatchSettings: any;
  constructor(
    private settingsService: SettingsService,
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this._preConfig()
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
      matchName: new FormControl()
    })

    this.matchSettingsForm = new FormGroup({
      matchOddsMaxBet: new FormControl(null),
      matchOddsMinBet: new FormControl(null),
      bookmakerMaxBet: new FormControl(null),
      bookmakerMinBet: new FormControl(null),
      fancyMaxBet: new FormControl(null),
      fancyMinBet: new FormControl(null),
      matchOddDelay: new FormControl(null),
      bookmakerDelay: new FormControl(null),
      fancyDelay: new FormControl(null),
    })
  }

  getMatchSettingsList() {
    this.isLoading = true;
    this.matchSettingsList = [];
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
    let body = {
      matchIsActive: status,
      sportId: this.filterForm.value.sportName?+this.filterForm.value.sportName:null,
      matchName: this.filterForm.value.matchName
    }
    this.settingsService._getMatchSettingsListApi(body).subscribe((data: any) => {
      this.isLoading = false;
      this.matchSettingsList = data.matches;
    })
  }

  _getAllSports() {
    this._sharedService._getSports().subscribe((data: any) => {
      if (data) {
        this.sports = data;
      }
    });
  }

  openSettingModal(matchSettings) {
    this.matchSettingsForm.reset();
    this.selectedMatchSettings = matchSettings;
    this.matchSettingsForm.patchValue({
      matchOddsMaxBet: matchSettings.matchOddsMaxBet,
      matchOddsMinBet: matchSettings.matchOddsMinBet,
      bookmakerMaxBet: matchSettings.bookmakerMaxBet,
      bookmakerMinBet: matchSettings.bookmakerMinBet,
      fancyMaxBet: matchSettings.fancyMaxBet,
      fancyMinBet: matchSettings.fancyMinBet,
      matchOddDelay: matchSettings.matchOddDelay,
      bookmakerDelay: matchSettings.bookmakerDelay,
      fancyDelay: matchSettings.fancyDelay
    });
    this.display = 'block';
  }

  closeModal() {
    this.display = 'none';
  }

  saveMatchSettings() {
    this.display = 'none';
    let body = {
      matchId: this.selectedMatchSettings.matchId,
      matchOddsMaxBet: this.matchSettingsForm.value.matchOddsMaxBet,
      matchOddsMinBet: this.matchSettingsForm.value.matchOddsMinBet,
      bookmakerMaxBet: this.matchSettingsForm.value.bookmakerMaxBet,
      bookmakerMinBet: this.matchSettingsForm.value.bookmakerMinBet,
      fancyMaxBet: this.matchSettingsForm.value.fancyMaxBet,
      fancyMinBet: this.matchSettingsForm.value.fancyMinBet,
      matchOddDelay: this.matchSettingsForm.value.matchOddDelay,
      bookmakerDelay: this.matchSettingsForm.value.bookmakerDelay,
      fancyDelay: this.matchSettingsForm.value.fancyDelay
    }
    this.settingsService._setBetLimitForMatchApi(body).subscribe((data: any) => {
      this._sharedService.getToastPopup("Settings updated.", 'Match Settings', 'success');
      this.getMatchSettingsList();
    })
  }

  onToggleChange(event: Event, matchId) {
    const checkbox = event.target as HTMLInputElement;
    checkbox.classList.toggle('active', checkbox.checked);
    let body = {
      matchId: matchId,
      matchIsActive: checkbox.checked
    }
    this.settingsService._setMatchActiveStatusApi(body).subscribe((data: any) => {
      this._sharedService.getToastPopup("Settings updated.", 'Match Settings', 'success');
    })
  }

}
