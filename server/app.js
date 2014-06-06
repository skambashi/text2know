// Load modules.
var twilio = require('twilio');

// Create new REST API client to make authenticated requests against the twilio back end.
var client = new twilio.RestClient('accountSID','authToken');

// Pass in parameters to the REST API using an object literal notation.
// The REST client will handle authentication and response serialization for you.
client.sms.messages.create({
  to: 'MYNUMBER',
  from: 'TWILIONUMBER',
  body:'Hello World! Testing twilio and node.js!'
}, function(error, message){
  // The HTTP request to Twilio will run asynchronously.
  // This callback function will be called when a response
  // from Twilio is received. The 'error' var will contain error info.
  // If request is successful, 'error' value will be 'falsy'
  if (!error) {
    console.log('[RESPONSE] The SID for this SMS message is:');
    console.log(message.sid);
    console.log('[RESPONSE] Message sent on:');
    console.log(message.dateCreated);
  } else {
    console.log('[ERROR] gg no re.')
  }
});
