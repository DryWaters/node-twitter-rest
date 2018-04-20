let request = '';
const baseAPIUrl = 'http://localhost:3000/api/';
const TYPE_OF_REQUEST = {
  ALL_TWEETS: '',
  ALL_USERS: 'users'
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

}

function getAllUsers() {
  openRequest(TYPE_OF_REQUEST.ALL_USERS);
}

function getAllTweets() {
  openRequest(TYPE_OF_REQUEST.ALL_TWEETS);
}

function openRequest(typeOfRequest) {
  let url = baseAPIUrl;
  switch (typeOfRequest) {
    case TYPE_OF_REQUEST.ALL_TWEETS:
      break;
    case TYPE_OF_REQUEST.ALL_USERS:
      url += TYPE_OF_REQUEST.ALL_USERS;
      break;
  }

  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById('json-return').innerHTML = request.responseText;
    }
  }
  console.log(request);
  request.open('GET', url);
  request.send();



}