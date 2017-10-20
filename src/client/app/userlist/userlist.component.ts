import { Component, OnInit } from '@angular/core';
import { DataService } from '../data/data.service';
import { User } from '../../../common/user';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css'],
  providers: [DataService]
})
export class UserlistComponent implements OnInit {

  users: User[]; 
  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.getUsers()
      .then(users => this.users = users);
  }
}
