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
  isLoading = false;
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 25;
  totalPages: number = 0;


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
    });
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat,this.language);
  }


  next(): void {
    this.currentPage++;
    this.getAccountStatement();
  }

  prev(): void {
    this.currentPage--;
    this.getAccountStatement();
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

    this.isLoading = true;

    let fromDate = new Date(this.filterForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.filterForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    let body = {
      fromDate : fromDate,
      toDate : toDate,
      sportsId : this.filterForm.value.sportsId,
      userId: this.userId,
      pageNo: this.currentPage,
      limit: 50,
    }

    this._memberService._getDownlineAccountsDataForMemberApi(body).subscribe((data:any)=>{
      console.log(data);
      this.isLoading = false;
      this.accountStatement = data.data;
      this.totalPages = Math.ceil(this.accountStatement.length / this.pageSize);

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
      if(data){
        this.games = data;
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
