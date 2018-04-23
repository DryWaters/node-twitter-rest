let request = '';
const baseAPIUrl = 'http://localhost:3000/api/';
const TYPE_OF_REQUEST = {
  ALL_TWEETS: '',
  ALL_USERS: 'users',
  ALL_LINKS: 'links',
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

  // attach event listeners to buttons
  document.getElementById('all-users').addEventListener('click', openRequest.bind(this, TYPE_OF_REQUEST.ALL_USERS));
  document.getElementById('all-tweets').addEventListener('click', openRequest.bind(this, TYPE_OF_REQUEST.ALL_TWEETS));
  document.getElementById('all-links').addEventListener('click', openRequest.bind(this, TYPE_OF_REQUEST.ALL_LINKS));
}

function openRequest(typeOfRequest, id) {
  let url = baseAPIUrl;
  switch (typeOfRequest) {
    case TYPE_OF_REQUEST.ALL_TWEETS:
      break;
    case TYPE_OF_REQUEST.ALL_USERS:
      url += TYPE_OF_REQUEST.ALL_USERS;
      break;
    case TYPE_OF_REQUEST.ALL_LINKS:
      url += TYPE_OF_REQUEST.ALL_LINKS;
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

  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let parsedJson = JSON.parse(request.responseText);
      switch (typeOfRequest) {
        case TYPE_OF_REQUEST.ALL_LINKS:
          displayAllLinks(parsedJson.message);
          break;
        case TYPE_OF_REQUEST.ALL_USERS:
          displayAllUsers(parsedJson.message);
          break;
        case TYPE_OF_REQUEST.ALL_TWEETS:
          displayAllTweets(parsedJson.message);
          break;
      }

    }
  }
  console.log(url);
  request.open('GET', url);
  request.send();
}

function displayAllLinks(links) {
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');
  const header = document.createElement('h2');
  header.innerHTML = 'All External Links';
  header.className = 'table__header';

  for (key in links) {
    let tRow = tbody.insertRow(-1);
    let tCell = tRow.insertCell(0);
    tCell.className = 'table--id';
    tCell.innerHTML = `Tweet with id: <span class='btn--tweet'><a onClick='openRequest(TYPE_OF_REQUEST.TWEET_BY_ID, ${key});'>${key}</a></span>`;
    links[key].forEach(function (url) {
      tRow = tbody.insertRow(-1);
      tCell = tRow.insertCell(0);
      tCell.innerHTML = `<a href=${url}>${url}</a>`;
    })
    table.appendChild(tbody);
  }
  document.getElementById('json-return').innerHTML = '';
  document.getElementById('json-return').appendChild(header);
  document.getElementById('json-return').appendChild(table);
}

function displayAllUsers(users) {
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');
  const title = document.createElement('h2');
  title.innerHTML = 'All Users';
  title.className = 'table__header';
  const headerRow = table.insertRow(0);
  const userNameHeader = document.createElement('th');
  const screenNameHeader = document.createElement('th');
  userNameHeader.innerHTML = "User Name";
  screenNameHeader.innerHTML = "Screen Name";
  userNameHeader.className = "table--id";
  screenNameHeader.className = "table--id";

  headerRow.appendChild(userNameHeader);
  headerRow.appendChild(screenNameHeader);

  users.forEach(function (user) {
    let tRow = tbody.insertRow(-1);
    let tScreenName = tRow.insertCell(0);
    let tUserName = tRow.insertCell(0);
    tUserName.innerHTML = user.name;
    tScreenName.innerHTML = user.screen_name;
  });
  table.appendChild(tbody);

  document.getElementById('json-return').innerHTML = '';
  document.getElementById('json-return').appendChild(title);
  document.getElementById('json-return').appendChild(table);
}

function displayAllTweets(tweets) {
  console.log(tweets);
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');
  const title = document.createElement('h2');
  title.innerHTML = 'All Tweets';
  title.className = 'table__header';
  const headerRow = table.insertRow(0);
  const createdDateHeader = document.createElement('th');
  const idHeader = document.createElement('th');
  const textHeader = document.createElement('th');
  createdDateHeader.innerHTML = "Created At";
  idHeader.innerHTML = "Tweet ID";
  textHeader.innerHTML = "Tweet Text";
  createdDateHeader.className = "table--id";
  idHeader.className = "table--id";
  textHeader.className = 'table--id';

  headerRow.appendChild(idHeader);
  headerRow.appendChild(createdDateHeader);
  headerRow.appendChild(textHeader);

  tweets.forEach(function (tweet) {
    let tRow = tbody.insertRow(-1);
    let tId = tRow.insertCell(-1);
    let tCreatedDate = tRow.insertCell(-1);
    let tText = tRow.insertCell(-1);
    tId.innerHTML = tweet.id_str;
    let date = new Date(tweet.created_at);
    tCreatedDate.innerHTML = tweet.created_at;
    tText.innerHTML = tweet.text;
  });
  table.appendChild(tbody);

  document.getElementById('json-return').innerHTML = '';
  document.getElementById('json-return').appendChild(title);
  document.getElementById('json-return').appendChild(table);
}