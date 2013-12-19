requires 'Dancer', '1.3';
requires 'Template-Toolkit', '0';
requires 'YAML', '0';
requires 'Encode', '0';

on 'test' => sub {
    requires 'Test::More', '0';
};
