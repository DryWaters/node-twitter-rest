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

  request.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      if (typeOfRequest === TYPE_OF_REQUEST.ALL_LINKS) {
        displayAllLinks(JSON.parse(request.responseText));
      }
      // document.getElementById('json-return').innerHTML = request.responseText;
    }
  }
  console.log(url);
  request.open('GET', url);
  request.send();
}

function displayAllLinks({message}) {
  const table = document.createElement('table');
  const header = table.createTHead();
  const thead = header.insertRow(0);
  thead.innerHTML = 'HTML Links';

  const tbody = document.createElement('tbody');
  
  for (key in message) {
    let tRow = tbody.insertRow(-1);
    tRow.className = 'table--id';
    let tCell = tRow.insertCell(0);
    tCell.innerHTML = `Tweet with id: ${key}`;
    message[key].forEach(function(url) {
      tRow = tbody.insertRow(-1);
      tCell = tRow.insertCell(0);
      tCell.innerHTML = url;
    })
    table.appendChild(tbody);
  }
  
  
  document.getElementById('json-return').innerHTML = '';
  document.getElementById('json-return').appendChild(table);
  
}