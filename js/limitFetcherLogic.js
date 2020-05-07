function fetchLimitData() {
      let path = '/services/data/v45.0/limits';
      fetch(ENDPOINT_URL + path, {
        method: 'GET',
        headers: {
            'Authorization': SESSION_ID
        }
      })
      .then(json)
      .then(function (data) {
        console.log('Request succeeded with JSON response', data);
  addNewLimitLines(data);
        //createNotification('Data fetched successfully', 'We got back ' + data.size + ' records');
      })
      .catch(function (error) {
        console.log('Request failed', error);
      });
}

function addNewLimitLines(limitResponse) {
  var select = document.getElementById("limitInfos"); 
  Object.keys(limitResponse).forEach(function(key,index) {
    console.dir(limitResponse[key]);
    var el = document.createElement("span");
    console.dir(key);
    el.innerHTML = '' + key + '<br /> Max: ' + limitResponse[key].Max + ' Remaining: ' + limitResponse[key].Remaining + '<br /><br />';
    select.appendChild(el);
    // key: the name of the object key
    // index: the ordinal position of the key within the object 
  });
}
