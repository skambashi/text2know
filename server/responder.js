var twilio = require('twilio'),
    constants = require('./../../constants'),
    client = require('twilio')(constants.twilio_sid, constants.auth_token),
    reddit = require('./apps/google'),
    colors = require('colors');

exports.help = function(request, response, next){
  console.log('[TEXT] SMS detected:'.green, request.body.Body.green);
  console.log('[TEXT] From:'.green,request.body.From.green);
  console.log('[TEXT] Body:'.green,request.body.Body.green);

  console.log('[TEXT] \'cmds\''.green);

  var tokens = request.body.Body.split(" ");

  if (tokens[0].toLowerCase() == 'cmds'){
    var body = 'Commands:\n'
        + 'cmds || Returns a list of available commands.\n'
        + 'google <query> <amount> || Returns <amount> results from google search of <query>.\n'
        + 'TODO || Add more commands.';

    client.messages.create({
      to: request.body.From,
      from: constants.from_phone,
      body: body, 
    });
  } else {
    next();
  }
}

exports.google = function(request, response, next){
  console.log('[TEXT] \'google\''.green);

  var tokens = request.body.Body.split(" ");
  if (tokens[0].toLowerCase() == 'google'){
    var query = tokens.slice(1, -1).join(' ');
    var results = tokens[tokens.length - 1];
    console.log('[DEBUG] Google', results, 'results for', query);
    var body = 'Google ' + results + ' results for ' + query;

    client.messages.create({
      to: request.body.From,
      from: constants.from_phone,
      body: body, 
    });
  } else {
    next();
  }
}

exports.invalid = function(request, response){
  console.log('[TEXT] \'invalid\'');
  var body = 'Invalid input: ' + request.body.Body + '.\nPlease type \'cmds\' to get list of available commands.'
  client.messages.create({
    to: request.body.From,
    from: constants.from_phone,
    body: body, 
  });
}