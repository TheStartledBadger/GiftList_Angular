import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/switchMap';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { DataService } from '../data/data.service';
import { Gift } from '../../../common/gift';
import { User } from '../../../common/user';


@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.css'],
  providers: [ DataService ]
})
export class UserpageComponent implements OnInit {
 
  gifts: Gift[];
  user: User;

  constructor(
    private data: DataService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.data.getUser(+params.get('id')))
      .subscribe(user =>{
        console.debug (user); 
        this.user = user;
        this.data.getGifts(this.user)
          .then(giftResponse => this.gifts = giftResponse)
      });
  }

  public add(title: string, cost: string, where:string): void {
    console.log("Add gift ", title, cost, where, this.user);
    this.data.addGift(title, cost, where, this.user.id )
      .then(() => this.data.getGifts(this.user))
      .then(giftResponse => this.gifts = giftResponse);
  }
  
  public remove(gift: Gift): void {
    console.log("Remove gift ", gift.id);
    this.data.removeGift(gift)
      .then(() => this.data.getGifts(this.user))
      .then(giftResponse => this.gifts = giftResponse);
  }
}
