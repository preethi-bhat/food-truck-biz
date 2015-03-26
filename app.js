var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors')
	
var food = require('./routes/food');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/food', food);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
app.use(function(err, req, res, next) {
    var status = err.status || 500;
    var body = JSON.stringify({
        message: err.message || 'an error occured',
        status: status
    });
    console.log(err.stack);
    res.writeHead(status, {
        'Content-Length': body.length,
        'Content-Type': 'application/json'
    });
    res.write(body);
    res.end();
});


module.exports = app;
