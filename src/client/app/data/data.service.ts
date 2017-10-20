import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Headers, Http } from '@angular/http';

import { User } from '../../../common/user';
import { Gift } from '../../../common/gift';

@Injectable()
export class DataService {

  // Constructor
  constructor(private http: HttpClient) { }
  
  /**
   *  USERS
   */

  getUsers(): Promise<User[]> {
    return this.http.get("/api/users")
    .toPromise()
    .then(response => response as User[])
    .catch(this.handleError);
  }  

  getUser(userid: number): Promise<User> {
    return this.getUsers().then(users => {
        var filtered = users.filter(aUser => aUser.id === userid);
        if(filtered) return filtered[0]
        else return null;
      }
    );
  }

  addUser(username: string): Promise<void> {
    var body = { newUsername: username};
    return this.http.post("/api/users", body)
      .toPromise()
      .catch(this.handleError);
  }

  removeUser(id: number): Promise<void> {
    return this.http.delete("/api/users/"+id)
      .toPromise()
      .catch(this.handleError);
  }

  /**
   *  GIFTS
   */
  getGifts(user: User): Promise<Gift[]> {
    return this.http.get("/api/gifts/"+user.id)
      .toPromise()
      .then(response => response as Gift[])
      .catch(this.handleError);
  }

  addGift(title: string, cost: string, where: string, userFor: number): Promise<void> {
    var body = { title: title, userFor: userFor, where: where, cost: cost};
    return this.http.post("/api/gifts", body)
      .toPromise()
      .catch(this.handleError);
  }

  removeGift(gift: Gift): Promise<void> {
    return this.http.delete("/api/gifts/"+gift.id)
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
