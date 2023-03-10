import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from '../../services/members.service';

@Component({
  selector: 'app-bet-list',
  templateUrl: './bet-list.component.html',
  styleUrls: ['./bet-list.component.scss']
})
export class BetListComponent implements OnInit {

  fromDate = new Date().toString();
  toDate = new Date().toString();
  currentDate = new Date().toString();
  userId:any = null;
  betList:any = []
  filterForm: FormGroup;


  constructor(private _memberService:MembersService,private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      this.userId = +params['id'];
    })

    this._preconfig();
  }

  _preconfig(){
    this._initForm();
    this.getMemberBets()
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
      betType:new FormControl("Matched"),
      time:new FormControl("All")
    });
  }


  getMemberBets(){
    this._memberService._getMemberBetseApi({...this.filterForm.value,userId:this.userId})
      .subscribe((res:any)=>{
      console.log(res)
      if(res){
        this.betList = res.data.betList
      }
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
