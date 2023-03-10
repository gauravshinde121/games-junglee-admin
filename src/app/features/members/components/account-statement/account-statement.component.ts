import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MembersService } from '../../services/members.service';
import { ActivatedRoute } from '@angular/router';
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

  constructor( private _memberService:MembersService,private route:ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params.subscribe(params=>{
      this.userId = +params['id'];
    })

    this._preConfig();
  }



  _preConfig(){
    this._initForm();
    this.getAccountStatement();
  }


  _initForm(){
    this.filterForm = new FormGroup({
      fromDate:new FormControl(this.formatDate(new Date())),
      toDate:new FormControl(this.formatDate(new Date())),
      game:new FormControl('All'),
      keyword:new FormControl('All'),
      page:new FormControl(1),
      subGame:new FormControl('All'),
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

}
