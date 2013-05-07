define([    "jquery",
            "underscore",
            "backbone",
            "dot",
            "text!templates/home-splash-item-view.html"],
function (  $,
            _,
            Backbone,
            doT,
            homeSplashItemViewTemplate) {

    "use strict";

    return Backbone.View.extend({
        template: doT.template(homeSplashItemViewTemplate),
        initialize: function() {
            
        },
        render: function() {
            this.$el.html(this.template());
    
            return this;
        }
    });

});