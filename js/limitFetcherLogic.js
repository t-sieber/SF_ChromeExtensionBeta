
document.addEventListener('DOMContentLoaded', function () {
    waitForDefinement();
}, true);


function waitForDefinement(){
    if(typeof SESSION_ID !== "undefined"){
        fetchLimitData();
    }
    else{
        setTimeout(waitForDefinement, 250);
    }
}

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


/**
 * addNewLimitLines - Appends the Limits to the HTML Dom
 *  
 * @param  {json} limitResponse Response from the API regarding limits 
 */ 
function addNewLimitLines(limitResponse) {
  var select = document.getElementById("limitInfos"); 
  Object.keys(limitResponse).forEach(function(key,index) {
    console.dir(limitResponse[key]);
    var el = document.createElement("span");
    el.innerHTML = '' + key + '<br /> Max: ' + limitResponse[key].Max + ' <br /> Remaining: ' + limitResponse[key].Remaining + '<br />'+calculateHealthyRemaining(limitResponse[key].Max, limitResponse[key].Remaining) +'<br /><br />';
    select.appendChild(el);
  });
}

function calculateHealthyRemaining(max, remaining) {
    let percentage = ((remaining / max) * 100).toFixed(2); 
    if (percentage < 25) {
      return '<span style=\"color: red;\"> Percentage left: ' + percentage + ' %</span>';
    } else if (percentage < 50) {
        return '<span style=\"color: gold;\"> Percentage left: ' + percentage + ' %</span>';
    } else {
        return '<span style=\"color: green;\"> Percentage left: ' + percentage + ' %</span>';
    }
}
