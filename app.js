// module dependencies
var express = require("express"),
    http = require("http"),
    https = require("https");

var app = express();

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


app.listen(3000);