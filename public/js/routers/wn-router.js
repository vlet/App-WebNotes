"use strict";
// Router
var wn = wn || {};

var Router = Backbone.Router.extend({
    routes: {
        'notes/*note': 'note',
        '*default': 'def_route'
    },
    note: function(note) {
        var el = wn.Notes.findWhere({
            active: true
        });
        if (el) {
            el.set({
                active: false
            });
        }
        el = wn.Notes.findWhere({
            title: note
        });
        if (el) {
            el.set({
                active: true
            });
        }
        if (!wn.editor) {
            var editor = new wn.EditorView({
                note: note
            });
        }
        wn.editor.open(note);
        if (wn.editor.is('edit')) {
            wn.editor.preview();
        }
    },
    def_route: function(param) {
        console.log("moveto " + param);
    }
});

wn.Router = new Router();
Backbone.history.start({
    pushState: true
});