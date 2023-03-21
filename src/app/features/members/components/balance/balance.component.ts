import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MembersService } from '../../services/members.service';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit {

  userId:any = null;
  memberBalance:any = null;
  isLoading : boolean = false;

  constructor(private _memberService:MembersService,private route:ActivatedRoute) {
    this.route.params.subscribe(params=>{
      this.userId = +params['id'];
    })
   }

  ngOnInit(): void {
    this.getMemberBalance();
  }


  getMemberBalance(){
    this.isLoading = true;
    
    this._memberService._getMemberBalanceApi({userId:this.userId}).subscribe((res:any)=>{
      console.log(res)
      this.isLoading = false;
      if(res){
        this.memberBalance = res.memberBalance
      }
    })
  }

}
