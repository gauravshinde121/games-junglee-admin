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
  activityData:any = []
  games:any;

  constructor(
    private _fb: FormBuilder,
    private _memberService:MembersService,
    private route:ActivatedRoute,
    private _sharedService:SharedService
    ) {
    this.route.params.subscribe(params=>{
      this.userId = +params['id'];
    })
   }

  ngOnInit(): void {
    this._preConfig();
  }


  _initForm(){
    this.searchActivityForm = new FormGroup({
      fromDate:new FormControl(this.formatDate(new Date())),
      toDate:new FormControl(this.formatDate(new Date())),
      game:new FormControl('All'),
      keyword:new FormControl('All'),
      page:new FormControl(1),
      subGame:new FormControl('All'),
      tms:new FormControl('All'),
      type:new FormControl('All'),
      typeName:new FormControl('All'),
      filter:new FormControl("Agent"),
    });
  }


  onSubmitSearchActivityForm(){
    this._memberService._getMemberActivityApi({...this.searchActivityForm.value,refUserId:this.userId}).subscribe((res:any)=>{
      console.log(res);
      this.activityData = res.data;
    })
  }

  _preConfig(){
    this._sharedService._getGames().subscribe((res:any)=>{
      this.games = res.gamesList;
      console.log('this.games',this.games);
    });
    this._initForm();
    this.searchActivity();
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
    this._memberService._getMemberActivityApi({refUserId:this.userId,fromDate:this.fromDate,toDate:this.toDate,filter:"Agent",subGame:"All"}).subscribe(((res:any)=>{
      console.log(res);
      if(res){
        this.activityData = res.data;
      }
    }))
  }

}
