var twilio = require('twilio'),
    // log = require('bunyan').createLogger(
    //   {
    //     name: 'text2pay',
    //     streams: [{
    //       level: 'debug',
    //       path: '/home/ubuntu/text2know/server/logs/text2know.log'
    //     },
    //     {
    //       level: 'error',
    //       path: '/home/ubuntu/text2know/server/logs/text2know_error.log'
    //     }]
    //   }
    // ),
    constants = require('./../../constants'),
    client = require('twilio')(constants.twilio_sid, constants.auth_token),
    colors = require('colors');

exports.returnInput = function(request, response){
  // var tokens = request.body.Body.split(" ");
  console.log('[TEXT] Inbound SMS detected:'.green, request.body.Body.green);
  // log.debug('[TEXT] Inbound SMS detected!');
  var twiml = new twilio.TwimlResponse();
  twiml.message('Server received your message successfully: ' + request.body.Body);
  response.send(twiml.toString());
}