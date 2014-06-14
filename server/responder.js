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

exports.help = function(request, response, next){
  var tokens = request.body.Body.split(" ");
  console.log('[TEXT] \'cmds\' detected:'.green, request.body.Body.green);
  // log.debug('[TEXT] Inbound SMS detected!');
  if (tokens[0].toLowerCase() == 'cmds'){
    var twiml = new twilio.TwimlResponse();
    twiml.message('Commands:\n'
        + 'cmds | Returns a list of available commands.\n'
        + 'TODO | Add more commands.'
      );
    response.send(twiml.toString());
  } else {
    next();
  }
}

exports.invalid = function(request, response){
  console.log('[TEXT] \'invalid\' detected:'.red, request.body.Body.red);
  var twiml = new twilio.TwimlResponse();
  twiml.message('Invalid input: ' + request.body.Body + '.\nPlease type \'cmds\' to get list of available commands.');
  response.send(twiml.toString());
}