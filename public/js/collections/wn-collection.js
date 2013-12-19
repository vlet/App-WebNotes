"use strict";
// Collection
var wn = wn || {};
var Notes = Backbone.Collection.extend({
    model: wn.Note,
});

wn.Notes = new Notes();