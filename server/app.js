// To run node app in background of server, daemonize.
require('daemon')();

// Initialize dependancies.
var express = require('express'),
    // Use bunyan to log debug/error messages in JSON format.
    log = require('bunyan').createLogger(
      {
        name: 'text2know',
        streams: [{
          level: 'debug',
          path: '/home/ubuntu/text2know/server/logs/text2know.log'
        },
        {
          level: 'error',
          path: '/home/ubuntu/text2know/server/logs/text2know_error.log'
        }]
      }
    ),
    hg = require('./views/html_gen'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

// Create an express web app to run on port 80.
var app = express();
var port = 80;

// Use middleware to parse incoming form bodies.
app.use(bodyParser.urlencoded({extended : false}));

app.post('/sms', function(request, response){
  log.debug('[SMS] POST request received:\n', request);
});

/**************************** WWW ROUTES FROM HERE ***********************************/
app.get('/', function(request, response) {
  log.debug('[WWW] GET request: \'/\'');
  hg.genHtml(response, 'index.html');
});

/**************************** CSS/JS ROUTES FROM HERE ********************************/

app.get('/static/css/:file', function(request, response) {
  log.debug('[CSS] GET request: \'/static/css/%s\'', request.params.file);
  hg.genCss(response, request.params.file);
});

app.get('/static/js/:file', function(request, response) {
  log.debug('[JS] GET request: \'/static/js/%s\'', request.params.file);
  hg.genJs(response, request.params.file);
});

app.get('/static/img/:file', function(request, response) {
  log.debug('[IMAGE] GET request: \'/static/img/%s\'', request.params.file);
  hg.genImage(response, request.params.file);
});

/**************************** STARTING SERVER ****************************************/

log.debug('[HTTP] Creating HTTP Server on Port ' + port.toString());
app.listen(port);
