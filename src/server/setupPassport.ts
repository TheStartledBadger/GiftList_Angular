import * as express from 'express';
import * as expressSession from 'express-session';
import * as passport from 'passport';
import * as passportLocal  from 'passport-local';
import { Data } from './data';



export class PassportSetup {
    data: Data;
    
    public constructor(){};

    public setupPassport(app: express.Application, dataIn: Data): express.RequestHandler {
        var self = this;
        const data = this.data = dataIn;
        console.log("DataIn is ", dataIn);
        console.log("Data is ", data);
        console.log("This.data is ", this.data);
        passport.use(new passportLocal.Strategy(function(username, password, done) {
            var result = data.checkLogon(username, password);
            if(result){
              self.data.findUserByName(username)
                .then(user => done(null, user));
            } else done(null, false);
        }));

        passport.serializeUser(function(user: any, done: any) {
            done(null, user.id);
        });
        
        passport.deserializeUser(function(id: any, done: any) {
            self.data.findUserById(id)
                .then(user => done(null, user));
        });

        // Authentication framework
        app.use(expressSession(
            { secret: "foobar",
            saveUninitialized: true,
            resave: true})
        );
        app.use(passport.initialize());
        app.use(passport.session());

        app.post('/login',
            (req: express.Request, res:express. Response, next: express.NextFunction)  => {
                console.log("Login post called: ", req.body);
                next();
            },
            passport.authenticate('local', { successRedirect: '/',
                                        failureRedirect: '/login',
                                        failureFlash: false }),
            (req: express.Request, res:express. Response, next: express.NextFunction)  => {
                console.log("Login post finished");
                next();
            }
        );

        app.post('/register',
            (req: express.Request, res:express.Response, next: express.NextFunction)  => {
               console.log("Register post called ", req.body);
               this.data.createUser(req.body.username, req.body.password)
                    .then(() => next());
            }
        );

        app.all('/logout', (req: express.Request, res:express.Response, next: express.NextFunction) => {
            console.log("Logout called");
            req.logOut();
            res.redirect('/');
        });
        
        app.get('/login',
        function(req: Request, res: any){
            res.sendFile(__dirname+'/login/login.html');
        });

        app.get('/register',
        function(req: Request, res: any){
            res.sendFile(__dirname+'/login/register.html');
        });


        // route middleware to make sure a user is logged in
        function isLoggedIn(req: any, res: any, next: any):any {
            console.log("Checking we are logged in");
                // if user is authenticated in the session, carry on 
                if (req.isAuthenticated()) {
                    console.log("Yes we are");        
                    return next();
                }
            
                // if they aren't redirect them to the home page
                console.log("No we are not");
                res.redirect('/login');
            }

        return isLoggedIn;
    };

}