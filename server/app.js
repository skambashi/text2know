// To run node app in background of server
// require('daemon')();

// Initialize dependancies
var express = require('express'),
    // Use bunyan to log debug/error messages in JSON format
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
    // textHandler = require('./helpers/textHandler'),
    // hg = require('./routes/html_gen'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser');

// Create an express web app to run on port 80
var app = express();
var port = 80;

// // Use middleware to parse incoming form bodies
app.use(bodyParser.urlencoded({extended : false}));

app.post('/sms', function(request, response){
  console.log('[SMS] POST request received:\n', request.body);
  //log.debug('[SMS] Post request received:\n', request);
});

/**************************** WWW ROUTES FROM HERE ***********************************/
// app.get('/', function(request, response) {
//   log.debug('[WWW] get request: \'/\'');
//   hg.genHtml(response, 'index.html');
// });

/**************************** CSS/JS ROUTES FROM HERE ********************************/

// app.get('/public/css/:file', function(request, response) {
//   log.debug('[CSS] get request: \'/public/css/%s\'', request.params.file);
//   hg.genCss(response, request.params.file);
// });

// app.get('/public/js/:file', function(request, response) {
//   log.debug('[JS] get request: \'/public/js/%s\'', request.params.file);
//   hg.genJs(response, request.params.file);
// });

// app.get('/public/img/:file', function(request, response) {
//   log.debug('[IMAGE] get request: \'/public/img/%s\'', request.params.file);
//   hg.genImage(response, request.params.file);
// });

console.log('[HTTP] Creating HTTP Server on Port', port.toString());
//log.debug('[HTTP] Creating HTTP Server on Port ' + port.toString());
app.listen(port);
