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
  // log.debug('[TEXT] \'cmds\' detected:', request.body.Body);
  if (tokens[0].toLowerCase() == 'cmds'){
    var body = 'Commands:\n'
        + 'cmds | Returns a list of available commands.\n'
        + 'TODO | Add more commands.';
    client.messages.create({
      to: request.body.From,
      from: constants.from_phone,
      body: body, 
    }, function(err, message) {
      console.log('[ERROR]', err.red);
      // log.error(err);
      client.messages.create({
        to: request.body.From,
        from: constants.from_phone,
        body: 'Command failed. GG.',
      }, function(err, message) {
        console.log('[ERROR] Command failed. GG. NO RE.'.red);
      });
    });
  } else {
    next();
  }
}

exports.invalid = function(request, response){
  console.log('[TEXT] \'invalid\' detected:'.red, request.body.Body.red);
  var body = 'Invalid input: ' + request.body.Body + '.\nPlease type \'cmds\' to get list of available commands.'
  client.messages.create({
    to: request.body.From,
    from: constants.from_phone,
    body: body, 
  }, function(err, message) {
    console.log('[ERROR]', err.red);
    // log.error(err);
    client.messages.create({
      to: request.body.From,
      from: constants.from_phone,
      body: 'Command failed. GG.',
    }, function(err, message) {
      console.log('[ERROR] Command failed. GG. NO RE.'.red);
    });
  });
}