use strict;
use warnings;
use ExtUtils::MakeMaker;

WriteMakefile(
    NAME         => 'App::WebNotes',
    AUTHOR       => q{Vladimir Lettiev <thecrux@gmail.com>},
    VERSION_FROM => 'lib/App/WebNotes.pm',
    ABSTRACT     => 'Markdown Web Editor',
    ( $ExtUtils::MakeMaker::VERSION >= 6.3002
        ? ( 'LICENSE' => 'perl' )
        : () ),
    PL_FILES  => {},
    PREREQ_PM => {
        'Test::More' => 0,
        'YAML'       => 0,
        'Dancer'     => 1.311,
    },
    dist  => { COMPRESS => 'gzip -9f', SUFFIX => 'gz', },
    clean => { FILES    => 'App-WebNotes-*' },
);
