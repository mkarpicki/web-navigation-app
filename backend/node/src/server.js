'use strict';

// External dependencies
var http = require('http'),
    path = require('path'),
    //log4js          = require('log4js'),
    //favicon         = require('serve-favicon'),
    //cookieParser    = require("cookie-parser"),
    //cookieSession   = require("cookie-session"),
    //bodyParser      = require('body-parser'),
    express = require('express'),

    defaultPort = 3000;

var routes = require('./routes.js');

// Initialize express app
var app = express();

//app.engine('html', 'ejs');
//app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.set('port', process.env.PORT || defaultPort);

//web-navigation-app/backend/node/src
var rootFolder = "."

app.set('views', rootFolder + '/views');

//app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static('public'));
//app.use('/public', express.static(__dirname + '/public'));
app.use('/public', express.static(rootFolder  + '/public'));
app.use('/templates', express.static(rootFolder  + '/public/templates'));
app.use('/styles', express.static(rootFolder  + '/public/styles'));
app.use('/scripts', express.static(rootFolder  + '/public/scripts'));
app.use('/images', express.static(rootFolder  + '/public/images'));

app.use('/', routes);

//http.createServer(app).listen(app.get('port'), function () {
//    console.info('server started env=' + app.get('env') + ' port=' + app.get('port'));
//});

//module.exports = app;

var server = app.listen(defaultPort, 'localhost', function () {

    var host = server.address().address;
    var port = server.address().port;

    console.info('server started http://%s:%s', host,port);

});