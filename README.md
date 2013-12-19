# Web Notes

`App::WebNotes` --  is a simple Web Markdown Editor

## Description

It's powered by [Perl Dancer](http://perldancer.org) at backend, and [Backbone](http://backbonejs.org) at frontend. Also used [EpicEditor](http://epiceditor.com) for markdown and css framework [Bootstrap](http://getbootstrap.com).

## Intallation

```
git clone https://github.com/vlet/App-WebNotes.git
cd App-WebNotes
cpanm --installdeps .
```

## Running

```
plackup bin/app.pl
```

Now open http://0:5000 in your favorite browser

All notes saved in localStorage and may be synced to server storage (plain json file). Path to storage file configured via config.yml.

## Screnshots

* Markdown Preview
![Screenshot](/public/images/screenshot.png)

* Editor
![Screenshot](/public/images/screenshot2.png)

* Fullscreen Editor
![Screenshot](/public/images/screenshot3.png)
