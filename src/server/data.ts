import { User } from '../common/user';
import { Gift } from '../common/gift';
import * as crypto from 'crypto';

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
            database.run("CREATE TABLE if not exists user (name TEXT NOT NULL, hashedPWD TEXT NOT NULL, salt TEXT NOT NULL)");
            database.run("CREATE TABLE if not exists gift ( title TEXT NOT NULL, cost TEXT, whereseen TEXT, userFor number, boughtby number)");
        });        

        this.addUserStmt = database.prepare("INSERT INTO user values (?,?,?)");
        this.addGiftStmt = database.prepare("INSERT INTO gift values (?,?,?,?,?)");
        console.log("Finished constructing DATA object");
        
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
        
    public createUser(newUsername: string, password: string): Promise<void> {
        return new Promise<void>(
            (resolve, reject) => {
                console.log("Adding user ", newUsername);
                var salt: string = crypto.randomBytes(128).toString('base64');
                var hashedPwd: string = this.hashPassword(password, salt);
                this.addUserStmt.run(newUsername, hashedPwd, salt,
                    (err: any) => err && console.log("Add user error: " , err),  // error
                    () => {
                        console.log("Seemed to work ok"); 
                        this.getUsers();
                        resolve()
                    });  // success
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
    };

    public findUserByName(name: string): Promise<User> {
        return new Promise<User>(
            (resolve,reject) => {
                this.db.each("SELECT rowid from USER where name='"+name+"'",
            (err: any, row: any) => {
                if ( err ){
                    console.log("Failure fetching user " + name, err);
                    reject(err);
                }
                if ( row ){
                    console.log("Found user " + name);
                    resolve({ "id" : row.rowid, "name": name});
                }
            })
        });
    };

    public findUserById(id: number): Promise<User> {
        return new Promise<User>(
            (resolve,reject) => {
                this.db.each("SELECT name from USER where rowid="+id,
            (err: any, row: any) => {
                if ( err ){
                    console.log("Failure fetching user " + id, err);
                    reject(err);
                }
                if ( row ){
                    console.log("Found user " + id);
                    resolve({ "id" : row.rowid, "name": row.name});
                }
            })
        });
    };


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
        console.log("Add gift", title, userFor, cost, where);
        return new Promise<void>(
            (resolve, reject) => {
                this.addGiftStmt.run(title, cost, where, userFor, undefined, 
                    (err: any) => err && console.log("Add gift error: " , err),  // error
                    () => {console.log("Added gift"); resolve();});  // success
            });
    };

    public deleteGift(id: number): Promise<void> {
        return new Promise<void>(
            (resolve, reject) => {
                this.db.run("DELETE from GIFT where rowid="+id,
                (err: any) => err && console.log("Delete gift error: " , err),  // error
                () => resolve());  // success
        });
    };
    
    public checkLogon(username: string, password: string): Promise<boolean> {
        var self = this;
        return new Promise<boolean>(
            (resolve, reject) => {
                this.db.get('SELECT salt FROM user WHERE name = ?', username, function(err: any, row: any) {
                console.log("Selecting user ", username )
                if (!row) resolve(false);
                else {
                    console.log("Found user, salt is ", row.salt);
                    var hash = self.hashPassword(password, row.salt);
                    self.db.get('SELECT name, rowid FROM user WHERE name = ? AND hashedPWD = ?', username, hash, 
                        function(err: any, row: any) {
                            if (!row) resolve(false);
                            else resolve(true);
                        }
                    )
                }
            });
        });
    };

    public hashPassword(password: string, salt: string): string {
        var hash = crypto.createHash('sha256');
        hash.update(password);
        hash.update(salt);
        return hash.digest('hex');
    };
}
  