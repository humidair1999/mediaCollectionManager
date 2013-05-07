define([    "jquery",
            "underscore",
            "backbone",
            "dot",
            "text!templates/home-dashboard-item-view.html"],
function (  $,
            _,
            Backbone,
            doT,
            homeDashboardItemViewTemplate) {

    "use strict";

    return Backbone.View.extend({
        template: doT.template(homeDashboardItemViewTemplate),
        initialize: function() {
            
        },
        render: function() {
            this.$el.html(this.template());
    
            return this;
        }
    });

});