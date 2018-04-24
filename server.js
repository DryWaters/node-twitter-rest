const express = require('express');
const cors = require('cors');
const app = express();
const router = express.Router();
const twitterJson = require('./favs.json');

// Register all endpoints and attach callback functions
router
  .route('/tweets')
  .get(getAllTweets);

router
  .route('/users')
  .get(getAllUsers);

router
  .route('/links')
  .get(getAllLinks);

router
  .route('/tweets/:tweet_id')
  .get(getTweetById);

router
  .route('/users/:user_screen_name')
  .get(getUserByScreenName);

// Set Express's default entry point to be /api
// for cleaner routing, also use COR middleware for 
// allowing Cross-Origin Resource Sharing to work
// when testing on different domains
app.options('*', cors());
app.use(cors());
app.use('/api', router);

// return three keys of all tweets
// 'created_at', 'id_str', 'text'
function getAllTweets(req, res) {
  let returnJson = [twitterJson.length];
  twitterJson.forEach(function(tweet, index) {
    returnJson[index] = {};
    if (tweet.hasOwnProperty('created_at')) {
      returnJson[index].created_at = tweet.created_at;
    }
    if (tweet.hasOwnProperty('id_str')) {
      returnJson[index].id_str = tweet.id_str;
    }
    if (tweet.hasOwnProperty('text')) {
      returnJson[index].text = tweet.text;
    }
  });

  res.json({ message: returnJson });
}

// return user name and screen name
function getAllUsers(req, res) {
  let returnJson = [twitterJson.length];
  twitterJson.forEach(function(tweet, index){
    returnJson[index] = {};
    if (typeof tweet.user !== 'undefined' && tweet.user !== null) {
      returnJson[index].screen_name = tweet.user.screen_name;
      returnJson[index].name = tweet.user.name;
    }
  });
  
  res.json({ message: returnJson });
}

// returns all links
// with values that start with either
// http or https
function getAllLinks(req, res) {
  let returnJson = {};
  twitterJson.forEach(function(tweet, index) {
    returnJson[tweet.id_str] = [];
    checkLinksRecursively(tweet, returnJson[tweet.id_str]);   
  });
  res.json({ message: returnJson });
}

// recursively steps through object keys
// to check for strings that start with
// http or https
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

// return tweet by ID given by the 
// URL paramater /tweet/:tweet_id
// if for some reason the tweet_id
// is not found, it returns 404
// and text that it is not found
function getTweetById(req, res) {
  let returnJson = {};
  let isFound = false;
  twitterJson.forEach(function(tweet) {
    if (tweet.id_str === req.params.tweet_id) {
      returnJson = tweet;
      isFound = true;
    }
  });
  if (!isFound) {
    res.status(404).send('Not found');
  } else {
    res.json({ message: returnJson })
  }
}

// return user by screen name given by 
// the URL paramater /user/:user_screen_name
// if for some reason the user_screen_name
// is not found, it returns 404
// and text that it is not found
function getUserByScreenName(req, res) {
  let returnJson = {};
  let isFound = false;
  twitterJson.forEach(function(tweet) {
    if (tweet.user.screen_name === req.params.user_screen_name) {
      returnJson = tweet.user;
      isFound = true;
    }
  });
  if (!isFound) {
    res.status(404).send('Not found');
  } else {
    res.json({ message: returnJson })
  }
}

// Start REST API Server on port 3000
app.listen(3000, function(req, res) {
  console.log('Server running on port 3000');
});