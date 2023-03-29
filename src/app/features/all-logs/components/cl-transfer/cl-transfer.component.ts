import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AllLogsService } from '../../services/all-logs.service';
import { MembersService } from 'src/app/features/members/services/members.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-cl-transfer',
  templateUrl: './cl-transfer.component.html',
  styleUrls: ['./cl-transfer.component.scss']
})
export class ClTransferComponent implements OnInit {

  filterForm:FormGroup;
  dateFormat = "yyyy-MM-dd";
  clTransfers:any = [];
  isLoading = false;
  language = "en";
  currentPage: number = 1;
  totalPages: number = 0;
  pageSize: number = 50;
  allMembers:any = [];
  memberId:any = null;
  limit:number = 50;

  constructor(
    private allLogService:AllLogsService,
    private _memberService:MembersService
  ) { }

  ngOnInit(): void {
    this._preConfig()
  }

  _preConfig(){
    this._initForm();
    this._getAllMembers();
    this.getClTransfers();
  }

  _initForm(){
    this.filterForm = new FormGroup({
      memberName:new FormControl(null),
      fromDate:new FormControl(this.formatFormDate(new Date())),
      toDate:new FormControl(this.formatFormDate(new Date())),
    })
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat,this.language);
  }

  getClTransfers(){
    this.isLoading = true;
    this.clTransfers = [];
    let fromDate = new Date(this.filterForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.filterForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);
    let body = {
      fromDate: fromDate,
      toDate: toDate,
      memberId: this.filterForm.value.memberName,
      pageNo: this.currentPage,
      limit: this.limit,
    }
    this.allLogService._getClTransferApi(body).subscribe((data:any)=>{
      this.isLoading = false;
      if(data.clTransferStatement.clTrnsfers){
        this.clTransfers = data.clTransferStatement.clTrnsfers
      }
      this.totalPages = Math.ceil(data.clTransferStatement.totalNoOfRecords / this.pageSize);
    })
  }

  _getAllMembers(){
    this._memberService._getAllMembers().subscribe((data:any)=>{
      if(data.memberData){
        this.allMembers = data.memberData;
      }
    });
  }

  next(): void {
    this.currentPage++;
    this.getClTransfers();
  }

  prev(): void {
    this.currentPage--;
    this.getClTransfers();
  }

}
