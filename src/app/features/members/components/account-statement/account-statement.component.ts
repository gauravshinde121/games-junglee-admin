import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MembersService } from '../../services/members.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
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

  constructor(
    private _memberService:MembersService,
    private route:ActivatedRoute,
    private _sharedService:SharedService
    ) { }

  ngOnInit(): void {

    this.route.params.subscribe(params=>{
      this.userId = +params['id'];
    })

    this._preConfig();
    this.filterForm.get('gameId')?.valueChanges.subscribe((selectedValue) => {
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
    this.filterForm = new FormGroup({
      fromDate:new FormControl(this.formatDate(new Date())),
      toDate:new FormControl(this.formatDate(new Date())),
      gameId:new FormControl('0'),
      keyword:new FormControl('All'),
      page:new FormControl(1),
      matchId:new FormControl('0'),
      tms:new FormControl('All'),
      type:new FormControl('All'),
      typeName:new FormControl('All'),
    });
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
    this._sharedService._getEvents().subscribe((data:any)=>{
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
