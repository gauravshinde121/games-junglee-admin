import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AccountStatementService } from '../../services/account-statement.service';
import { SharedService } from '@shared/services/shared.service';
import { MembersService } from 'src/app/features/members/services/members.service';
import { nameValidator } from '@shared/classes/validator';

@Component({
  selector: 'app-player-pl',
  templateUrl: './player-pl.component.html',
  styleUrls: ['./player-pl.component.scss']
})
export class PlayerPlComponent implements OnInit {

  filterForm:FormGroup;
  plStatement:any = [];
  games:any;
  matchList:any = [];

  constructor(
    private _memberService:MembersService,
    private _accountStatementService:AccountStatementService,
    private _sharedService:SharedService,
    private _fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this._preConfig();
    this.filterForm.get('gameId')?.valueChanges.subscribe((selectedValue) => {
      console.log('Selected value: ', selectedValue);
      this._getMatchBySportId(selectedValue);
    });
  }

  _preConfig(){
    this._initForm();
    this._getGames();
    this.getPlStatement();
  }

  get f(){
    return this.filterForm.controls;
  }

  _initForm(){
    this.filterForm = this._fb.group({
      fromDate:new FormControl(new Date()),
      toDate:new FormControl(new Date()),
      memberName: [
        "",
        {
          validators: [nameValidator("Member Name", 1, 25)],
          updateOn: "change",
        },
      ],
      gameId:new FormControl("All"),
      matchId:new FormControl("All"),
      page:new FormControl(1),
      keyword:new FormControl("All"),
      tms:new FormControl("All"),
      type:new FormControl("All"),
      typeName:new FormControl("All")
    })
  }

  _getGames(){
    this._sharedService._getEvents().subscribe((data:any)=>{
      if(data.gamesList){
        this.games = data.gamesList;
      }
    });
  }

  getPlStatement(){
    this._accountStatementService._getDownlineAccountsDataApi(this.filterForm.value).subscribe((res:any)=>{
      console.log(res)
      this.plStatement = res.admin
    })
  }

  getOneAccount(pl){
    console.log(pl)
  }

  _getMatchBySportId(sportId){
    this._sharedService.getMatchBySportId(sportId).subscribe((data:any)=>{
      if(data.matchList){
        this.matchList = data.matchList;
        //console.log('data.matchList',data.matchList);
      }
    });
  }

  clearMembers(){
    this.filterForm.controls['memberName'].reset()
  }


}
