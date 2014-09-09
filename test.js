var urlshortener = require('./index');

urlshortener.connect('127.0.0.1:3001', 'po', function (connected, err) {
    if (connected) {
        var args = {protection: 'password', password: 'test', long_key: 1, timeout: 300};
        urlshortener.shorten('http://google.com', args, function(shortUrl, err2) {
            console.log(shortUrl);

            urlshortener.expand(shortUrl, function(urls, err3) {
                console.log(urls);
            });
        });

        urlshortener.shorten('http://google.fr', function(shortUrl, err2) {
            console.log(shortUrl);

            urlshortener.delete(shortUrl);
        });

        urlshortener.list(function(urls, err2) {
            console.log(urls);
        });
    }
});