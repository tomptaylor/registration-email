/**
 * @param {secret} MAILGUN_API_KEY - Mailgun API KEY
 * { "email":"tomptaylor@gmail.com"}
 */
var randomize = require('randomize');
var MongoClient = require('mongodb');
var request = require('request');

module.exports =  function (context, cb) {
var MAILGUN_API_KEY = context.secrets.MAILGUN_API_KEY;
var domain = 'https://api.mailgun.net/v3/sandboxc1b3278d75d3438293e3da739a8e4980.mailgun.org/messages'
var mailgun = require('mailgun-js')({apiKey: MAILGUN_API_KEY, domain: domain});

  var MONGO_URL = context.secrets.MONGO_URL;
  if (!MAILGUN_API_KEY) return cb(new Error('Mailgun configuration is missing'))

  var password = randomize('Aa0!', 10);
        context.body.active = 'true';
        context.body.password = password;
    const model = context.body;

  //     db.collection(`${mytable}`).insertOne(model, (err, result) => {
  //     if (err)  cb(err,null);
  //     cb(null, result);
  //   });
  // });

  MongoClient.connect(MONGO_URL, (err, result) => {
    if (err) console.log('err');
      let db = result.db('testtom');
      var collection = db.collection('users');
        console.log('about to insert');
        console.log(model)
        db.collection('users').insertOne(model, (err, result) => {
          if (err) {
            cb(err, err)
          } 
        });
  });

  var text = 
  'Thanks for registring.  Here is the link.  Here is your temporary password: ' + password;
  
  // request.post('https://api.mailgun.net/v3/sandboxc1b3278d75d3438293e3da739a8e4980.mailgun.org/messages')
  // .auth('api', MAILGUN_API_KEY)
  // .form( { from: 'Your friendly <tomptaylor@gmail.com>',
  //           to: context.data.email,
  //           subject: 'webtask test',
  //           text: text
  // }).on('error', function(err) {
  //   cb(null, 'Error sending mail');
  // }).on('response', function(response) {
  //   console.log('Got response ' + JSON.stringify(response))
  //   cb(null,response);
  // })

 var data = {
    from: 'Excited User <me@samples.mailgun.org>',
//    from: 'Mailgun Sandbox <postmaster@sandboxc1b3278d75d3438293e3da739a8e4980.mailgun.org>',
    to: 'User <tomptaylor@gmail.com>',
    subject: 'Hello',
    text: 'Testing some Mailgun awesomness!'
  };

  mailgun.messages().send(data, function (error, body) {
    if (error) {
        console.log(error);
        console.log('Got response ' + JSON.stringify(error))
     cb(error,null);
    }
    else {
      console.log(body);
      console.log('Got response ' + JSON.stringify(body))
    cb(null,body);
    }
    
  });
  
}
