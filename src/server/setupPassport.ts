import * as express from 'express';
import * as expressSession from 'express-session';
import * as passport from 'passport';
//import * as passportSession from 'passport-session';
import * as passportLocal  from 'passport-local';

export class PassportSetup {

    public constructor(){};

    public setupPassport(app: express.Application): express.RequestHandler {
        // We give the strategy a name 'local'
        var localStrategy = new passportLocal.Strategy(
            function(username: any, password: any, done: any) {
                console.log("user verification called");
                if(username ==="d") {
                    console.log("User login approved");
                    done(null, { name: "bob"});
                } else {
                    console.log("User login denied");
                    done (null, false);
                }
            }
            );
        passport.use('local', localStrategy);

        passport.serializeUser(function(user: any, done: any) {
            console.log("Serialise user");
            done(null, user);
        });
        
        passport.deserializeUser(function(id: any, done: any) {
        //    User.findById(id, function(err, user) {
        //      done(err, user);
        //    });
        console.log("Deserialise user");
            done(null, {});
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

        app.get('/login',
        function(req: Request, res: any){
            res.sendFile(__dirname+'/login/login.html');
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