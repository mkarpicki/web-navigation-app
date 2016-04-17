'use strict';

var express = require('express');
var router = express.Router();

var renderMainView = function (res) {
    //res.sendFile('views/index.html');
    res.sendfile('views/index.html');
    //res.render('index');
};

router.get('/', function (req, res) {
    renderMainView(res);
});

router.get('/search', function (req, res) {
    renderMainView(res);
});

router.get('/route/*', function (req, res) {
    renderMainView(res);
});

router.get('/navigate/*', function (req, res) {
    renderMainView(res);
});

module.exports = router;