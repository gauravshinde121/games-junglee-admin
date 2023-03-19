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
  userId:any = null;
  activityData :any = []
  games:any;
  matchList:any = [];
  marketList:any = [];
  isChecked: boolean = true;

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

    this.searchActivityForm.get('sportsId')?.valueChanges.subscribe((selectedValue) => {
      console.log('Selected value: ', selectedValue);
      this._getMatchBySportId(selectedValue);
    });
  }


  _initForm(){
    this.searchActivityForm = new FormGroup({
      agent:new FormControl(true),
      sportsId:new FormControl(null),
      marketId:new FormControl(null),
      fromDate:new FormControl(this.formatDate(new Date())),
      toDate:new FormControl(this.formatDate(new Date()))
    });
  }


  onSubmitSearchActivityForm(){
    this._memberService._getMemberActivityApi({...this.searchActivityForm.value,refUserId:this.userId}).subscribe((res:any)=>{
      console.log('search',res);
      this.activityData = res.data;
      console.log('activity',this.activityData)
    })
  }

  _preConfig(){
    this._getGames();
    this._initForm();
    this.searchActivity();
  }

  _getGames(){
    this._sharedService._getSports().subscribe((data:any)=>{
      console.log(data)
      if(data){
        this.games = data;
        console.log('this.games',this.games);
      }
    });
  }

  _getMatchBySportId(sportId){
    this._sharedService.getMatchBySportId(sportId).subscribe((data:any)=>{
      console.log(data)
      if(data.matchList){
        this.matchList = data.matchList;
        console.log('matchList',this.matchList)
      }
    });
  }


  _onSportSelect(){
    console.log(this.searchActivityForm.value)
    this._getAllMarkets(this.searchActivityForm.value.sportsId)
  }

  _getAllMarkets(sportId){
    this._sharedService.getMarketBySportId(sportId).subscribe((data:any)=>{
      console.log('market types',data.data);
      if(data){
        this.marketList = data.data;
        //console.log('data.matchList',data.matchList);
      }
    });
  }


  onGameSelected(sportId){
    console.log(sportId)
    this._getMatchBySportId(sportId);
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

  searchActivity(){
    console.log('poiut');

    this._memberService._getMemberActivityApi({...this.searchActivityForm.value,refUserId:this.userId}).subscribe((res:any)=>{
      console.log('search',res);
      this.activityData = res.data;
      console.log('activity',this.activityData)
    })
  }



}
