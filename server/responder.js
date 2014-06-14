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
    reddit = require('./apps/google'),
    colors = require('colors');

exports.help = function(request, response, next){
  console.log('[TEXT] SMS detected:'.green, request.body.Body.green);
  console.log('[TEXT] From:'.green,request.body.From.green);
  console.log('[TEXT] Body:'.green,request.body.Body.green);

  console.log('[TEXT] \'help\''.green);

  var tokens = request.body.Body.split(" ");

  if (tokens[0].toLowerCase() == 'cmds'){
    var body = 'Commands:\n'
        + 'cmds | Returns a list of available commands.\n'
        + 'TODO | Add more commands.';

    client.messages.create({
      to: request.body.From,
      from: constants.from_phone,
      body: body, 
    }, function(err, message) {
      console.log('[ERROR]', err);
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

exports.google = function(request, response, next){
  console.log('[TEXT] \'google\''.green);

}

exports.invalid = function(request, response){
  console.log('[TEXT] \'invalid\'');
  var body = 'Invalid input: ' + request.body.Body + '.\nPlease type \'cmds\' to get list of available commands.'
  client.messages.create({
    to: request.body.From,
    from: constants.from_phone,
    body: body, 
  }, function(err, message) {
    console.log('[ERROR]', err);
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