package App::WebNotes::Storage;
use Dancer ':syntax';
use Encode qw(encode_utf8);

sub new {
    bless { storage => config->{storage} || {} }, shift;
}

sub saveNotes {
    my ( $self, $notes ) = @_;

    if ( ref $self->{storage} eq 'HASH' ) {
        $self->{storage} = $notes;
    }
    elsif ( open my $fh, '>:encoding(UTF-8)', $self->{storage} ) {
        print $fh to_json($notes);
    }
}

sub loadNotes {
    my $self = shift;
    if ( ref $self->{storage} eq 'HASH' ) {
        return $self->{storage};
    }
    elsif ( open my $fh, '<', $self->{storage} ) {
        my $data = do { local $/; <$fh> };
        return from_json $data;
    }
    else {
        return {};
    }
}

true;
