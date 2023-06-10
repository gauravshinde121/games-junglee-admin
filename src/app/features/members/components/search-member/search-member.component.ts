import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../services/members.service';
import { SharedService } from '../../../../shared/services/shared.service';

@Component({
  selector: 'app-search-member',
  templateUrl: './search-member.component.html',
  styleUrls: ['./search-member.component.scss']
})
export class SearchMemberComponent implements OnInit {

  memberList: any = [];
  isLoading = false;
  searchTerm: string = '';
  memberHierarchy:any = [];

  constructor(
    private _membersService: MembersService,
    private _sharedService:SharedService
  ) { }

  ngOnInit(): void {
    this._preConfig();
  }

  _preConfig() {
  }

  search(): void {
    if(this.searchTerm.length > 2){
      let body = {
        searchText: this.searchTerm,
      };
      this._membersService._searchMembersApi(body).subscribe((users: any) => {
        this.isLoading = false;
        this.memberList = users.memberList;
      });
    }
  }

  searchMember(member){
    this.memberHierarchy = [];
    this._sharedService.getUplineSummaryApi(member.userId).subscribe((res)=>{
      this.memberHierarchy = res;
      this.memberHierarchy.push(member)
    });
  }

  clearSearch(){
    this.searchTerm = '';
    let body = {
      searchText: this.searchTerm,
    };
    this._membersService._searchMembersApi(body).subscribe((users: any) => {
      this.isLoading = false;
      this.memberList = users.memberList;
      this.memberHierarchy = [];
    });
  }

}
