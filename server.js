const express = require('express');
const cors = require('cors');
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
  .get(getAllLinks);

router
  .route('/tweet/:tweet_id')
  .get(getTweetById);

router
  .route('/user/:user_screen_name')
  .get(getUserByScreenName);

// Set Express to set the default entry point to be /api
// for cleaner routing, also use COR middleware for 
// allowing cross-scripting to work
app.options('*', cors());
app.use(cors());
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

function getAllLinks(req, res) {
  let returnJson = {};
  twitterJson.forEach(function(tweet, index) {
    returnJson[tweet.id_str] = [];
    checkLinksRecursively(tweet, returnJson[tweet.id_str]);   
  });
  res.json({ message: returnJson });
}

function checkLinksRecursively(obj, links) {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (typeof obj[prop] === 'object' && obj[prop] !== null) {
        checkLinksRecursively(obj[prop], links);
      } else if (typeof obj[prop] === 'string' && (obj[prop].startsWith('http://') || obj[prop].startsWith('https://'))) {
        links.push(obj[prop]);
      }
    }
  }
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

function getUserByScreenName(req, res) {
  let returnJson = {};
  twitterJson.forEach(function(tweet) {
    if (tweet.user.screen_name === req.params.user_screen_name) {
      returnJson = tweet.user;
    }
  });
  res.json({ message: returnJson })
}

// Start REST API Server on port 3000
app.listen(3000, function(req, res) {
  console.log('Server running on port 3000');
});