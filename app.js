// module dependencies
var express = require("express"),
    http = require("http"),
    https = require("https"),
    querystring = require("querystring"),
    when = require("when"),
    mongoose = require("mongoose");

var app = express();

// TODO: better name for database; will also have to change connection string when
//  moving to remote host
mongoose.connect('mongodb://localhost/collectionTest1');

var db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));

db.once("open", function callback () {
    console.log("connected to db");
});

// TODO: define schema and models in another file?
var userSchema = mongoose.Schema({
    id: Number,
    items: Array
});

// name of mongodb collection derived from plural form of model alias ("Users")
var User = mongoose.model("User", userSchema);

app.configure(function() {
    // http://expressjs.com/api.html#compress
    app.use(express.compress());
    // http://stackoverflow.com/a/8378414
    app.use(express.methodOverride());
    // http://expressjs.com/api.html#bodyParser
    app.use(express.bodyParser());
    // use routes before attempting to retrieve static files from filesystem:
    //  http://stackoverflow.com/questions/12695591/node-js-express-js-how-does-app-router-work
    app.use(app.router);
    // serve static files from the specified directory
    app.use(express.static(__dirname + '/public'));
    // http://stackoverflow.com/questions/8015361/how-can-i-get-express-js-to-catch-and-report-runtime-exceptions-in-ajax-calls
    app.use(express.errorHandler({
        dumpExceptions: true, 
        showStack: true
    }));
});

app.all("/*", function(req, res, next) {
    // set some header data to allow cors requests
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    next();
});

// routes
app.post("/fakePost", express.bodyParser(), function(req, res) {
    var clientUserId = req.body.user_id,
        accessToken = querystring.stringify({
            access_token: req.body.access_token
        });

    var verifyFacebookToken = function(accessToken) {
        var options = {
                hostname: "graph.facebook.com",
                path: "/me?" + accessToken,
                method: "GET"
            },
            deferred = when.defer();

        var req = https.request(options, function(res) {
            var data = "";

            res.setEncoding("utf8");

            res.on("data", function (chunk) {
                return data += chunk;
            });

            res.on("end", function() {
                var retrievedId = JSON.parse(data).id;

                if (retrievedId) {
                    deferred.resolve(retrievedId);
                }
                else {
                    deferred.reject();
                }
            });
        });

        req.on("error", function(e) {
            deferred.reject();
        });

        req.end();

        return deferred.promise;
    };

    var verifyUserIdentity = function(facebookUserId, clientUserId) {
        var deferred = when.defer();

        if (parseInt(facebookUserId, 10) === parseInt(clientUserId, 10)) {
            deferred.resolve(facebookUserId);
        }
        else {
            deferred.reject();
        }

        return deferred.promise;
    };

    // TODO: rewrite so I don't need the response.send/end repeated every time
    // TODO: additional step for returning user from db or adding them if they don't
    //  already exist
    when(verifyFacebookToken(accessToken), function(facebookUserId) {
        return verifyUserIdentity(facebookUserId, clientUserId);
    }, function() {
        console.log("facebook verification failed");
        res.send("facebook verification failed");

        res.end();
    })
    .then(function(userId) {
        console.log(userId);

        User.find({ id: userId }, function(err, results) {
            if (err) {
                console.log("error attempting to find user");
            }
            else {
                console.log(results);

                if (results.length > 0) {
                    console.log("USER ALREADY EXISTS");
                }
                else {
                    var user = new User({
                        id: userId,
                        items: [12,13,14]
                    });

                    user.save(function (err, user) {
                        if (err) {
                            console.log("an error occurred while saving to db");
                        }
                        else {
                            console.log("saving new user succeeded");
                        }
                    });
                }
            }
        });

        console.log("all succeeded");
        res.send("all succeeded");

        res.end();
    }, function() {
        console.log("user identity verification failed");
        res.send("user identity verification failed");

        res.end();
    });

});

app.get("/users", function(req, res) {
    var userId = req.query.id;

    var retrieveUser = function(userId) {
        var deferred = when.defer();

        User.find({ id: userId }, function(err, results) {
            if (err) {
                deferred.reject();
            }
            else {
                deferred.resolve(results);
            }
        });

        return deferred.promise;
    };

    when(retrieveUser(userId), function(results) {
        console.log("users found");
        res.json(results);

        res.end();
    }, function() {
        console.log("something went wrong");
    });

});

app.listen(3000);