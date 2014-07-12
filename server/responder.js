var twilio = require('twilio');
var request = require("request");
var constants = require('./../../constants');
var client = require('twilio')(constants.twilio_sid, constants.auth_token);
var restler = require('restler');
var colors = require('colors');

exports.help = function(req, res, next){
  console.log('[TEXT] SMS detected:'.green, req.body.Body.green);
  console.log('[TEXT] From:'.green,req.body.From.green);
  console.log('[TEXT] Body:'.green,req.body.Body.green);

  console.log('[TEXT] \'cmds\''.green);

  var tokens = req.body.Body.split(" ");

  if (tokens[0].toLowerCase() == 'cmds'){
    var body = 'Commands:\n'
        + 'cmds || Returns a list of available commands.\n'
        + 'reddit <subreddit> <amount> || Returns <amount> titles from <subreddit> subreddit. (Use \'front\' for homepage results)\n'
        + 'google <query> <amount> || Returns <amount> results from google search of <query>.\n'
        + 'TODO || Add more commands.';

    client.messages.create({
      to: req.body.From,
      from: constants.from_phone,
      body: body, 
    });
  } else {
    next();
  }
}

exports.reddit = function(req, res, next){
  console.log('[TEXT] \'reddit\''.green);

  var tokens = req.body.Body.split(" ");
  if (tokens[0].toLowerCase() == 'reddit'){
    var subreddit = tokens[1];
    var amount = tokens[2];

    if (tokens[1] == 'front'){
      restler.get('http://reddit.com/.json').on('complete', function(reddit) {
        console.log('Reddit:', reddit);
        for(var i=0; i<amount; i++) {
          client.messages.create({
            to: req.body.From,
            from: constants.from_phone,
            body: reddit.data.children[i].data.title, 
          });
        }
      });
    }else{
      restler.get('http://reddit.com/r/' + subreddit + '/.json').on('complete', function(reddit) {
        console.log('Reddit:', reddit);
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

exports.gmap = function(req, res, next){
  console.log('[TEXT] \'gmap\''.green);
  var re = /gmap|gm (d|w|b|t) from (.+) to (.+)/;
  var body = req.body.Body;
  var pass = re.exec(body);
  if (pass){
    var type = pass[1];
    switch (type){
      case 'd':
        type = 'driving';
        break;
      case 'w':
        type = 'walking';
        break;
      case 'b':
        type = 'bicycling';
        break;
      case 't':
        type = 'transit';
        break;
    }
    var from = pass[2];
    var to = pass[3];
    console.log(from, to, type);
    request({
      url: 'http://maps.googleapis.com/maps/api/directions/json',
      qs: {
        origin: from,
        destination: to,
        mode: type,
      }
    }, function(error, response, body){
      if (error){
        console.log("There was an error:", error);
      } else {
        console.log("Request posted successfully!");
        info = JSON.parse(body);

        console.log('[INFO]', info);

        route = info.routes[0];
        if (route){
          var directions = [];
          leg = route.legs[0];

          for (var i = 0; i < leg.length; i++){
            steps = leg.steps;
            for (var j = 0; j < steps.length; j++){
              console.log(steps[i].html_instructions.replace(/<[^>]+>/g, '') + ' (' + steps[i].distance.text + ')');
              directions.push(steps[i].html_instructions.replace(/<[^>]+>/g, '') + ' (' + steps[i].distance.text + ')');
            }
          }
          console.log(directions);
          for (var x = 0; x < directions.length; x++){
            client.messages.create({
              to: req.body.From,
              from: constants.from_phone,
              body: directions[x],
            });
          }
        } else {
          client.messages.create({
            to: req.body.From,
            from: constants.from_phone,
            body: 'No route was found.', 
          });
        }
      }
    });
  } else{ 
    next();
  }
}

exports.google = function(req, res, next){
  console.log('[TEXT] \'google\''.green);

  var tokens = req.body.Body.split(" ");
  if (tokens[0].toLowerCase() == 'google'){
    var query = tokens.slice(1, -1).join(' ');
    var amount = tokens[tokens.length - 1];
    console.log('[DEBUG] Google', amount, 'results for', query);
    var body = 'Google ' + amount + ' results for ' + query;

    client.messages.create({
      to: req.body.From,
      from: constants.from_phone,
      body: body, 
    });
  } else {
    next();
  }
}

exports.invalid = function(req, res){
  console.log('[TEXT] \'invalid\'');
  var body = 'Invalid input: ' + req.body.Body + '.\nPlease type \'cmds\' to get list of available commands.'
  client.messages.create({
    to: req.body.From,
    from: constants.from_phone,
    body: body, 
  });
}
