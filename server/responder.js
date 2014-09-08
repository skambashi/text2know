var twilio = require('twilio');
var request = require("request");
var constants = require('./../../constants');
var client = require('twilio')(constants.twilio_sid, constants.auth_token);
var restler = require('restler');
var colors = require('colors');

exports.help = function(user_num, server_num) {
  console.log('[TEXT_HELP]'.yellow);

  var body = 'help : Returns a list of available commands.\n'
    + 'reddit <subreddit> <amount> : Returns <amount> titles from <subreddit> subreddit.\n'
    + 'gmap <d|w|b|t> from <origin> to <destination> : Returns <amount> results from google search of <query>.';

  client.messages.create({
    to: user_num,
    from: server_num,
    body: body
  });
}

exports.reddit = function(user_num, server_num, subreddit, amount) {
  console.log('[TEXT_REDDIT]'.yellow);

  var url = 'http://reddit.com/r/' + subreddit + '/.json';

  // If the user has specified for results from the front page, use specific url
  if (subreddit == 'front') {
    url = 'http://reddit.com/.json';
  }
  // restler.get(url).on('complete', function(reddit) {
  //     console.log(('[TEXT_REDDIT] REDDIT RESPONSE: ' + reddit).yellow);
  //     for (var i = 0; i < amount; i++) {
  //       client.messages.create({
  //           to: user_num,
  //           from: server_num,
  //           body: reddit.data.children[i].data.title,
  //       });
  //     }
  //   });
  // }
  request({
    url: url
  }, function(error, response, body) {
    if (error) {
      console.log(("[TEXT_REDDIT_ERR] URL: " + url + " ERR:" + error).red);
    } else {
      info = JSON.parse(body);
      console.log(("[TEXT_REDDIT_SUCCESS] " + info).green);
      for (var i = 0; i < amount; i++) {
        client.messages.create({
          to: user_num,
          from: server_num,
          body: info.data.children[i].data.title
        });
      }
    }
  });
}

exports.gmap = function(user_num, server_num, type, from, to) {
  console.log('[TEXT_GMAP]'.yellow);
  switch (type) {
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
  request({
    url: 'http://maps.googleapis.com/maps/api/directions/json',
    qs: {
      origin: from,
      destination: to,
      mode: type
    }
  }, function(error, response, body) {
    if (error) {
      console.log(("[TEXT_GMAP_ERR] PARAMS: " + from + ", " + to + ", " + type + " ERR: " + error).red);
    } else {
      info = JSON.parse(body);
      route = info.routes[0];
      if (route) {
        var directions = [];
        leg = route.legs[0];
        steps = leg.steps;
        for (var j = 0; j < steps.length; j++) {
          directions.push(steps[j].html_instructions.replace(/<[^>]+>/g, '') + ' (' + steps[j].distance.text + ')');
        }

        console.log(('[TEXT_GMAP_SUCCESS] DIRECTIONS: ' + directions).green);

        for (var x = 0; x < directions.length; x++) {
          client.messages.create({
            to: user_num,
            from: server_num,
            body: '' + (x + 1) + '. ' + directions[x],
          });
        }
      } else {
        console.log("[TEXT_GMAP_NO_ROUTE_FOUND] FROM:", from, "TO:", to);
        client.messages.create({
          to: user_num,
          from: server_num,
          body: 'No route was found.',
        });
      }
    }
  });
}

exports.invalid = function(user_num, server_num, msg) {
  console.log('[TEXT_ERR]'.red);
  var body = 'Invalid input: ' + msg + '.\nPlease type \'help\' to get list of available commands.'
  client.messages.create({
    to: user_num,
    from: server_num,
    body: body,
  });
}

// TODO: GOOGLE SEARCH, DICTIONARY, WEATHER
