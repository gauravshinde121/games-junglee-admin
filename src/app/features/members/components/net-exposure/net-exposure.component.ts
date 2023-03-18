import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private _memberService: MembersService, private route: ActivatedRoute) { }

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

    console.log(payload)

    this._memberService._getMemberBooksForBackedApi(payload).subscribe((data: any) => {
      console.log(data)
      this.booksForBackend = data.booksForBackend;
      this.isLoading = false;
    })
  }

}
