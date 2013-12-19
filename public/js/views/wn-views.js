"use strict";
// View
var wn = wn || {};

wn.MainNav = Backbone.View.extend({
    el: '#MainNav',
    events: {
        'click a[href="#about"]': 'about',
        'click a': 'navigate',
        'submit .navbar-form': 'search'
    },
    initialize: function() {},
    navigate: function(e) {
        e.preventDefault();
        var href = $(e.target).attr('href');
        if (href !== '#about') {
            wn.Router.navigate(href, {
                trigger: true
            });
        }
    },
    about: function(e) {
        e.preventDefault();
        $("#AboutNoteModal").modal();
    },
    search: function(e) {
        e.preventDefault();
        var el, value = $(this.el).find('input').val(),
        re = new RegExp(value, "i");
        el = wn.Notes.find(function(note) {
            return note.attributes.title.match(re);
        });
        if (el) {
            wn.Router.navigate('/notes/' + encodeURIComponent(el.attributes.title), {
                trigger: true
            });
        }
    }
});

wn.EditorView = Backbone.View.extend({
    el: '#Content',
    template: _.template($('#editor-template').html()),
    events: {
        'click #NoteEdit': 'noteEdit',
        'click #NotePreview': 'notePreview',
        'click #NoteNewSubmit': 'noteNew',
        'submit #NoteNewForm': 'noteNew',
        'click #NoteDelete': 'noteDelete',
        'click #NoteDeleteConfirm': 'noteDeleteConfirm',
        'click #Sync': 'noteExport'
    },
    noteEdit: function(e) {
        e.preventDefault();
        wn.editor.edit();
    },
    notePreview: function(e) {
        e.preventDefault();
        wn.editor.preview();
    },
    noteNew: function(e) {
        e.preventDefault();
        $("#NoteNewModal").modal('hide');
        var note = $("#NoteNewForm input[name='note_name']").val();
        wn.editor.save();
        wn.Notes.add({
            title: note
        });
        wn.Router.navigate('/notes/' + encodeURIComponent(note), {
            trigger: true
        });
        wn.editor.edit();
    },
    noteDelete: function(e) {
        var el = wn.Notes.findWhere({
            active: true
        });
        if (el && el.attributes.title !== 'Home') {
            $("#NoteDeleteModal strong").text(el.attributes.title);
        } else {
            return false;
        }
    },
    noteDeleteConfirm: function(e) {
        e.preventDefault();
        $("#NoteDeleteModal").modal('hide');
        var el = wn.Notes.findWhere({
            active: true
        });
        if (el && el.attributes.title !== 'Home') {
            var title = el.attributes.title;
            wn.Notes.remove(el).destroy();
            wn.editor.remove(title);
            wn.Router.navigate('/notes/Home', {
                trigger: true
            });
        }
    },
    noteExport: function(e) {
        e.preventDefault();
        var exp = {};
        for (var file in wn.editor.getFiles()) {
            exp[file] = JSON.parse(wn.editor.exportFile(file, 'json'));
        }
        $.ajax({
            url: "/api/export",
            type: "POST",
            data: {
                data: JSON.stringify(exp)
            },
            success: function(data) {
                wn.saved = true;
            }
        })
    },
    noteImport: function() {
        $.get("/api/import", function(data) {
            var el;
            for (var file in data) {
                wn.editor.importFile(file, data[file].content);
                el = wn.Notes.findWhere({
                    title: file
                });
                if (!el) {
                    wn.Notes.add({
                        title: file
                    });
                }
            }
        });
    },
    initialize: function(n) {
        var previewer, config = {
            prettify: '/vendors/google-code-prettify',
            epiceditor: {
                container: 'epiceditor',
                localStorageName: 'epiceditor',
                basePath: '/vendors/epiceditor',
                file: {
                    name: n.note,
                    defaultContent: '',
                    autoSave: 100
                },
                theme: {
                    base: '/themes/base/epiceditor.css',
                    preview: '/themes/preview/github.css',
                    editor: '/themes/editor/epic-light.css'
                },
                autogrow: true
            }
        };
        this.render();

        wn.editor = new EpicEditor(config.epiceditor);
        wn.editor.load(function() {
            previewer = this.getElement('previewer');

            // Prettify JS
            var scriptTag = previewer.createElement('script');
            scriptTag.src = config.prettify + '/prettify.js';

            // Prettify CSS
            var cssTag = previewer.createElement('link');
            cssTag.rel = 'stylesheet';
            cssTag.type = 'text/css';
            cssTag.href = config.prettify + '/prettify.css';

            // Add JS / CSS
            previewer.body.appendChild(scriptTag);
            previewer.head.appendChild(cssTag);

            this.edit();
            this.preview();
        });

        wn.editor.on('preview', function() {
            // Add necessary classes to <code> elements
            var previewerBody = previewer.body;
            var codeBlocks = previewerBody.getElementsByTagName('code');

            for (var i = 0; i < codeBlocks.length; i++)
            codeBlocks[i].className += ' prettyprint';
            prettyPrint(null, previewerBody);
        });

        wn.editor.on('autosave', function() {
            if (wn.saved) {
                wn.saved = false;
            }
        });

        new wn.NavView();
        new wn.PathView(n);
        this.noteImport();
        wn.saved = true;
        window.onbeforeunload = function(e) {
            if (wn.saved === false) {
                return 'You have unsaved changes!';
            } else {
                return null;
            }
        }
    },
    render: function() {
        this.$el.html(this.template());
        return this;
    }
});

wn.NavView = Backbone.View.extend({
    el: '#Content',
    initialize: function() {
        wn.Notes.on('add', this.addNote, this);

        for (var note in wn.editor.getFiles()) {
            note = {
                title: note,
                active: (note === wn.editor.settings.file.name) ? true : false
            };
            wn.Notes.add(note);
        }
    },
    addNote: function(note) {
        var view = new wn.ItemView({
            model: note
        });
        $('#Pages').append(view.render().el);
    },

});

wn.PathView = Backbone.View.extend({
    el: '#NotePath',
    initialize: function() {
        wn.Notes.on('change', this.changedNote, this);
        this.changedNote();
    },
    changedNote: function() {
        var el = wn.Notes.findWhere({
            active: true
        });
        if (el) {
            this.$el.text(el.attributes.title);
        }
    }
});

wn.ItemView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#noteitem-template').html()),
    initialize: function() {
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this);
    },
    events: {
        'click a': 'moveto'
    },
    render: function() {
        var data = this.model.toJSON();
        this.$el.html(this.template({
            title: _.escape(data.title)
        }));
        if (data.active) {
            this.activate();
        } else {
            this.deactivate();
        }
        return this;
    },
    activate: function() {
        this.$el.addClass('active');
    },
    deactivate: function() {
        this.$el.removeClass('active');
    },
    moveto: function(e) {
        e.preventDefault();
        var title = this.model.attributes.title;
        wn.Router.navigate('/notes/' + encodeURIComponent(title), {
            trigger: true
        });
    }
});