const express = require('express');
const app = express();
const router = express.Router();
const twitterJson = require('./favs.json');

// Register all endpoints and attach callback functions
router
  .route('/')
  .get(getAllTweets);

router
  .route('/users')
  .get(getAllUsers);

router
  .route('/links')
  .get(getExternalLinks);

router
  .route('/tweet/:tweet_id')
  .get(getTweetById);

router
  .route('/user/:user_id')
  .get(getUserById);

// Set Express to set the default entry point to be /api
// for cleaner routing
app.use('/api', router);

function getAllTweets(req, res) {
  let returnJson = [twitterJson.length];
  twitterJson.forEach(function(tweet, index) {
    returnJson[index] = {};
    if (tweet.hasOwnProperty('created_at')) {
      returnJson[index].created_at = tweet.created_at;
    }
    if (tweet.hasOwnProperty('id')) {
      returnJson[index].id_str = tweet.id_str;
    }
    if (tweet.hasOwnProperty('text')) {
      returnJson[index].text = tweet.text;
    }
  });

  res.json({ message: returnJson });
}

function getAllUsers(req, res) {
  let returnJson = [twitterJson.length];
  twitterJson.forEach(function(tweet, index){
    returnJson[index] = {};
    if (typeof tweet.user !== 'undefined') {
      returnJson[index].screen_name = tweet.user.screen_name;
      returnJson[index].name = tweet.user.name;
    }
  });
  
  res.json({ message: returnJson });
}

function getExternalLinks(req, res) {
  res.json({ message: 'All links' });
}

function getTweetById(req, res) {
  let returnJson = {};
  twitterJson.forEach(function(tweet) {
    if (tweet.id_str === req.params.tweet_id) {
      returnJson = tweet;
    }
  });
  res.json({ message: returnJson })
}

function getUserById(req, res) {
  res.json({ message: `User with id ${req.params.user_id}` })
}

// Start REST API Server on port 3000
app.listen(3000, () => console.log('Server running on port 3000'))