var sessionId;

var endpointURL;


document.addEventListener('DOMContentLoaded', function () {
  retrieveSFSessionId();

  if (document.querySelector('button') != undefined) {
    document.getElementById('fetchInfo').addEventListener('click', function() {
      loadCompanyInformation();
      loadPageLayouts();
    }, false);
    document.getElementById('fetchLayout').addEventListener('click', function() {
      findFields();
    }, false);
    document.getElementById('fetchLimitInfo').addEventListener('click', function() {
      fetchLimitData();
    }, false);
  }



}, true);


function retrieveSFSessionId() {

  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
      let currentURL = tabs[0].url;
      ENDPOINT_URL = currentURL.substring(0, currentURL.indexOf('/lightning'));
      let path = '/services/data/v47.0/';
      fetch(ENDPOINT_URL + path, {
        method: 'GET'
      })
      .then(function (data) {
        if (endpointURL == undefined) {
          let endpoint = data.url;
          endpointURL = endpoint.substring(0, endpoint.indexOf('/services'));
          readCookie(currentURL, 'sid', function(bearer_token) {
            var bearer = 'Bearer ' + bearer_token;
            SESSION_ID = bearer;
          });
        }
      })
      .catch(function (error) {
        console.log('Request failed', error);
      });
  });


}


function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

function json(response) {
    return response.json();
}






function readCookie (domain, cookie_name, callback) {
  if (cookie_name == 'sid') {
    domain = endpointURL;
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
