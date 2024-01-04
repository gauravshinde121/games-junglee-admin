import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AccountStatementService } from '../../services/account-statement.service';
import { SharedService } from '@shared/services/shared.service';
import { formatDate } from '@angular/common';
import * as moment from 'moment';


@Component({
  selector: 'app-commission-lena-dena',
  templateUrl: './commission-lena-dena.component.html',
  styleUrls: ['./commission-lena-dena.component.scss']
})
export class CommissionLenaDenaComponent implements OnInit {



  language = "en";

  commissionStatement:any = [];
  isLoading = false;
  totalFancyCommissionAmount = 0;
  totalBookmakerNetLoosingAmount = 0;
  totalBookmakerEntrywiseLoosing = 0;

  sortColumn: string = '';
  sortAscending: boolean = true;// 1: ascending, -1: descending
  fileName= 'Commission Statement '+'_'+new Date()+'.xlsx';
  playerList:any = [];
  fromDate:any = null;
  toDate:any = null;
  clientId:any = null;
  dateFormat = "yyyy-MM-dd";



  constructor(
    private _accountStatementService: AccountStatementService,
    private _sharedService: SharedService
  ) { }

  ngOnInit(): void {

    this.getAllClients();
    this._preConfig();

  }


  _preConfig(){
    this.fromDate = this.formatFormDate(new Date())
    this.toDate = this.formatFormDate(new Date())
    this.getCommissionReport(true);
  }

  
  getCommissionReport(initialCall,toDate:any=null,fromDate:any=null){

    let paramObj = {
      fromDate:fromDate,
      toDate:toDate,
      clientId:this.clientId
    }

    if(initialCall){
      paramObj = {
        fromDate:null,
        toDate:null,
        clientId:null
      }
    }
    
    this.isLoading = true;
    
    this._accountStatementService._getCommissionReportEndpoint(paramObj).subscribe((res:any)=>{

      if(res.commissionReport){
        this.commissionStatement = res.commissionReport
        this.totalFancyCommissionAmount = this.commissionStatement.reduce((acc, crnt) => acc + crnt.totalFancyTurnOverCommission, 0);
        this.totalBookmakerEntrywiseLoosing = this.commissionStatement.reduce((acc, crnt) => acc + crnt.totalBookmakerEntrywiseLoosingCommission, 0);
        this.totalBookmakerNetLoosingAmount = this.commissionStatement.reduce((acc, crnt) => acc + crnt.totalBookmakerNetLoosingCommission, 0);

      }else{
        this.commissionStatement = []
      }
      this.isLoading = false;
    })
  }

  getAllClients(){
    this._sharedService._getPlayerListApi().subscribe((res:any)=>{
      this.playerList = res.memberData;
    });
  }


  formatFormDate(date: Date) {
    return formatDate(date, this.dateFormat, this.language);
  }



  exportExcel(){
    let pL : any = []
    this.commissionStatement.forEach(element => {
      pL.push({
        Date :  moment(element.createdAt).format("MMM D, YYYY, h:mm:ss a"),
        Game: element.gameName,
        SubGame:element.subGame,
        Event : element.eventName,
        Win_Loss :element.netAmount,
        // Commision:element.commission,
        // NetAmount:element.netAmount,
        // UserCount:element.userCount,
        // BetCount:element.userBetCount
      })
    });
    this._sharedService.exportExcel(pL,this.fileName);
 }


  toggleSort(columnName: string) {
    if (this.sortColumn === columnName) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortColumn = columnName;
      this.sortAscending = true;
    }
  }


  searchCommissionReport(){

    let fromDate = new Date(this.fromDate);
    fromDate.setHours(0)
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);

    let toDate = new Date(this.toDate);
    toDate.setHours(23)
    toDate.setMinutes(59);
    toDate.setSeconds(59);

    if(this.clientId == 'null'){
      this.clientId = null;
    }

    this.getCommissionReport(false,toDate,fromDate);
  }


  resetCommissionReport(obj){

    let payloadObj = {
      userId:obj.userId,
      resultIds:obj.resultIds
    }

    this._accountStatementService._resetCommissionReportEndpoint(payloadObj).subscribe((res)=>{
      this._sharedService.getToastPopup("", 'Commission reset !', 'success');
      this.getCommissionReport(true);
    })

  }


}
