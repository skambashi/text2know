var twilio = require('twilio'),
    constants = require('./../../constants'),
    client = require('twilio')(constants.twilio_sid, constants.auth_token),
    restler = require('restler'),
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
        + 'reddit <subreddit> <amount> || Returns <amount> titles from <subreddit> subreddit. (Use \'front\' for homepage results)\n'
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

exports.reddit = function(request, response, next){
  console.log('[TEXT] \'reddit\''.green);

  var tokens = request.body.Body.split(" ");
  if (tokens[0].toLowerCase() == 'reddit'){
    var subreddit = tokens[1];
    var amount = tokens[2];

    if (tokens[1] == 'front'){
      restler.get('http://reddit.com/.json').on('complete', function(reddit) {
        for(var i=0; i<amount; i++) {
          client.messages.create({
            to: request.body.From,
            from: constants.from_phone,
            body: reddit.data.children[i].data.title, 
          });
        }
      });
    }else{
      restler.get('http://reddit.com/r/' + subreddit + '/.json').on('complete', function(reddit) {
        for(var i=0; i<amount; i++) {
          client.messages.create({
            to: request.body.From,
            from: constants.from_phone,
            body: reddit.data.children[i].data.title, 
          });
        }
      });
    }
  } else {
    next();
  }
}

exports.google = function(request, response, next){
  console.log('[TEXT] \'google\''.green);

  var tokens = request.body.Body.split(" ");
  if (tokens[0].toLowerCase() == 'google'){
    var query = tokens.slice(1, -1).join(' ');
    var amount = tokens[tokens.length - 1];
    console.log('[DEBUG] Google', amount, 'results for', query);
    var body = 'Google ' + amount + ' results for ' + query;

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
