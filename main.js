let request = '';
const baseAPIUrl = 'http://localhost:3000/api/';
const TYPE_OF_REQUEST = {
  ALL_TWEETS: '',
  ALL_USERS: 'users',
  TWEET_BY_ID: 'tweet/',
  USER_BY_SCREEN_NAME: 'user/'
}

init();

function init() {
  // create an XMLHttpRequest Object
  if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    try {
      request = new ActiveXObject('Msxlm2.XMLHTTP');
    } catch (e) {
      {
        try {
          request = new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e) {
        }
      }
    }
  }

  document.getElementById('all-users').addEventListener('click', getAllUsers);
  document.getElementById('all-tweets').addEventListener('click', getAllTweets);
  document.getElementById('tweet-by-id').addEventListener('click', getTweetById);
  document.getElementById('user-by-screen-name').addEventListener('click', getUserByScreenName);
}

function getUserByScreenName() {
  const userScreenName = document.getElementById('user-screen-name').value;
  if (userScreenName) {
    openRequest(TYPE_OF_REQUEST.USER_BY_SCREEN_NAME, userScreenName);
  }
}

function getTweetById() {
  const tweetId = document.getElementById('tweet-id').value;
  if (tweetId) {
    openRequest(TYPE_OF_REQUEST.TWEET_BY_ID, tweetId);
  }
}

function getAllUsers() {
  openRequest(TYPE_OF_REQUEST.ALL_USERS);
}

function getAllTweets() {
  openRequest(TYPE_OF_REQUEST.ALL_TWEETS);
}

function openRequest(typeOfRequest, id) {
  let url = baseAPIUrl;
  switch (typeOfRequest) {
    case TYPE_OF_REQUEST.ALL_TWEETS:
      break;
    case TYPE_OF_REQUEST.ALL_USERS:
      url += TYPE_OF_REQUEST.ALL_USERS;
      break;
    case TYPE_OF_REQUEST.TWEET_BY_ID:
      url += TYPE_OF_REQUEST.TWEET_BY_ID;
      url += id
      break;
    case TYPE_OF_REQUEST.USER_BY_SCREEN_NAME:
      url += TYPE_OF_REQUEST.USER_BY_SCREEN_NAME;
      url += id
      break;
  }

  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById('json-return').innerHTML = request.responseText;
    }
  }
  console.log(url);
  request.open('GET', url);
  request.send();



}