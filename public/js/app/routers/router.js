define([    "jquery",
            "underscore",
            "backbone",
            "views/home-splash-item-view",
            "views/home-dashboard-item-view",
            "views/collections-item-view"],
function (  $,
            _,
            Backbone,
            HomeSplashItemView,
            HomeDashboardItemView,
            CollectionsItemView) {

    "use strict";

    return Backbone.Router.extend({
        routes: {
            "home": "showHome",
            "collections": "viewCollections"
        },
        homeItemView: null,
        showHome: function () {
            if (this.homeItemView) {
                this.homeItemView.remove();
            }

            console.log("called");

            if (MCM.user.isLoggedIn()) {
                this.homeItemView = new HomeDashboardItemView();
            }
            else {
                this.homeItemView = new HomeSplashItemView();
            }

            $("#container").html(this.homeItemView.render().el);
        },
        collectionsItemView: null,
        viewCollections: function() {
            if (this.collectionsItemView) {
                this.collectionsItemView.remove();
            }

            this.collectionsItemView = new CollectionsItemView();

            $("#container").html(this.collectionsItemView.render().el);
        }

    });
});