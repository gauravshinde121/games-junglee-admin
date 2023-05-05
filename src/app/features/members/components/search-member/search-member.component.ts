import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../services/members.service';

@Component({
  selector: 'app-search-member',
  templateUrl: './search-member.component.html',
  styleUrls: ['./search-member.component.scss']
})
export class SearchMemberComponent implements OnInit {

  userList: any = [];
  isLoading = false;
  searchTerm: string = '';

  constructor(
    private _membersService: MembersService,
  ) { }

  ngOnInit(): void {
    this._preConfig();
  }

  _preConfig() {
  }

  search(): void {
    if(this.searchTerm.length > 2){
      console.log('searchTerm',this.searchTerm);
      let body = {
        searchName: this.searchTerm,
      };
      this._membersService._searchMembersApi(body).subscribe((users: any) => {
        this.isLoading = false;
        this.userList = users.memberData.memberList;
      });
    }
  }

}
