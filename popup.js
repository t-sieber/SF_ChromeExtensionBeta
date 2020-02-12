var sessionId;

var endpointURL;

document.addEventListener('DOMContentLoaded', function () {
  retrieveSFSessionId();

  if (document.querySelector('button') != undefined) {
    document.querySelector('button').addEventListener('click', function() {
      loadCompanyInformation();
      loadPageLayouts();
    }, false);
  }



}, true);


function retrieveSFSessionId() {

  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    let currentURL = tabs[0].url;
      let path = '/services/data/v47.0/';
      fetch(currentURL.substring(0, currentURL.indexOf('/lightning')) + path, {
        method: 'GET'
      })
      .then(function (data) {
        if (endpointURL == undefined) {
          let endpoint = data.url;
          endpointURL = endpoint.substring(0, endpoint.indexOf('/services'));
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

function loadCompanyInformation() {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    let currentURL = tabs[0].url;
    readCookie(currentURL, 'sid', function(bearer_token) {
      var bearer = 'Bearer ' + bearer_token;
      let path = '/services/data/v33.0/query/?q=SELECT%20Name%20,%20PrimaryContact%20,%20InstanceName%20FROM%20Organization';
      fetch(currentURL.substring(0, currentURL.indexOf('/lightning')) + path, {
        method: 'GET',
        headers: {
            'Authorization': bearer
        }
      })
      .then(json)
      .then(function (data) {
        console.log('Request succeeded with JSON response', data);
        parseCompanyInformation(data);
        //createNotification('Data fetched successfully', 'We got back ' + data.size + ' records');
      })
      .catch(function (error) {
        console.log('Request failed', error);
      });
    })
  });
}

function parseCompanyInformation(jsonResponse) {
  let dataCompany = jsonResponse.records[0];
  document.getElementsByClassName('companyInfo_Name')[0].innerText = 'Name: ' + dataCompany.Name;
  document.getElementsByClassName('companyInfo_Contact')[0].innerText = 'Primary Contact: ' + dataCompany.PrimaryContact;
  document.getElementsByClassName('companyInfo_Instance')[0].innerText = 'Instance: ' + dataCompany.InstanceName;
}


function loadPageLayouts() {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    let currentURL = tabs[0].url;
    readCookie(currentURL, 'sid', function(bearer_token) {
      var bearer = 'Bearer ' + bearer_token;
      let path = '/services/data/v33.0/tooling/query/?q=Select%20EntityDefinition.Label,%20Name%20,%20TableEnumOrId%20,EntityDefinition.QualifiedAPIName%20from%20Layout';
      fetch(currentURL.substring(0, currentURL.indexOf('/lightning')) + path, {
        method: 'GET',
        headers: {
            'Authorization': bearer
        }
      })
      .then(json)
      .then(function (data) {
        console.log('Request succeeded with JSON response', data);
        parseValuesIntoPicklists(data);
        //createNotification('Data fetched successfully', 'We got back ' + data.size + ' records');
      })
      .catch(function (error) {
        console.log('Request failed', error);
      });
    })
  });
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
