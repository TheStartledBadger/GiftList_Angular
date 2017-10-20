import { Component, OnInit } from '@angular/core';
import { User } from '../../../common/user';
import { DataService } from '../data/data.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [ DataService ]
})
export class AdminComponent implements OnInit {

  constructor(private data:DataService) { }

  users: User[];

  ngOnInit() {
    this.data.getUsers()
      .then(users => this.users = users);
  }

  add(username: string): void {
    this.data.addUser(username)
      .then( () => this.data.getUsers()
        .then(users => this.users = users));
  }

  delete(id: number): void{
    this.data.removeUser(id)
    .then(() => this.data.getUsers())
    .then(users => this.users = users);
  }
}
