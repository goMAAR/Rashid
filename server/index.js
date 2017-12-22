let apm = require('elastic-apm-node').start({
  appName:'inventory service', 
  serverUrl:'http://localhost:8200'
});

let express = require('express');
let app = express();
let port = process.env.PORT || 3000;
let bodyParser = require('body-parser');
let db = require('../knexfile.js');
let Users = require('../database/users.js');
let Tweets = require('../database/tweets.js');
let axios = require('axios');

//******************************************************
let MockAdapter = require('axios-mock-adapter');
// This sets the mock adapter on the default instance
let mock = new MockAdapter(axios);
mock.onPost('/newTweet').reply(201);
mock.onPost('/tweet/create').reply(201);
//******************************************************

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(apm.middleware.express());



app.post('/tweets', function(req, res) { 
//receives new tweet from client server service
//stores that tweet in database
//fetches that shaped tweet from database and sends it to client server service in response 
  let newObject = {
    "user_id": req.body.user_id, 
    "favorited": false,
    "created_at": req.body.created_at, 
    "truncated": false, 
    "text": req.body.text, 
    "retweet_count": 435, 
    "retweeted": true, 
    "in_reply_to_user_id": 0,
    "source": "Twitter for mac", 
    "in_reply_to_screen_name": 0, 
    "in_reply_to_status_id": 0, 
    "possibly_sensitive": true
  }

  let newEntry = new Tweets(newObject);
  newEntry.save(null, {method: 'insert'})
    .then(function(result) {
      Tweets.forge().orderBy('created_at', 'DESC')
        .fetch()
        .then(function(row) {
          postToUserEngagementService(row);
          postToSocialNetWorkProcessingService(row);
          res.status(201).send(row);
        })
        .catch(function(err) {
          res.status(201).send('tweets was successfully stored, but following error occured while retreiving it from database', err);
        })
    })
    .catch(function(err) {
      res.status(500).send(err);
    })
});


app.get('/', function(req, res) {
  console.log('heyyylooo1');
  res.status(200).send('thank you anne');
})

function postToUserEngagementService(object) {
  var currentTweet = {
     id: object.id,
     user_id: object.user_id,
     created_at: object.created_at,
     text: object.text
  };

  axios.post('/newTweet', currentTweet)
    .then(function(response) {
      console.log('following is the response from user engagment service', response);
    })
    .catch(function(err) {
      console.log('following error has occured while sending currentTweet to user engagment service', err);
    });
}

function postToSocialNetWorkProcessingService(object) {
  var newRelation = {
    id: object.id, 
    user_id: object.user_id, 
    created_at: object.created_at
  };
  
  axios.post('/tweet/create', newRelation)
    .then(function(response) {
      console.log('following is the response from social network processing service', response);
    })
    .catch(function(err) {
      console.log('following error has occured while sendig data to social network processing service'. err);
  });
}

app.listen(port, function() {
  console.log('server is running on port', port);
});