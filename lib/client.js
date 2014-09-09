/**
 * Created by Pierre-Olivier on 09/09/2014.
 */
var request = require('request');

_connected = false;
_server = '';
_key = '';
_uri = '';

function e(type, error) {
    return {type: type, error: error};
}

function v() {}

function opts(uri, json) {
    return {
        uri: uri,
        method: 'POST',
        json: json,
        timeout: 3000,
        strictSSL: false
    };
}

function extractKey(shortUrl) {
    return shortUrl.substr(shortUrl.lastIndexOf('/') + 1);
}

module.exports.connect = function(server, key, cb) {
    if (cb == undefined) {
        cb = v;
    }

    request(opts('https://' + server + '/login', {key: key}), function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if (body.status == 'ok') {
                _connected = true;
                _server = server;
                _key = key;
                _uri = 'https://' + server;

                cb(true);
            } else {
                cb(false, e('shortener', body.error));
            }
        } else {
            cb(false, e('request', error));
        }
    });
};

module.exports.shorten = function(url, args, cb) {
    if (_connected) {
        if (typeof args == "function") {
            cb = args;
            args = {};
        }

        if (cb == undefined) {
            cb = v;
        }

        if (typeof args != "object") {
            args = {};
        }

        args.key = _key;
        args.url = url;

        request(opts(_uri + '/shorten', args), function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if (body.status == 'ok') {
                    cb(body.shortUrl);
                } else {
                    cb('', e('shortener', body.error))
                }
            } else {
                cb('', e('request', error));
            }
        });
    } else {
        cb('', e('request', 'call connect method first'));
    }
};

module.exports.expand = function(urls, cb) {
    if (_connected) {
        if (typeof urls != "string") {
            urls = '';
        }
        if (cb == undefined) {
            cb = v;
        }

        var keys = [];
        var urlsArray = urls.split(',');
        for (var i = 0 ; i < urlsArray.length ; i++) {
            keys.push(extractKey(urlsArray[i]));
        }

        request(opts(_uri + '/expand', {key: _key, urls: keys.join(',')}), function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if (body.status == 'ok') {
                    cb(body.urls);
                } else {
                    cb([], e('shortener', body.error))
                }
            } else {
                cb([], e('request', error));
            }
        });
    } else {
        cb([], e('request', 'call connect method first'));
    }
};

module.exports.list = function(cb) {
    if (_connected) {
        if (cb == undefined) {
            cb = v;
        }

        request(opts(_uri + '/list', {key: _key}), function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if (body.status == 'ok') {
                    for (var i = 0 ; i < body.urls.length ; i++) {
                        body.urls[i].created = new Date(body.urls[i].created);
                        if (body.urls[i].timeout != '0000-00-00 00:00:00') {
                            body.urls[i].timeout = new Date(body.urls[i].timeout);
                        }
                    }
                    cb(body.urls);
                } else {
                    cb([], e('shortener', body.error))
                }
            } else {
                cb([], e('request', error));
            }
        });
    } else {
        cb([], e('request', 'call connect method first'));
    }
};

module.exports.delete = function(urls, cb) {
    if (_connected) {
        if (typeof urls != "string") {
            urls = '';
        }
        if (cb == undefined) {
            cb = v;
        }

        var keys = [];
        var urlsArray = urls.split(',');
        for (var i = 0 ; i < urlsArray.length ; i++) {
            keys.push(extractKey(urlsArray[i]));
        }

        request(opts(_uri + '/delete', {key: _key, urls: keys.join(',')}), function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if (body.status == 'ok') {
                    cb(undefined);
                } else {
                    cb(e('shortener', body.error))
                }
            } else {
                cb(e('request', error));
            }
        });
    } else {
        cb(e('request', 'call connect method first'));
    }
};
