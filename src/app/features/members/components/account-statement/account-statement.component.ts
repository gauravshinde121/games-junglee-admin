import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MembersService } from '../../services/members.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.scss']
})
export class AccountStatementComponent implements OnInit {

  currentDate = new Date();
  fromDate = new Date().toString();
  toDate = new Date().toString();
  accountStatement:any = [];
  filterForm: FormGroup;
  userId:any = null;
  display = "";
  selectedAccount:any = null;
  games:any;
  matchList:any = [];
  dateFormat = "yyyy-MM-dd";
  language = "en";

  constructor(
    private _memberService:MembersService,
    private route:ActivatedRoute,
    private _sharedService:SharedService,
    private _fb: FormBuilder,
    ) { }

  ngOnInit(): void {

    this.route.params.subscribe(params=>{
      this.userId = +params['id'];
    })

    this._preConfig();
    this.filterForm.get('sportsId')?.valueChanges.subscribe((selectedValue) => {
      console.log('Selected value: ', selectedValue);
      this._getMatchBySportId(selectedValue);
    });
  }



  _preConfig(){
    this._initForm();
    this.getAccountStatement();
    this._getGames();
  }


  _initForm(){
      this.filterForm = this._fb.group({
      fromDate : this.formatFormDate(new Date()),
      toDate : this.formatFormDate(new Date()),
      sportsId:new FormControl(null),
      keyword:new FormControl(null),
      matchId:new FormControl(null),
      tms:new FormControl(null),
      type:new FormControl(null),
      typeName:new FormControl('All'),
    });
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat,this.language);
  }


  showDetails(account){
    console.log(account)
  }

  openModal(account){
    this.display = 'block';
    this.selectedAccount = account;
  }

  closeModal(){
    this.display = 'none';
  }

  getAccountStatement(){

    console.log(this.filterForm.value)

    this._memberService._getDownlineAccountsDataForMemberApi({...this.filterForm.value,userId:this.userId}).subscribe((data:any)=>{
      console.log(data);
      this.accountStatement = data.data;
    })
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


  _getGames(){
    this._sharedService._getSports().subscribe((data:any)=>{
      if(data.gamesList){
        this.games = data.gamesList;
      }
    });
  }

  _getMatchBySportId(sportId){
    this._sharedService.getMatchBySportId(sportId).subscribe((data:any)=>{
      if(data.matchList){
        this.matchList = data.matchList;
        //console.log('data.matchList',data.matchList);
      }
    });
  }

  onGameSelected(sportId){
    this._getMatchBySportId(sportId);
  }

}
