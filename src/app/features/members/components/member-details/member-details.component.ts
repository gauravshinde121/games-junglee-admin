import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss']
})
export class MemberDetailsComponent implements OnInit {

  username:any = null;
  createdDate = null;
  userId = null;

  constructor(private route:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this.username = this.route.snapshot.params['username'];
    this.createdDate = this.route.snapshot.params['createdDate'];
    this.userId = this.route.snapshot.params['userId'];

    this.router.navigate(['activity', this.userId], { relativeTo: this.route });
  }

  navigate(route){
    this.router.navigate([`${route}/${this.userId}`], {relativeTo: this.route});
  }

}
