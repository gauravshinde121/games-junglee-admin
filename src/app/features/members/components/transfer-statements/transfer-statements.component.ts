import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '@shared/services/shared.service';
import { formatDate } from '@angular/common';
@Component({
  selector: 'app-transfer-statements',
  templateUrl: './transfer-statements.component.html',
  styleUrls: ['./transfer-statements.component.scss']
})
export class TransferStatementsComponent implements OnInit {

  transferStatements: any = [];
  currentDate = new Date();
  fromDate = new Date().toString();
  toDate = new Date().toString();
  userId:any = null;
  filterForm:FormGroup;
  dateFormat = "yyyy-MM-dd";
  language = "en";
  isLoading = false;
  currentPage: number = 1;
  pageSize: number = 25;
  totalPages: number = 0;

  sortColumn: string = '';
  sortAscending: boolean = true;// 1: ascending, -1: descending

  constructor(
    private _memberService: MembersService,
    private route: ActivatedRoute,
    private _sharedService: SharedService,
    private _fb: FormBuilder) {

    this.route.params.subscribe(params => {
      this.userId = +params['id'];
    })
   }

  ngOnInit(): void {
    this._preConfig();
  }

  _initForm(){
    this.filterForm = this._fb.group({
      fromDate : this.formatFormDate(new Date()),
      toDate : this.formatFormDate(new Date()),

    })
  }

  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat,this.language);
  }


  _preConfig(){
    this._initForm();
    this.getTransferStatement();
  }

  getTransferStatement() {
    this.isLoading = true;

    let fromDate = new Date(this.filterForm.value.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.filterForm.value.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    const payload= {
      fromDate: fromDate,
      toDate: toDate,
      userId:this.userId,
      pageNo: this.currentPage,
      limit: 50,
    }

    this._memberService._getTransferStatementForUserApi(payload).subscribe((data: any) => {
      this.isLoading = false;
      this.transferStatements = data.transferStatement;
      this.totalPages = Math.ceil(this.transferStatements.length / this.pageSize);
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

  next(): void {
    this.currentPage++;
    this.getTransferStatement();
  }

  prev(): void {
    this.currentPage--;
    this.getTransferStatement();
  }

  toggleSort(columnName: string) {
    if (this.sortColumn === columnName) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = columnName;
      this.sortAscending = true;
    }
  }


}
