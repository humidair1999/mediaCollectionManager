define([    "jquery",
            "underscore",
            "backbone",
            "dot",
            "text!templates/collections-item-view.html"],
function (  $,
            _,
            Backbone,
            doT,
            collectionsItemViewTemplate) {

    "use strict";

    return Backbone.View.extend({
        template: doT.template(collectionsItemViewTemplate),
        initialize: function() {
            
        },
        render: function() {
            this.$el.html(this.template());
    
            return this;
        }
    });

});