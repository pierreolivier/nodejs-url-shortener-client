var urlshortener = require('./index');

urlshortener.connect('127.0.0.1:3001', 'po', function (connected, err) {
    if (connected) {
        var args = {protection: 'password', password: 'test', long_key: 1, timeout: 300};
        urlshortener.shorten('http://google.com', args, function(shortUrl, err) {
            console.log(shortUrl);
        });

        urlshortener.shorten('http://google.fr', function(shortUrl, err) {
            console.log(shortUrl);
        });

        urlshortener.shorten('http://www.google.com');
    }
});