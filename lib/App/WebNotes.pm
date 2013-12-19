package App::WebNotes;
use Dancer ':syntax';
use App::WebNotes::API;

our $VERSION = '0.1';

prefix undef;
set serializer => undef;

get '/' => sub {
    redirect '/notes/Home';
};

get '/notes/**' => sub {
    template 'main';
};

true;
