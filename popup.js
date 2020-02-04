let sessionId;

document.addEventListener('DOMContentLoaded', function () {
  
   
  document.querySelector('button').addEventListener('click', function() {
    //retrieveSFID();
    loadPageLayouts();
  }, false);

}, true);

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function json(response) {
  return response.json()
}

function loadPageLayouts() {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    let currentURL = tabs[0].url;
    console.dir(tabs[0]);
    readCookie(currentURL, 'sid', function(bearer_token) {
      var bearer = 'Bearer ' + bearer_token;
      let path = '/services/data/v33.0/tooling/query/?q=SELECT%20Layout.TableEnumOrId,%20Layout.EntityDefinition.Label,%20Layout.EntityDefinition.QualifiedAPIName%20FROM%20ProfileLayout';
      debugger;
      fetch(currentURL.substring(0, currentURL.indexOf('/lightning')) + path, {
        method: 'GET',
        headers: {
            'Authorization': bearer
        }
      })
      .then(json)
      .then(function (data) {
        console.log('Request succeeded with JSON response', data);
        createNotification('Data fetched successfully', 'We got back ' + data.size + ' records');
      })
      .catch(function (error) {
        console.log('Request failed', error);
      });
    })
  }); 
}


function readCookie (domain, cookie_name, callback) {
  if (cookie_name == 'sid') {
    domain = domain.substring(0, domain.indexOf('.lightning')) + '--c.documentforce.com';
  }
  
  chrome.cookies.get({"url": domain, "name": cookie_name}, function(cookie) {
        if(callback) {
            callback(cookie.value);
        }
    })
}

function createNotification (title, message) {
  chrome.notifications.create(
    'name-for-notification ' + new Date().getUTCDate() + new Date().getMilliseconds(),
    {   
      type: 'basic', 
      iconUrl: 'identity_external_logo.png', 
      title: title, 
      message: message 
    },
    function() {} 
  );
}

function retrieveSFID() {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    readCookie(tabs[0].url, 'sid', function(id) {
      createNotification('Your Salesforce SessionId', 'Your Id is: ' + id);
    });
  });
}
