require([   "jquery",
            "underscore",
            "backbone",
            "routers/router"],
function (  $,
            _,
            Backbone,
            Router) {

    "use strict";

    $(document).ready(function() {
        var initializeApplication = function() {
            MCM.user.id = MCM.user.id ? MCM.user.id : FB.getUserID();
            MCM.user.accessToken = MCM.user.accessToken ? MCM.user.accessToken : FB.getAccessToken();

            $("#login").addClass("hidden");
            $("#logout").removeClass("hidden");
        };

        var endApplication = function() {
            MCM.user.id = null;
            MCM.user.accessToken = null;

            $("#login").removeClass("hidden");
            $("#logout").addClass("hidden");
        };

        MCM.app = {};
        MCM.user = {
            id: null,
            accessToken: null,
            isLoggedIn: function() {
                return (this.id && this.accessToken) ? true : false;
            }
        };

        FB.init({
            appId      : "619396928089440", // App ID
            channelUrl : "//localhost:3000/channel.html", // Channel File
            status     : true, // check login status
            cookie     : true, // enable cookies to allow the server to access the session
            xfbml      : true  // parse XFBML
        });

        FB.getLoginStatus(function(response) {
            if (response.status === "connected") {
                initializeApplication();
            }
            else if (response.status === "not_authorized") {
                endApplication();
            }
            else {
                endApplication();
            }

            MCM.app.router = new Router();

            Backbone.history.start();
        });

        FB.Event.subscribe("auth.authResponseChange", function(response) { 
            if (response.status === "connected") {
                console.log("connected");
            }
            else if (response.status === "not_authorized") {
                console.log("disconnected");
            }
            else {
                console.log("disconnected");
            }
        });

        $("#login").on("click", function() {
            FB.login(function(response) {
                window.location.reload();
            });
        });

        $("#logout").on("click", function() {
            FB.logout(function(response) {
                window.location.reload();
            });
        });

        
    });

});