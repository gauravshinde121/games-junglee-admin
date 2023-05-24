import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from '../../services/members.service';
import { SharedService } from '@shared/services/shared.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { formatDate } from '@angular/common';


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
  dateFormat = "yyyy-MM-dd";
  language = "en";
  isLoading : boolean = false;


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
      this.searchActivityForm.patchValue({marketId:null});
      this._getAllMarkets(selectedValue)
    });
  }


  _initForm(){
    this.searchActivityForm = this._fb.group({
      agent:new FormControl(true),
      sportsId:new FormControl(null),
      marketId:new FormControl(null),
      fromDate : this.formatFormDate(new Date()),
      toDate : this.formatFormDate(new Date())
    });
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat,this.language);
  }


  onSubmitSearchActivityForm(){

    this.isLoading = true;

    let fromDate = new Date(this.searchActivityForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.searchActivityForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    let payload = {
      refUserId:this.userId,
      fromDate: fromDate,
      toDate: toDate,
      agent:this.searchActivityForm.value.agent,
      marketId:this.searchActivityForm.value.marketId,
      sportId:this.searchActivityForm.value.sportsId
    }
    this._memberService._getMemberActivityApi(payload).subscribe((res:any)=>{
      this.isLoading = false;
      this.activityData = res.data;
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

  // _getMatchBySportId(sportId){
  //   this._sharedService.getMatchBySportId(sportId).subscribe((data:any)=>{
  //     console.log(data)
  //     if(data.matchList){
  //       this.matchList = data.matchList;
  //       console.log('matchList',this.matchList)
  //     }
  //   });
  // }


  _onSportSelect(){
    console.log(this.searchActivityForm.value)
    this.searchActivityForm.patchValue({marketList:null});
    this._getAllMarkets(this.searchActivityForm.value.sportsId)
  }

  _getAllMarkets(sportId){
    if(!sportId) return
    this._sharedService.getMarketBySportId(sportId).subscribe((data:any)=>{
      console.log('market types',data.data);
      if(data){
        this.marketList = data.data;
        //console.log('data.matchList',data.matchList);
      }
    });
  }


  // onGameSelected(sportId){
  //   console.log(sportId)
  //   this._getMatchBySportId(sportId);
  // }

  searchActivity(){

    this.isLoading = true;

    let fromDate = new Date(this.searchActivityForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.searchActivityForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    if(this.searchActivityForm.value.sportsId == 'null'){
      this.searchActivityForm.patchValue( {'sportsId':null} );
    }
    if(this.searchActivityForm.value.marketId == 'null'){
      this.searchActivityForm.patchValue( {'marketId':null} );
    }
    let payload = {
      refUserId:this.userId,
      fromDate: fromDate,
      toDate: toDate,
      agent:this.searchActivityForm.value.agent,
      marketId:this.searchActivityForm.value.marketId,
      sportId:this.searchActivityForm.value.sportsId
    }

    this._memberService._getMemberActivityApi(payload).subscribe((res:any)=>{
      console.log('search',res);
      this.isLoading = false;
      this.activityData = res.data;
      console.log('activity',this.activityData)
    })
  }



}
