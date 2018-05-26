/**
 * @param {secret} MAILGUN_API_KEY - Mailgun API KEY
 * { "email":"tomptaylor@gmail.com"}
 */
var randomize = require('randomize');
var MongoClient = require('mongodb');
var request = require('request');

module.exports =  function (context, cb) {
  var MAILGUN_API_KEY = context.secrets.MAILGUN_API_KEY;
  var domain = context.secrets.MAILGUN_DOMAIN;
  var mailgun = require('mailgun-js')({apiKey: MAILGUN_API_KEY, domain: domain});

  var MONGO_URL = context.secrets.MONGO_URL;
  if (!MAILGUN_API_KEY) return cb(new Error('Mailgun configuration is missing'));

  var password = randomize('Aa0!', 10);
  context.body.active = 'true';
  context.body.password = password;
  const model = context.body;
  MongoClient.connect(MONGO_URL, (err, result) => {
  if (err) console.log('err');
    let db = result.db('testtom');
    var collection = db.collection('users');
    db.collection('users').insertOne(model, (err, result) => {
      if (err) { cb(err, err); } 
    });
  });

  var text = 
  'Thanks for registring.  Here is the link.  Here is your temporary password: ' + password;

  request.post('https://api.mailgun.net/v3/sandboxc1b3278d75d3438293e3da739a8e4980.mailgun.org/messages')
  .auth('api', MAILGUN_API_KEY)
  .form( { from: 'Your friendly <tomptaylor@gmail.com>',
            to: 'tomptaylor@gmail.com',
            subject: 'webtask test',
            text: text
  }).on('error', function(err) {
    cb(null, 'Error sending mail');
  }).on('response', function(response) {
    console.log('Got response ' + JSON.stringify(response));
    cb(null,response);
  });
};
