use Test::More tests => 3;
use strict;
use warnings;

# the order is important
use App::WebNotes;
use Dancer::Test;

route_exists [ GET => '/' ], 'a route handler is defined for /';
response_status_is [ 'GET' => '/' ], 302, 'response status is 302 for /';
response_status_is [ 'GET' => '/notes/Home' ], 200,
  'response status is 200 for /notes/Home';
