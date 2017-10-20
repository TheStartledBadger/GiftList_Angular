import { User } from '../common/user';
import { Gift } from '../common/gift';

const sqlite3: any = require('sqlite3').verbose();

// Database Access Class
export class Data {
    private db: any;
    private addUserStmt: any;
    private addGiftStmt: any;

    public constructor(){
        console.log("Constructing DATA object");
        var database = new sqlite3.Database('mydb.db');
        this.db = database;
        
        // ensure tables exist at startup
        database.serialize(function() {
            database.run("CREATE TABLE if not exists user (name TEXT)");
            database.run("CREATE TABLE if not exists gift ( title TEXT NOT NULL, cost TEXT, whereseen TEXT, userFor number, boughtby number)");
        });        

        this.addUserStmt = database.prepare("INSERT INTO user values (?)");
        this.addGiftStmt = database.prepare("INSERT INTO gift values (?,?,?,?,?)");
        
    };

    public getUsers(): Promise<User[]> {
        return new Promise<User[]>(
            (resolve, reject) => {
                var userList: User[] = []
                this.db.each("SELECT rowid, name from user", 
                    (err: any, row: any) => {  // per row
                        console.log("User " + row.name + "("+row.rowid+")")
                        userList.push({id: row.rowid, name: row.name})
                    }, // on completion
                    () => resolve(userList));
            });
    };
        
    public createUser(newUsername: string): Promise<void> {
        return new Promise<void>(
            (resolve, reject) => {
                this.addUserStmt.run(newUsername, 
                    (err: any) => err && console.log("Add user error: " , err),  // error
                    () => resolve());  // success
            });
    };
 
    public deleteUser(id: number): Promise<void> {
        return new Promise<void>(
            (resolve, reject) => {
                this.db.run("DELETE from GIFT where userFor="+id,
                (err: any) => err && console.log("Delete user error: " , err),  // error
                () => console.log("Deleted gifts"));  // success
                this.db.run("DELETE from USER where rowid="+id,
                (err: any) => err && console.log("Delete user error: " , err),  // error
                () => resolve());  // success
        });
    }


    public getGifts(user: number): Promise<Gift[]> {
        return new Promise<Gift[]>(
            (resolve, reject) => {
                var giftList: Gift[] = [];
                this.db.each("SELECT rowid, title, cost, whereseen, userFor, boughtby from gift where userFor="+user, 
                    (err: any, row: any) => {  // per row
                        row && console.log("Gift row ", row);
                        giftList.push({id: row.rowid, title: row.title, cost: row.cost, where: row.whereseen, userFor: row.userFor, boughtby: row.boughtby});
                        err && console.log("Error getting gift list ", err);
                    }, // on completion
                    () => resolve(giftList));
            });
    };
        
    public createGift(title: string, cost: string, where: string, userFor: number): Promise<void> {
        console.log("Add gift", title, userFor);
        return new Promise<void>(
            (resolve, reject) => {
                this.addGiftStmt.run(title, userFor, cost, where, undefined, 
                    (err: any) => err && console.log("Add gift error: " , err),  // error
                    () => resolve());  // success
            });
    };

    public deleteGift(id: number): Promise<void> {
        return new Promise<void>(
            (resolve, reject) => {
                this.db.run("DELETE from GIFT where rowid="+id,
                (err: any) => err && console.log("Delete gift error: " , err),  // error
                () => resolve());  // success
        });
    }    
}
  