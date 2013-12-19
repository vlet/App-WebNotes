"use strict";
// Model
var wn = wn || {};

wn.Note = Backbone.Model.extend({
    defaults: {
        title: '',
        updated: false,
        active: false
    }
});
