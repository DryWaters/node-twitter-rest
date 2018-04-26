// global XMLHTTPRequest object
let request = '';

// baseAPIUrl is either AWS server or localhost for testing
const baseAPIUrl = 'http://ec2-18-222-14-157.us-east-2.compute.amazonaws.com:3000/api/';
// const baseAPIUrl = 'http://localhost:3000/api/';

// object to contain constant
// API Endpoints and callback 
// function names
const TYPE_OF_REQUEST = {
  ALL_TWEETS: {
    END_POINT: 'tweets',
    CALLBACK: displayAllTweets
  },
  ALL_USERS: {
    END_POINT: 'users',
    CALLBACK: displayAllUsers
  },
  ALL_LINKS: {
    END_POINT: 'links',
    CALLBACK: displayAllLinks
  },
  TWEET_BY_ID:  {
    END_POINT: 'tweets/',
    CALLBACK: displayTweetById
  },
  USER_BY_SCREEN_NAME: {
    END_POINT: 'users/',
    CALLBACK: displayUserByScreenName
  }
}

// create the Ajax object,
// register listeners with callbacks
init();

// creates a global HTTP request
// and sets onClick listeners for 
// the 3 buttons
function init() {
  // create an XMLHttpRequest Object
  if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
  // create Microsoft ActiveXObject
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
  document.getElementById('all-users').addEventListener('click', 
    openRequest.bind(
      this,
      TYPE_OF_REQUEST.ALL_USERS,
      '')
    );
  document.getElementById('all-tweets').addEventListener('click', 
    openRequest.bind(
      this,
      TYPE_OF_REQUEST.ALL_TWEETS,
      '')
    );
  document.getElementById('all-links').addEventListener('click', 
    openRequest.bind(
      this,
      TYPE_OF_REQUEST.ALL_LINKS,
      '')
    );
}

// function that creates a request
// by appending to the default /api
// endpoint, the type of request and 
// a callback function that is stored 
// in the TYPE_OF_REQUEST obj
// PARAM id - is optional for requests
// that need a id (tweet_by_id and 
// user_by_screen_name), if not needed
// an empty string is passed in
function openRequest(typeOfRequest, id) {
  let url = `${baseAPIUrl}${typeOfRequest.END_POINT}${id}`;

  // call back function that calls the dynamic
  // table building function depending on the type
  // of request that was sent.
  // if the request returns 404 (Not Found), 
  // then displays unable to find
  // if server error, displays error message
  request.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const parsedJson = JSON.parse(request.responseText);
      typeOfRequest.CALLBACK(parsedJson.message);
    } else if (this.readyState === 4 && this.status === 404) {
      let h2 = document.createElement('h2');
      h2.innerHTML = 'Error finding requested object!';
      document.getElementById('json-return').innerHTML = '';
      document.getElementById('json-return').appendChild(h2);
    } else if (this.readyState === 4 && this.status === 500) {
      let h2 = document.createElement('h2');
      h2.innerHTML = 'Server Error: 500';
      document.getElementById('json-return').innerHTML = '';
      document.getElementById('json-return').appendChild(h2);
    }
  }
  request.open('GET', url);
  request.send();
}

// function that dynamically creates the table
// to display all links that are returned by
// the server.  Each Tweet ID has a onClick function
// attached that will call more information
// about that Tweet using the server
function displayAllLinks(links) {
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');

  for (key in links) {
    let tRow = tbody.insertRow(-1);
    let tCell = tRow.insertCell(0);
    tCell.className = 'table--id';
    tCell.innerHTML = `Tweet with id: 
      <span class='btn--link'>
        <a onClick='openRequest(TYPE_OF_REQUEST.TWEET_BY_ID, "${key}");'>
         ${key}
       </a>
     </span>`;
    links[key].forEach(function (url) {
      tRow = tbody.insertRow(-1);
      tCell = tRow.insertCell(0);
      tCell.innerHTML = `<a href=${url}>${url}</a>`;
    })
    table.appendChild(tbody);
  }
  document.getElementById('json-return').innerHTML = '';
  document.getElementById('json-return').appendChild(table);
}

// function that dynamically creates the table
// to display all users that are returned by
// the server.  Each Screen Name has a onClick function
// attached that will call more information
// about that User using the server
function displayAllUsers(users) {
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');
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
    tScreenName.innerHTML = `
      <span class='btn--link'>
        <a onClick='openRequest(TYPE_OF_REQUEST.USER_BY_SCREEN_NAME, "${user.screen_name}");'>
          ${user.screen_name}
        </a>
      </span>`;
  });
  // append generated table body to table
  table.appendChild(tbody);

  // clear old table (if exists) and attach new table
  document.getElementById('json-return').innerHTML = '';
  document.getElementById('json-return').appendChild(table);
}

// function that dynamically creates the table
// to display all tweets that are returned by
// the server.  Each Tweet ID has a onClick function
// attached that will call more information
// about that Tweet using the server
function displayAllTweets(tweets) {
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');
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

  // create the table header row
  headerRow.appendChild(idHeader);
  headerRow.appendChild(createdDateHeader);
  headerRow.appendChild(textHeader);

  // for each tweet create a new row
  tweets.forEach(function (tweet) {
    let tRow = tbody.insertRow(-1);
    let tId = tRow.insertCell(-1);
    let tCreatedDate = tRow.insertCell(-1);
    let tText = tRow.insertCell(-1);
    tId.innerHTML = `
      <span class='btn--link'>
        <a onClick='openRequest(TYPE_OF_REQUEST.TWEET_BY_ID, "${tweet.id_str}");'>
          ${tweet.id_str}
        </a>
      </span>`;
    let date = new Date(tweet.created_at);
    tCreatedDate.innerHTML = date.toLocaleString('en-US');
    tText.innerHTML = tweet.text;
  });
  // append generated table body to table
  table.appendChild(tbody);

  // clear old table (if exists) and attach new table
  document.getElementById('json-return').innerHTML = '';
  document.getElementById('json-return').appendChild(table);
}

// displays user info
// recursively creates rows for inner object keys
function displayUserByScreenName(user) {
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');
  checkKeysRecursively(user, tbody);
  table.appendChild(tbody);
  document.getElementById('json-return').innerHTML = '';
  document.getElementById('json-return').appendChild(table);
}

// displays tweet info
// recursively creates rows for inner object keys
function displayTweetById(tweet) {
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');

  checkKeysRecursively(tweet, tbody);
  table.appendChild(tbody);
  document.getElementById('json-return').innerHTML = '';
  document.getElementById('json-return').appendChild(table);
}

// recursively checks keys for inner objects
// if the value of the obj[prop] is null
// then it prints out the string 'null' instead
// of just an empty value in the table
function checkKeysRecursively(obj, tbody) {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (typeof obj[prop] === 'object' && obj[prop] !== null) {
        checkKeysRecursively(obj[prop], tbody);
      } else {
        let tRow = tbody.insertRow(-1);
        let tKey = tRow.insertCell(-1);
        let tValue = tRow.insertCell(-1);
        tKey.innerHTML = prop;
        tKey.className = 'table--id';
        if (obj[prop] === null)  {
          tValue.innerHTML = 'null';
        } else {
          tValue.innerHTML = obj[prop];
        }
        tbody.appendChild(tRow);
      }
    }
  }
}