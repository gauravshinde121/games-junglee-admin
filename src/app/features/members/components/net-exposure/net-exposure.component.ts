import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MembersService } from '../../services/members.service';

@Component({
  selector: 'app-net-exposure',
  templateUrl: './net-exposure.component.html',
  styleUrls: ['./net-exposure.component.scss']
})
export class NetExposureComponent implements OnInit {

  userId:any;
  booksForBackend:any = [];
  isLoading = false;

  constructor(private _memberService: MembersService, private route: ActivatedRoute,
    private _router:Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = +params['id'];
    })
    this._preConfig();
  }


  _preConfig(){
    this.getMemberBooksForBackend();
  }


  getMemberBooksForBackend() {
    this.isLoading = true;
    const payload= {
      userId:this.userId
    }
    this._memberService._getMemberBooksForBackedApi(payload).subscribe((data: any) => {
      this.booksForBackend = data.booksForBackend;
      this.isLoading = false;
    })
  }

  redirectUrl(type,id,matchName){
    localStorage.setItem('matchName',matchName);
    this._router.navigate(['/member/workstation/'+type+'/'+id+'/'+this.userId]);
  }

}
