import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from '../../services/members.service';
import { SharedService } from '@shared/services/shared.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})

export class ActivityComponent implements OnInit {

  searchActivityForm: FormGroup;
  currentDate = new Date();
  fromDate = new Date().toString();
  toDate = new Date().toString();
  userId: any = null;
  activityData: any = [];
  games: any;
  matchList: any = [];

  constructor(
    private _fb: FormBuilder,
    private _memberService: MembersService,
    private route: ActivatedRoute,
    private _sharedService: SharedService
  ) {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
    })
  }

  ngOnInit(): void {
    this._preConfig();
    this.searchActivityForm.get('gameId')?.valueChanges.subscribe((selectedValue) => {
      console.log('Selected value: ', selectedValue);
      this._getMatchBySportId(selectedValue);
    });
  }


  _initForm() {
    this.searchActivityForm = new FormGroup({
      fromDate: new FormControl(this.formatDate(new Date())),
      toDate: new FormControl(this.formatDate(new Date())),
      gameId: new FormControl('All'),
      keyword: new FormControl('All'),
      page: new FormControl(1),
      matchId: new FormControl('All'),
      tms: new FormControl('All'),
      filter: new FormControl("Agent"),
    });
  }


  onSubmitSearchActivityForm() {
    this._memberService._getMemberActivityApi({ ...this.searchActivityForm.value, refUserId: this.userId }).subscribe((res: any) => {
      this.activityData = res.data;
    })
  }

  _preConfig() {
    /*this._sharedService._getGames().subscribe((res:any)=>{
      this.games = res.gamesList;
    });*/
    this._initForm();
    this.searchActivity();
    this._getGames();
  }

  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [day, month, year].join('/');
  }

  searchActivity() {
    let body = {
      refUserId: this.userId,
      fromDate: this.fromDate,
      toDate: this.toDate,
      filter: "Agent",
      subGame: "All"
    }
    this._memberService._getMemberActivityApi(body).subscribe(((res: any) => {
      if (res) {
        this.activityData = res.data;
      }
    }))
  }


  _getGames() {
    this._sharedService._getEvents().subscribe((data: any) => {
      if (data.gamesList) {
        this.games = data.gamesList;
      }
    });
  }

  _getMatchBySportId(sportId) {
    this._sharedService.getMatchBySportId(sportId).subscribe((data: any) => {
      if (data.matchList) {
        this.matchList = data.matchList;
      }
    });
  }


  onGameSelected(sportId) {
    this._getMatchBySportId(sportId);
  }

}
