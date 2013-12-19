package App::WebNotes::API;
use Dancer ':syntax';
use Encode qw(encode_utf8);
use App::WebNotes::Storage;

our $VERSION = '1.0';

my $storage = App::WebNotes::Storage->new();

prefix '/api';

#set serializer => 'JSON';

post '/export' => sub {
    my $data = param('data');
    $storage->saveNotes( from_json encode_utf8($data) );
    content_type 'application/json';
    to_json { "status" => "ok" };
};

get '/import' => sub {
    content_type 'application/json';
    to_json $storage->loadNotes();
};

1;
