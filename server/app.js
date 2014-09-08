// To run node app in background of server, daemonize.
//require('daemon')();

// Initialize dependancies.
var express = require('express');
// Use bunyan to log debug/error messages in JSON format.
// log = require('bunyan').createLogger({
//   name: 'text2know',
//   streams: [{
//     level: 'debug',
//     path: '/home/ubuntu/text2know/server/logs/text2know.log'
//   }, {
//     level: 'error',
//     path: '/home/ubuntu/text2know/server/logs/text2know_error.log'
//   }]
// });
var hg = require('./html_gen');
var mongoose = require('mongoose');
var responder = require('./responder');
var bodyParser = require('body-parser');
var colors = require('colors');
var constants = require('./../../constants');

// Create an express web app to run on port 80.
var app = express();
var port = 80;

// Use middleware to parse incoming form bodies.
app.use(bodyParser.urlencoded({
  extended: false
}));

app.post('/sms', function(req, res) {
  var user_num = req.body.From;
  var server_num = constants.from_phone;
  var body = req.body.Body;
  console.log('[TEXT] SMS detected:'.green, req.body.Body.green);
  console.log('[TEXT] From:'.green, from.green);
  console.log('[TEXT] Body:'.green, body.green);

  var help_re = /^help$/.test(body);
  var reddit_re = /^reddit (\w+) (\d+)$/.exec(body);
  var gmap_re = /gmap|gm (d|w|b|t) from (.+) to (.+)/.exec(body);

  if (help_re) {
    responder.help(user_num, server_num);
  } else if (reddit_re) {
    responder.reddit(user_num, server_num, reddit_re[1], reddit_re[2]);
  } else if (gmap_re) {
    responder.reddit(user_num, server_num, gmap_re[1], gmap_re[2], gmap_re[3]);
  } else {
    responder.invalid(user_num, server_num, body);
  }
});

/**************************** WWW ROUTES FROM HERE ***********************************/
app.get('/', function(request, response) {
  console.log('[WWW] GET request: \'/\''.yellow);
  //log.debug('[WWW] GET request: \'/\'');
  hg.genHtml(response, 'index.html');
});

/**************************** CSS/JS ROUTES FROM HERE ********************************/

app.get('/static/font-awesome/css/:file', function(request, response) {
  console.log('[CSS] GET request: \'/static/font-awesome/css/%s\''.yellow, request.params.file.yellow);
  //log.debug('[CSS] GET request: \'/static/font-awesome/css/%s\'', request.params.file);
  hg.genCss(response, request.params.file);
});

app.get('/static/css/:file', function(request, response) {
  console.log('[CSS] GET request: \'/static/css/%s\''.yellow, request.params.file.yellow);
  //log.debug('[CSS] GET request: \'/static/css/%s\'', request.params.file);
  hg.genCss(response, request.params.file);
});

app.get('/static/js/:file', function(request, response) {
  console.log('[JS] GET request: \'/static/js/%s\''.yellow, request.params.file.yellow);
  //log.debug('[JS] GET request: \'/static/js/%s\'', request.params.file);
  hg.genJs(response, request.params.file);
});

app.get('/static/img/:file', function(request, response) {
  console.log('[IMAGE] GET request: \'/static/img/%s\''.yellow, request.params.file.yellow);
  //log.debug('[IMAGE] GET request: \'/static/img/%s\'', request.params.file);
  hg.genImage(response, request.params.file);
});

/**************************** STARTING SERVER ****************************************/

console.log(('[HTTP] Creating HTTP Server on Port ' + port.toString()).green);
//log.debug('[HTTP] Creating HTTP Server on Port ' + port.toString());
app.listen(port);